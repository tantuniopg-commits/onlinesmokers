const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Journey/XP ilerlemesi - VELIS istemcisinin lib/auth.ts'teki VelisStats
// tipiyle birebir aynı şekil. Sunucuda tutuluyor ki bir hesaba başka bir
// cihaz/tarayıcıdan giriş yapıldığında ilerleme "kaldığı yerden" devam etsin
// (istemci-only localStorage tek başına bunu sağlayamıyordu).
const statsSchema = new mongoose.Schema(
  {
    journeyDay: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    journeyTimestamp: { type: Number, default: null },
    totalXP: { type: Number, default: 0 },
    totalRitualCount: { type: Number, default: 0 },
    totalRitualTimeSec: { type: Number, default: 0 },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // sparse:true - var olan hesaplarda (bu alan eklenmeden önce oluşturulmuş)
    // phone yok/undefined; sparse olmadan unique index bunu tek bir "boş"
    // değer olarak sayıp ikinci undefined'da index kurulumunu kırardı.
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    stats: { type: statsSchema, default: () => ({}) },
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash)
}

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

module.exports = mongoose.model('User', userSchema)
