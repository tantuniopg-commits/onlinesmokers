// Admin (yönetici) e-posta listesi. Kodda GÖRÜNMEYEN bir liste için Render'da
// ADMIN_EMAILS env değişkeni ayarlanır (virgülle ayrılmış). Ayarlanmamışsa
// gömülü varsayılan liste kullanılır - ilk admin hesabı burada.
const DEFAULT_ADMIN_EMAILS = ['zeynepsuyavuz@forsvelis.com']

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',')
  : DEFAULT_ADMIN_EMAILS
)
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

function isAdminEmail(email) {
  return typeof email === 'string' && ADMIN_EMAILS.includes(email.toLowerCase())
}

module.exports = { isAdminEmail, ADMIN_EMAILS }
