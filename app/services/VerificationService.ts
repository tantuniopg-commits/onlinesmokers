// Telefon/E-posta OTP doğrulama servisi - "kim bu kullanıcı" değil "gönderilen
// kodu doğru girdi mi" sorusuna cevap veriyor (AuthService'ten KASITLI OLARAK
// bağımsız, tıpkı AppStateManager'ın auth'tan bağımsız olması gibi).
//
// Kod üretimi/hash'leme/doğrulama sunucuda (bkz. /server/src/controllers/
// otpController.js) - bu dosya sadece o API'ye ince bir istemci katmanı
// (bkz. lib/otpApi.ts) artı yerel UI durumu (sent/resend/expiry sayaçları
// için, bkz. lib/verification.ts). E-posta gerçekten gönderiliyor (bkz.
// server/src/lib/mailer.js - Resend/SMTP varsa gerçek sağlayıcı, yoksa
// Ethereal test gelen kutusu). Telefon için henüz gerçek bir SMS sağlayıcısı
// yok, sunucu konsoluna yazdırılıyor (bkz. otpController.js simulatePhoneSend).
import { getOtpRecord, saveOtpRecord, clearOtpRecord } from '../lib/verification'
import type { OtpChannel, OtpRecord } from '../lib/verification'
import { sendOtpRequest, verifyOtpRequest } from '../lib/otpApi'

export type { OtpChannel, OtpRecord }
export { OtpApiError } from '../lib/otpApi'

const RESEND_COOLDOWN_MS = 60 * 1000

export async function sendOtp(channel: OtpChannel, destination: string, force?: boolean): Promise<OtpRecord> {
  const result = await sendOtpRequest(channel, destination, force)
  const record: OtpRecord = {
    destination,
    generatedAt: Date.now(),
    expiresAt: result.expiresAt,
    devCode: result.devCode,
  }
  saveOtpRecord(channel, record)
  return record
}

export async function verifyOtp(channel: OtpChannel, inputCode: string): Promise<boolean> {
  const record = getOtpRecord(channel)
  if (!record) return false
  if (Date.now() > record.expiresAt) return false
  const valid = await verifyOtpRequest(channel, record.destination, inputCode)
  if (valid) clearOtpRecord(channel)
  return valid
}

export function getOtpState(channel: OtpChannel): OtpRecord | null {
  return getOtpRecord(channel)
}

export function getResendRemainingMs(channel: OtpChannel): number {
  const record = getOtpRecord(channel)
  if (!record) return 0
  const remaining = record.generatedAt + RESEND_COOLDOWN_MS - Date.now()
  return remaining > 0 ? remaining : 0
}

export function canResendOtp(channel: OtpChannel): boolean {
  return getResendRemainingMs(channel) === 0
}

export function getOtpExpiryRemainingMs(channel: OtpChannel): number {
  const record = getOtpRecord(channel)
  if (!record) return 0
  const remaining = record.expiresAt - Date.now()
  return remaining > 0 ? remaining : 0
}

// Developer Panel'in "Regenerate" kontrolü - cooldown'u bypass ediyor
// (dev-only kısayol), mevcut kaydın hedefini (varsa) koruyor.
export async function devRegenerateOtp(channel: OtpChannel): Promise<OtpRecord> {
  const destination = getOtpRecord(channel)?.destination ?? ''
  return sendOtp(channel, destination, true)
}

// Developer Panel'in Reset bölümü / factoryReset için.
export function clearAllOtps(): void {
  clearOtpRecord('phone')
  clearOtpRecord('email')
}
