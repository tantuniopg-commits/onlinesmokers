// Gerçek SMS gönderimi (bkz. mailer.js - e-postayla birebir aynı desen):
// TWILIO_ACCOUNT_SID + (TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET veya
// TWILIO_AUTH_TOKEN) + TWILIO_PHONE_NUMBER hepsi set edilmişse gerçekten
// gönderiliyor, değilse otpController.js sunucu konsoluna yazdırmaya devam
// ediyor (simulatePhoneSend) - gönderim ucu asla "kırık" değil.
function isTwilioConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_PHONE_NUMBER &&
    (process.env.TWILIO_AUTH_TOKEN || (process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET))
  )
}

async function sendVerificationSms(to, code) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const from = process.env.TWILIO_PHONE_NUMBER
  // Twilio iki kimlik doğrulama şeklini destekliyor: ana Auth Token, veya
  // (daha güvenli) bir API Key SID/Secret çifti - ikisi de Account SID'in
  // altında Basic Auth kullanıcı adı/şifresi olarak çalışıyor.
  const authUser = process.env.TWILIO_API_KEY_SID || accountSid
  const authPass = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN

  const body = new URLSearchParams({ To: to, From: from, Body: `Your VELIS verification code is: ${code}` })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${authUser}:${authPass}`).toString('base64')}`,
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Twilio API error ${res.status}: ${text}`)
  }
}

module.exports = { sendVerificationSms, isTwilioConfigured }
