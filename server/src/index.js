require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')

// Zero-config yerel geliştirme için (.env yoksa) - üretimde .env üzerinden
// gerçek bir secret ayarlanmalı.
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'velis-dev-secret-do-not-use-in-production'
}

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Auth server listening on port ${port}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })
