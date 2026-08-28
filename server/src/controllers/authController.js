const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendPasswordChangedEmail, sendWelcomeEmail } = require('../lib/mailer')
const { isAdminEmail } = require('../lib/admins')

const STATS_FIELDS = ['journeyDay', 'currentStreak', 'journeyTimestamp', 'totalXP', 'totalRitualCount', 'totalRitualTimeSec']

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
  if (!input || typeof input !== 'object') return undefined
  const stats = {}
  for (const key of STATS_FIELDS) {
    if (key in input) stats[key] = input[key]
  }
  return stats
}

async function register(req, res) {
  const { name, email, password, phone, stats, locale, gender, birthDate } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  // Email ve telefon HER İKİSİ de benzersiz - bir hesap silinmeden aynı
  // email veya aynı telefonla ikinci bir hesap açılamıyor (bkz. User.js
  // şemasındaki unique index'ler - buradaki kontrol daha net bir hata
  // mesajı dönmek için, gerçek garanti veritabanı seviyesinde).
  const existingEmail = await User.findOne({ email: email.toLowerCase() })
  if (existingEmail) return res.status(409).json({ error: 'Email already in use' })

  if (phone) {
    const existingPhone = await User.findOne({ phone })
    if (existingPhone) return res.status(409).json({ error: 'Phone number already in use' })
  }

  const resolvedLocale = locale === 'tr' ? 'tr' : 'en'
  const passwordHash = await User.hashPassword(password)
  const user = await User.create({
    name,
    email,
    phone: phone || undefined,
    gender: typeof gender === 'string' && gender.trim() ? gender.trim() : undefined,
    birthDate: typeof birthDate === 'string' && birthDate.trim() ? birthDate.trim() : undefined,
    passwordHash,
    stats: pickStats(stats),
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
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  const valid = user && (await user.comparePassword(password))
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
  const name = String(req.body?.name || '').trim()
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
