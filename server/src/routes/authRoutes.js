const express = require('express')
const requireAuth = require('../middleware/auth')
const { register, login, me, updateStats, leaderboard, listUsers, checkEmail, checkPhone } = require('../controllers/authController')

const router = express.Router()

const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next)

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))
router.get('/me', requireAuth, asyncHandler(me))
router.patch('/stats', requireAuth, asyncHandler(updateStats))
router.get('/leaderboard', asyncHandler(leaderboard))
router.get('/check-email', asyncHandler(checkEmail))
router.get('/check-phone', asyncHandler(checkPhone))
// Dev-only kullanım için (bkz. Developer Panel) - üretimde bu uygulama asla
// dağıtılmıyor, bu yüzden ekstra bir admin-auth katmanı şimdilik yok.
router.get('/users', asyncHandler(listUsers))

module.exports = router
