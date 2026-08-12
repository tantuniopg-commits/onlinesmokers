const jwt = require('jsonwebtoken')
const User = require('../models/User')

const STATS_FIELDS = ['journeyDay', 'currentStreak', 'journeyTimestamp', 'totalXP', 'totalRitualCount', 'totalRitualTimeSec']

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone, stats: user.stats }
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
  const { name, email, password, phone, stats } = req.body || {}
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

  const passwordHash = await User.hashPassword(password)
  const user = await User.create({ name, email, phone: phone || undefined, passwordHash, stats: pickStats(stats) })

  res.status(201).json({ token: signToken(user._id), user: toPublicUser(user) })
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

// SADECE Developer Panel'in "kayıtlı hesaplar" görünümü için (bkz.
// devpanel/sections/UserDatabase.tsx) - gerçek/kalıcı depolamada NELERİN
// saklandığını doğrulanabilir kılmak amacıyla. Şifre hash'i dahi HİÇBİR
// ZAMAN dönmüyor - passwordHash bilerek projeksiyondan dışlanıyor.
async function listUsers(req, res) {
  const users = await User.find({}, 'name email stats createdAt').sort({ createdAt: -1 }).lean()
  res.json({
    users: users.map((u) => ({ id: u._id, name: u.name, email: u.email, stats: u.stats, createdAt: u.createdAt })),
  })
}

module.exports = { register, login, me, updateStats, leaderboard, listUsers, checkEmail, checkPhone }
