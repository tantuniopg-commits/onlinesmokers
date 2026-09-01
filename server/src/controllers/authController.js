const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendPasswordChangedEmail, sendWelcomeEmail } = require('../lib/mailer')
const { isAdminEmail } = require('../lib/admins')

const STATS_FIELDS = ['journeyDay', 'currentStreak', 'journeyTimestamp', 'totalXP', 'totalRitualCount', 'totalRitualTimeSec']

// Gövdeden gelen HER alan önce string'e zorlanıp trim'leniyor - bir saldırgan
// `{"$gt":""}` gibi bir nesne gönderse bile Mongo sorgusuna operatör olarak
// değil, düz (anlamsız) bir string olarak giriyor (express-mongo-sanitize
// zaten `$`/`.` anahtarlarını da temizliyor - bu ikinci savunma katmanı).
function str(v) {
  return typeof v === 'string' ? v.trim() : ''
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email)
}
// Sunucu tarafı uzunluk tavanları - şema seviyesinde de olsa buradan net
// hata dönmek daha iyi.
const MAX_NAME = 80
const MAX_GENDER = 32
const MAX_BIRTHDATE = 10 // "YYYY-MM-DD"

// Hesap oluşturma formuyla BİREBİR aynı kural seti (bkz.
// app/services/AuthService.ts isPasswordValid/getPasswordRuleStatus) -
// istemci tarafındaki kontrol sadece UX, gerçek/kesin doğrulama burada.
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

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    stats: user.stats,
    isAdmin: isAdminEmail(user.email),
  }
}

function pickStats(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  const stats = {}
  for (const key of STATS_FIELDS) {
    if (!(key in input)) continue
    const raw = input[key]
    if (key === 'journeyTimestamp') {
      // null ("hiç ritüel yapılmadı") VEYA pozitif bir epoch ms
      if (raw === null) stats[key] = null
      else if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) stats[key] = raw
      continue
    }
    // Diğer tüm sayaçlar: sonlu, negatif olmayan sayı
    if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
      stats[key] = Math.min(raw, Number.MAX_SAFE_INTEGER)
    }
  }
  return Object.keys(stats).length ? stats : undefined
}

async function register(req, res) {
  const body = req.body || {}
  const name = str(body.name).slice(0, MAX_NAME)
  const email = str(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const phone = str(body.phone)
  const gender = str(body.gender).slice(0, MAX_GENDER)
  const birthDate = str(body.birthDate).slice(0, MAX_BIRTHDATE)

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' })
  }
  // İstemci formuyla + şifre sıfırlamayla BİREBİR aynı kural seti - istemci
  // kontrolü sadece UX, kesin doğrulama burada.
  if (!isPasswordValid(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character',
    })
  }
  // birthDate verildiyse geçerli bir geçmiş tarih + 13+ olmalı (COPPA /
  // Gizlilik Politikası). İstemci de kontrol ediyor ama kesin sınır burada.
  if (birthDate) {
    const dob = new Date(birthDate)
    const thirteenAgo = new Date()
    thirteenAgo.setFullYear(thirteenAgo.getFullYear() - 13)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(dob.getTime()) || dob > thirteenAgo) {
      return res.status(400).json({ error: 'You must be at least 13 years old to create an account' })
    }
  }

  // Email ve telefon HER İKİSİ de benzersiz - bir hesap silinmeden aynı
  // email veya aynı telefonla ikinci bir hesap açılamıyor (bkz. User.js
  // şemasındaki unique index'ler - buradaki kontrol daha net bir hata
  // mesajı dönmek için, gerçek garanti veritabanı seviyesinde).
  const existingEmail = await User.findOne({ email })
  if (existingEmail) return res.status(409).json({ error: 'Email already in use' })

  if (phone) {
    const existingPhone = await User.findOne({ phone })
    if (existingPhone) return res.status(409).json({ error: 'Phone number already in use' })
  }

  const resolvedLocale = body.locale === 'tr' ? 'tr' : 'en'
  const passwordHash = await User.hashPassword(password)
  const user = await User.create({
    name,
    email,
    phone: phone || undefined,
    gender: gender || undefined,
    birthDate: birthDate || undefined,
    passwordHash,
    stats: pickStats(body.stats),
    locale: resolvedLocale,
  })

  res.status(201).json({ token: signToken(user._id), user: toPublicUser(user) })

  // Yanıt ZATEN gönderildi - hoş geldin maili kullanıcıyı bekletmiyor,
  // best-effort (başarısız olsa da hesap oluşturma geçerli kalıyor).
  const firstName = name.trim().split(' ')[0]
  sendWelcomeEmail(user.email, firstName, resolvedLocale).catch((err) => {
    console.error('[auth] Failed to send welcome email', err)
  })
}

async function login(req, res) {
  const body = req.body || {}
  const email = str(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await User.findOne({ email })
  const valid = user && (await user.comparePassword(password))
  // Aynı jenerik mesaj + (kullanıcı yoksa bile) sahte bir bcrypt karşılaştırma
  // yapılmadığı için minik bir zamanlama farkı kalıyor - kabul edilebilir;
  // asıl brute-force koruması rate limit (bkz. index.js authLimiter).
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  res.json({ token: signToken(user._id), user: toPublicUser(user) })
}

async function me(req, res) {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: toPublicUser(user) })
}

