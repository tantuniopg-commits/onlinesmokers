const User = require('../models/User')
const { sendJourneyReminderEmail } = require('../lib/mailer')

const CHECK_INTERVAL_MS = 2 * 60 * 1000
// Türkiye saatiyle (Europe/Istanbul) sabit saat - kişisel soğuma sayacından
// bağımsız, hem aktif hem uzun süredir girmeyen HERKESE aynı anda giden
// ortak günlük bildirim (bkz. talep).
const TARGET_HOUR = 20

function istanbulNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) }
}

// Her hesaba günde EN FAZLA bir kez - lastJourneyReminderSentDate o günün
// (Europe/Istanbul) tarihine eşitse bu döngüde zaten gönderilmiş demektir.
// notificationPrefs.journeyReminder === false SORGUDA değil, döngü İÇİNDE
// kontrol ediliyor (bkz. jobs/cooldownReminder.js aynı gerekçe - bu alan
// eklenmeden önce oluşturulmuş kullanıcıların ham Mongo belgesinde alan
// gerçekten yok, dot-path sorgusu onları hiç eşleştirmezdi).
async function checkJourneyReminders() {
  const { date, hour } = istanbulNow()
  if (hour !== TARGET_HOUR) return

  const users = await User.find({})
  for (const user of users) {
    if (user.notificationPrefs?.journeyReminder === false) continue
    if (user.lastJourneyReminderSentDate === date) continue

    try {
      await sendJourneyReminderEmail(user.email, user.locale || 'en')
      user.lastJourneyReminderSentDate = date
      await user.save()
    } catch (err) {
      console.error('[journeyReminder] Failed to send to', user.email, err)
    }
  }
}

function startJourneyReminderJob() {
  setInterval(() => {
    checkJourneyReminders().catch((err) => console.error('[journeyReminder] Check failed', err))
  }, CHECK_INTERVAL_MS)
}

module.exports = { startJourneyReminderJob, checkJourneyReminders }
