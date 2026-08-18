const bcrypt = require('bcryptjs')
const Otp = require('../models/Otp')
const User = require('../models/User')
const { sendPasswordResetEmail } = require('../lib/mailer')

const CODE_LENGTH = 6
// Diğer OTP'lerden (5dk) biraz daha uzun - kullanıcı e-postaya gidip
// dönene kadar geçen süre burada daha kritik.
const EXPIRY_MS = 10 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5
const CHANNEL = 'password-reset'

function generateCode() {
  const min = 10 ** (CODE_LENGTH - 1)
  const max = 10 ** CODE_LENGTH
  return String(Math.floor(min + Math.random() * (max - min)))
}

// Hesap oluşturma formuyla BİREBİR aynı kural seti (bkz.
// app/services/AuthService.ts isPasswordValid).
function isPasswordValid(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim()
}

async function forgotPassword(req, res) {
  const email = normalizeEmail(req.body?.email)
  const locale = req.body?.locale === 'tr' ? 'tr' : 'en'
  if (!email) return res.status(400).json({ error: 'email is required' })

  const user = await User.findOne({ email })
  // BİLİNÇLİ ürün kararı: kayıtlı olmayan bir e-postaya kod göndermek yerine
  // net bir hata dönüyoruz (enumeration koruması kasıtlı olarak feda edildi -
  // bkz. talep). Kullanıcı hangi e-postayla kayıtlı olduğunu bilmiyorsa bunu
  // burada öğreniyor.
  if (!user) return res.status(404).json({ error: 'No account found with this email' })

  const now = Date.now()
  const existing = await Otp.findOne({ channel: CHANNEL, destination: email })
  if (existing && now - existing.generatedAt < RESEND_COOLDOWN_MS) {
    const retryAfterMs = RESEND_COOLDOWN_MS - (now - existing.generatedAt)
    return res.status(429).json({ error: 'Please wait before requesting another code', retryAfterMs })
  }

  const code = generateCode()
  const codeHash = await bcrypt.hash(code, 10)
  const expiresAt = new Date(now + EXPIRY_MS)

  try {
    await sendPasswordResetEmail(email, code, locale)
  } catch (err) {
    console.error('[password-reset] Failed to send reset email', err)
    return res.status(502).json({ error: 'Could not send reset code. Please try again.' })
  }

  await Otp.findOneAndUpdate(
    { channel: CHANNEL, destination: email },
    { channel: CHANNEL, destination: email, codeHash, attempts: 0, generatedAt: now, expiresAt },
    { upsert: true }
  )

  res.json({
    sent: true,
    // Sadece production dışında - dev/test kolaylığı için, gerçek üretimde
    // bu alan hiç dönmüyor (bkz. otpController.js aynı desen).
    devCode: process.env.NODE_ENV === 'production' ? undefined : code,
  })
}

// "Kodu gir" ekranında ANINDA geri bildirim için - kaydı SİLMİYOR/tüketmiyor,
// gerçek/kesin doğrulama (ve tüketim) resetPassword'da tekrar yapılıyor.
// Client-only bir "doğrulandı" bayrağına asla güvenilmiyor.
async function verifyResetCode(req, res) {
  const email = normalizeEmail(req.body?.email)
  const code = String(req.body?.code || '').trim()
  const record = await Otp.findOne({ channel: CHANNEL, destination: email })

  if (!record) return res.json({ valid: false, error: 'No code was sent to this email' })
  if (Date.now() > record.expiresAt.getTime()) return res.json({ valid: false, error: 'Code expired' })
  if (record.attempts >= MAX_ATTEMPTS) {
    return res.json({ valid: false, error: 'Too many attempts. Please request a new code.' })
  }

  const valid = await bcrypt.compare(code, record.codeHash)
  if (!valid) {
    record.attempts += 1
    await record.save()
    return res.json({ valid: false })
  }
  res.json({ valid: true })
}

async function resetPassword(req, res) {
  const email = normalizeEmail(req.body?.email)
  const code = String(req.body?.code || '').trim()
  const newPassword = req.body?.newPassword

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character',
    })
  }

  const record = await Otp.findOne({ channel: CHANNEL, destination: email })
  if (!record) return res.status(400).json({ error: 'No code was sent to this email' })
  if (Date.now() > record.expiresAt.getTime()) {
    await Otp.deleteOne({ _id: record._id })
    return res.status(400).json({ error: 'Code expired' })
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id })
    return res.status(400).json({ error: 'Too many attempts. Please request a new code.' })
  }

  const valid = await bcrypt.compare(code, record.codeHash)
  if (!valid) {
    record.attempts += 1
    await record.save()
    return res.status(400).json({ error: 'Incorrect code' })
  }

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ error: 'User not found' })

  const sameAsOld = await user.comparePassword(newPassword)
  if (sameAsOld) return res.status(400).json({ error: 'New password must be different from your current password' })

  user.passwordHash = await User.hashPassword(newPassword)
  await user.save()
  await Otp.deleteOne({ _id: record._id })

  res.json({ ok: true })
}

module.exports = { forgotPassword, verifyResetCode, resetPassword }
