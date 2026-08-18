const bcrypt = require('bcryptjs')
const Otp = require('../models/Otp')
const { sendVerificationEmail } = require('../lib/mailer')
const { sendVerificationSms, isTwilioConfigured } = require('../lib/sms')

const OTP_LENGTH = 6
const EXPIRY_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5

function generateCode() {
  const min = 10 ** (OTP_LENGTH - 1)
  const max = 10 ** OTP_LENGTH
  return String(Math.floor(min + Math.random() * (max - min)))
}

function normalizeDestination(channel, destination) {
  const trimmed = String(destination || '').trim()
  return channel === 'email' ? trimmed.toLowerCase() : trimmed
}

// Twilio env değişkenleri eksikse (bkz. lib/sms.js isTwilioConfigured) sunucu
// konsoluna yazdırmaya devam ediyoruz - gönderim ucu asla "kırık" değil.
function simulatePhoneSend(destination, code) {
  console.log(`[otp] SMS provider not configured - phone OTP for ${destination || '(unknown)'}: ${code}`)
}

async function sendOtp(req, res) {
  const { channel, destination: rawDestination, force } = req.body || {}
  if (channel !== 'phone' && channel !== 'email') {
    return res.status(400).json({ error: 'Invalid channel' })
  }
  const destination = normalizeDestination(channel, rawDestination)
  if (!destination) {
    return res.status(400).json({ error: 'Destination is required' })
  }

  // `force` SADECE production dışında cooldown'u atlıyor - Developer Panel'in
  // "Regenerate" kontrolü için (bkz. VerificationService.devRegenerateOtp).
  const bypassCooldown = !!force && process.env.NODE_ENV !== 'production'

  const now = Date.now()
  const existing = await Otp.findOne({ channel, destination })
  if (existing && !bypassCooldown && now - existing.generatedAt < RESEND_COOLDOWN_MS) {
    const retryAfterMs = RESEND_COOLDOWN_MS - (now - existing.generatedAt)
    return res.status(429).json({ error: 'Please wait before requesting another code', retryAfterMs })
  }

  const code = generateCode()
  const codeHash = await bcrypt.hash(code, 10)
  const expiresAt = new Date(now + EXPIRY_MS)

  try {
    if (channel === 'email') {
      await sendVerificationEmail(destination, code)
    } else if (isTwilioConfigured()) {
      await sendVerificationSms(destination, code)
    } else {
      simulatePhoneSend(destination, code)
    }
  } catch (err) {
    console.error('[otp] Failed to send verification code', err)
    return res.status(502).json({ error: 'Could not send verification code. Please try again.' })
  }

  await Otp.findOneAndUpdate(
    { channel, destination },
    { channel, destination, codeHash, attempts: 0, generatedAt: now, expiresAt },
    { upsert: true }
  )

  res.json({
    sent: true,
    expiresAt: expiresAt.getTime(),
    // Sadece production dışında - dev/test kolaylığı için (bkz. DevPanel >
    // Verification), gerçek üretimde bu alan hiç dönmüyor.
    devCode: process.env.NODE_ENV === 'production' ? undefined : code,
  })
}

async function verifyOtp(req, res) {
  const { channel, destination: rawDestination, code } = req.body || {}
  if (channel !== 'phone' && channel !== 'email') {
    return res.status(400).json({ error: 'Invalid channel' })
  }
  const destination = normalizeDestination(channel, rawDestination)
  const record = await Otp.findOne({ channel, destination })

  if (!record) return res.json({ valid: false, error: 'No code was sent to this destination' })
  if (Date.now() > record.expiresAt.getTime()) {
    await Otp.deleteOne({ _id: record._id })
    return res.json({ valid: false, error: 'Code expired' })
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    await Otp.deleteOne({ _id: record._id })
    return res.json({ valid: false, error: 'Too many attempts. Please request a new code.' })
  }

  const valid = await bcrypt.compare(String(code || '').trim(), record.codeHash)
  if (!valid) {
    record.attempts += 1
    await record.save()
    return res.json({ valid: false })
  }

  await Otp.deleteOne({ _id: record._id })
  res.json({ valid: true })
}

module.exports = { sendOtp, verifyOtp }
