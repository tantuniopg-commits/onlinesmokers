// OTP kaydının ham depolanması - Phone/Email doğrulaması için (bkz.
// services/VerificationService.ts). Sadece localStorage okuma/yazma/temizleme,
// hiçbir iş kuralı (süre/cooldown/kod üretimi) burada değil.

export type OtpChannel = 'phone' | 'email'

export type OtpRecord = {
  code: string
  destination: string
  generatedAt: number
  expiresAt: number
}

const KEYS: Record<OtpChannel, string> = {
  phone: 'velis_otp_phone',
  email: 'velis_otp_email',
}

export function getOtpRecord(channel: OtpChannel): OtpRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEYS[channel])
    return raw ? (JSON.parse(raw) as OtpRecord) : null
  } catch {
    return null
  }
}

export function saveOtpRecord(channel: OtpChannel, record: OtpRecord): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEYS[channel], JSON.stringify(record))
}

// Developer Panel'in Reset bölümü / factoryReset için.
export function clearOtpRecord(channel: OtpChannel): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEYS[channel])
}
