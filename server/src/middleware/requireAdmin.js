const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { isAdminEmail } = require('../lib/admins')

// requireAuth + "bu kullanıcının e-postası admin listesinde mi" kontrolü.
// Admin listesi SADECE sunucuda (bkz. lib/admins.js) - client'a hiç inmiyor,
// client yalnızca login/me yanıtındaki isAdmin bayrağını görüyor.
async function requireAdmin(req, res, next) {
  const header = req.headers.authorization
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })

  let userId
  try {
    userId = jwt.verify(token, process.env.JWT_SECRET).sub
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  let user
  try {
    user = await User.findById(userId, 'email').lean()
  } catch (err) {
    return next(err)
  }
  if (!user || !isAdminEmail(user.email)) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  req.userId = userId
  next()
}

module.exports = requireAdmin
