const User = require('../models/User')
const { sendCooldownReminderEmail, sendCooldownReadyEmail, sendRewardCountdownEmail } = require('../lib/mailer')

// Hediye günleri her 7 günde bir (bkz. app/journey/page.tsx `day % 7 === 0`,
// bütün hediye günlerinde aynı desen) - reward countdown burada AYNI mantığı
// tekrarlıyor çünkü sunucu istemci koduna bağımlı değil.
function daysUntilNextRewardDay(journeyDay) {
  const nextRewardDay = Math.ceil((journeyDay + 1) / 7) * 7
  return { nextRewardDay, daysLeft: nextRewardDay - journeyDay }
}

// Client'taki JOURNEY_COOLDOWN_MS ile birebir aynı (bkz. app/lib/journey.ts) -
// bilerek burada da sabit, sunucu Developer Panel'in dev-only cooldown
// override'ını (localStorage, client-only) hiç görmüyor/görmemeli, her zaman
// gerçek 24 saatlik üretim soğumasını kullanıyor.
const COOLDOWN_MS = 24 * 60 * 60 * 1000
const REMINDER_WINDOW_MS = 60 * 60 * 1000
const CHECK_INTERVAL_MS = 2 * 60 * 1000

// SADECE "Günlük Ritüel Hatırlatması" (bkz. talep - Yolculuk Hatırlatması
// henüz kapsam dışı). Bir ritüel tamamlandığında başlayan 24 saatlik
// soğuma için iki ayrı e-posta:
//   1. Bitmesine 1 saat kala (lastCooldownReminderFor).
//   2. Tam bittiği an (lastReadyReminderFor).
// Her ikisi de aynı journeyTimestamp için TEK SEFER gönderiliyor - yeni bir
// ritüel tamamlanıp journeyTimestamp değişince döngü doğal olarak sıfırlanıyor.
async function checkCooldownReminders() {
  const now = Date.now()
  // notificationPrefs.dailyRitualReminder BURADA sorgulanmıyor - bu alan
  // eklenmeden önce oluşturulmuş kullanıcıların ham Mongo belgesinde alan
  // gerçekten yok (Mongoose default'u sadece JS tarafında hydrate ediyor,
  // dot-path sorgusu eşleşmiyor). Onun yerine tüm adaylar çekilip filtre
  // aşağıda hydrate edilmiş dokümanın (default'lar dahil) üzerinden yapılıyor.
  const candidates = await User.find({ 'stats.journeyTimestamp': { $ne: null } })

  for (const user of candidates) {
    if (user.notificationPrefs?.dailyRitualReminder === false) continue
    const ts = user.stats?.journeyTimestamp
    if (!ts) continue
    const remaining = ts + COOLDOWN_MS - now
    const locale = user.locale || 'en'
    let changed = false

    if (remaining > 0 && remaining <= REMINDER_WINDOW_MS && user.lastCooldownReminderFor !== ts) {
      try {
        await sendCooldownReminderEmail(user.email, locale)
        user.lastCooldownReminderFor = ts
        changed = true
      } catch (err) {
        console.error('[cooldownReminder] Failed to send 1h-left reminder to', user.email, err)
      }
    }

    if (remaining <= 0 && user.lastReadyReminderFor !== ts) {
      try {
        // Bir sonraki hediye gününe 3/2/1 gün kalmışsa (bkz. talep - "Day 4
        // tamamlanınca Day 7'ye 3 gün kaldı" örneği) normal "hazır" maili
        // yerine büyük sayılı geri sayım maili gidiyor - aynı anda ikisini
        // birden göndermek gereksiz/spam olurdu.
        const { nextRewardDay, daysLeft } = daysUntilNextRewardDay(user.stats.journeyDay || 0)
        if (daysLeft >= 1 && daysLeft <= 3) {
          await sendRewardCountdownEmail(user.email, locale, daysLeft, nextRewardDay)
        } else {
          await sendCooldownReadyEmail(user.email, locale)
        }
        user.lastReadyReminderFor = ts
        changed = true
      } catch (err) {
        console.error('[cooldownReminder] Failed to send ready reminder to', user.email, err)
      }
    }

    if (changed) await user.save()
  }
}

function startCooldownReminderJob() {
  setInterval(() => {
    checkCooldownReminders().catch((err) => console.error('[cooldownReminder] Check failed', err))
  }, CHECK_INTERVAL_MS)
}

module.exports = { startCooldownReminderJob, checkCooldownReminders }
