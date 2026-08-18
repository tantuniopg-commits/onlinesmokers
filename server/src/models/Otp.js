const mongoose = require('mongoose')

// Telefon/e-posta doğrulama kodları - sadece hash saklanıyor (bkz.
// controllers/otpController.js, bcrypt ile hash'leniyor), plaintext kod
// hiçbir zaman veritabanına yazılmıyor. expiresAt üzerindeki TTL index
// süresi dolan kayıtları otomatik siliyor.
const otpSchema = new mongoose.Schema({
  // 'password-reset' - Şifremi Unuttum akışı (bkz.
  // controllers/passwordResetController.js) - register/login sırasındaki
  // 'email' doğrulama kanalıyla ÇAKIŞMASIN diye ayrı bir kanal.
  channel: { type: String, enum: ['phone', 'email', 'password-reset'], required: true },
  destination: { type: String, required: true, trim: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  generatedAt: { type: Number, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
})

otpSchema.index({ channel: 1, destination: 1 }, { unique: true })

module.exports = mongoose.model('Otp', otpSchema)