// Bir cihazdaki ritüel tamamlanınca (bkz. lib/journey.ts completeRitual)
// en güncel ilerlemeyi sunucuya yazıyor - başka bir cihaz/tarayıcıdan
// giriş yapıldığında "kaldığı yerden devam" bunun sayesinde çalışıyor.
async function updateStats(req, res) {
  const stats = pickStats(req.body?.stats)
  if (!stats) return res.status(400).json({ error: 'stats is required' })

  const user = await User.findByIdAndUpdate(req.userId, { $set: { stats } }, { new: true })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: toPublicUser(user) })
}

// Hesap Ayarları > İsmi Düzenle (bkz. app/profile/settings/account/page.tsx).
async function updateProfile(req, res) {
  const name = str(req.body?.name).slice(0, MAX_NAME)
  if (!name) return res.status(400).json({ error: 'name is required' })
  const user = await User.findByIdAndUpdate(req.userId, { $set: { name } }, { new: true })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: toPublicUser(user) })
}

// Bildirim tercihleri / dil senkronu - client bunu ayarlar sayfasındaki bir
// toggle veya dil değişince best-effort çağırıyor (bkz. lib/authApi.ts
// updatePreferencesRequest). Sunucudaki soğuma hatırlatma job'ı (bkz.
// jobs/cooldownReminder.js) kime/hangi dilde mail atacağını buradan
// öğreniyor - token gerektirmeyen bir arka plan işi olduğu için bu bilgi
// önceden senkron edilmiş olmalı.
async function updatePreferences(req, res) {
  const { notificationPrefs, locale } = req.body || {}
  const update = {}
  if (notificationPrefs && typeof notificationPrefs === 'object') {
    if ('dailyRitualReminder' in notificationPrefs) {
      update['notificationPrefs.dailyRitualReminder'] = !!notificationPrefs.dailyRitualReminder
    }
  }
  if (locale === 'en' || locale === 'tr') update.locale = locale

  const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ ok: true })
}

// Hesap Ayarları > Şifreyi Değiştir - mevcut şifre doğrulanmadan değişim
// yapılmıyor (bkz. comparePassword, User.js).
async function updatePassword(req, res) {
  const { currentPassword, newPassword, locale } = req.body || {}
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' })
  }
  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character',
    })
  }

  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const valid = await user.comparePassword(currentPassword)
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'New password must be different from your current password' })
  }

  user.passwordHash = await User.hashPassword(newPassword)
  await user.save()
  res.json({ ok: true })

  // Yanıt ZATEN gönderildi - mail gönderimi kullanıcıyı bekletmiyor, best-
  // effort (başarısız olsa da şifre değişimi geçerli kalıyor).
  sendPasswordChangedEmail(user.email, locale === 'tr' ? 'tr' : 'en').catch((err) => {
    console.error('[auth] Failed to send password-changed email', err)
  })
}

// Hesap Ayarları > Hesabı Sil - kullanıcıyı DB'den GERÇEKTEN siliyor (bkz.
// leaderboard() - silinen bir hesap User.find({}) sorgusunda artık hiç
// dönmüyor, leaderboard'da otomatik olarak görünmez oluyor).
async function removeAccount(req, res) {
  const user = await User.findByIdAndDelete(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ ok: true })
}

// Hesap oluşturma formunda email/telefon alanından çıkılınca (blur) çağrılan
// erken/canlı kontrol - kullanıcı bütün formu + telefon/email OTP adımlarını
// doldurup EN SONDA "zaten kayıtlı" hatası almasın diye. Gerçek/kesin kontrol
// hâlâ register() içinde yapılıyor (bu uç noktalar sadece erken uyarı için,
// aradaki kısa sürede aynı email/telefon başka biri tarafından alınırsa
// register() yine 409 döner).
async function checkEmail(req, res) {
  const email = String(req.query.email || '').toLowerCase().trim()
  if (!email) return res.json({ available: true })
  const existing = await User.findOne({ email })
  res.json({ available: !existing })
}

async function checkPhone(req, res) {
  const phone = String(req.query.phone || '').trim()
  if (!phone) return res.json({ available: true })
  const existing = await User.findOne({ phone })
  res.json({ available: !existing })
}

// Herkese açık - Leaderboard sadece gerçekten kayıt olmuş kullanıcılardan
// oluşuyor (bkz. app/leaderboard/page.tsx). Şifre/email dönmüyor, sadece
// sıralama için gereken alanlar.
async function leaderboard(req, res) {
  const users = await User.find({}, 'name stats').lean()
  res.json({ users: users.map((u) => ({ id: u._id, name: u.name, stats: u.stats })) })
}

// SADECE admin panelindeki "kayıtlı hesaplar" görünümü için (bkz.
// devpanel/sections/UserDatabase.tsx). requireAdmin ile korunuyor - route'a
// bakınız. passwordHash HİÇBİR ZAMAN dönmüyor (projeksiyona dahil değil).
async function listUsers(req, res) {
  const users = await User.find({}, 'name email phone gender birthDate locale stats createdAt')
    .sort({ createdAt: -1 })
    .lean()
  res.json({
    users: users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || null,
      gender: u.gender || null,
      birthDate: u.birthDate || null,
      locale: u.locale || 'en',
      isAdmin: isAdminEmail(u.email),
      stats: u.stats || {},
      createdAt: u.createdAt,
    })),
  })
}

module.exports = {
  register,
  login,
  me,
  updateStats,
  updateProfile,
  updatePreferences,
  updatePassword,
  removeAccount,
  leaderboard,
  listUsers,
  checkEmail,
  checkPhone,
}
