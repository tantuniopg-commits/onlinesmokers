// Telefon/E-posta OTP doğrulama servisi - "kim bu kullanıcı" değil "gönderilen
// kodu doğru girdi mi" sorusuna cevap veriyor (AuthService'ten KASITLI OLARAK
// bağımsız, tıpkı AppStateManager'ın auth'tan bağımsız olması gibi).
//
// ŞU AN: gerçek bir SMS/e-posta sağlayıcısı YOK - sadece development/test
// amaçlı, kodu üretip yerelde saklıyor ("gönderim" sadece dev konsoluna
// yazdırılıyor + Developer Panel > Verification'da gösteriliyor).
//
// GERÇEK SAĞLAYICIYA GEÇİŞ: sadece `simulateSend` fonksiyonunun içini
// değiştirmek yeterli olacak (Telefon: Twilio / Firebase Phone Auth; E-posta:
// Resend / SendGrid / Supabase Auth) - `sendOtp`/`verifyOtp`'nin dışa açık
// imzası ve UI'daki hiçbir şey değişmeyecek.
import { getOtpRecord, saveOtpRecord, clearOtpRecord } from '../lib/verification'
import type { OtpChannel, OtpRecord } from '../lib/verification'
import { isDev } from '../constants/env'

export type { OtpChannel, OtpRecord }

const OTP_LENGTH = 6
const EXPIRY_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000

function generateOtpCode(): string {
  const min = 10 ** (OTP_LENGTH - 1)
  const max = 10 ** OTP_LENGTH
  return String(Math.floor(min + Math.random() * (max - min)))
}

// Gerçek sağlayıcı bağlanınca burası bir API çağrısına dönüşecek (Twilio/
// Firebase Phone Auth için telefon, Resend/SendGrid/Supabase Auth için
// e-posta) - şimdilik sadece dev konsoluna yazdırıyor, kod zaten Developer
// Panel > Verification'da görülebiliyor.
function simulateSend(channel: OtpChannel, destination: string, code: string) {
  if (isDev) console.log(`[VerificationService] ${channel} OTP for ${destination || '(unknown)'}: ${code}`)
}

// Yeni üretilen kod, DİĞER kanalın o an aktif kodu ile ASLA aynı olmuyor
// (spec gereği) - iki kanal bağımsız üretiliyor ama çakışma ihtimaline karşı
// açıkça kontrol ediliyor.
function generateUniqueOtpCode(channel: OtpChannel): string {
  const otherChannel: OtpChannel = channel === 'phone' ? 'email' : 'phone'
  const otherCode = getOtpRecord(otherChannel)?.code
  let code = generateOtpCode()
  while (code === otherCode) code = generateOtpCode()
  return code
}

export function sendOtp(channel: OtpChannel, destination: string): OtpRecord {
  const now = Date.now()
  const record: OtpRecord = {
    code: generateUniqueOtpCode(channel),
    destination,
    generatedAt: now,
    expiresAt: now + EXPIRY_MS,
  }
  saveOtpRecord(channel, record)
  simulateSend(channel, destination, record.code)
  return record
}

export function verifyOtp(channel: OtpChannel, inputCode: string): boolean {
  const record = getOtpRecord(channel)
  if (!record) return false
  if (Date.now() > record.expiresAt) return false
  const valid = record.code === inputCode.trim()
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
export function devRegenerateOtp(channel: OtpChannel): OtpRecord {
  const destination = getOtpRecord(channel)?.destination ?? ''
  return sendOtp(channel, destination)
}

// Developer Panel'in Reset bölümü / factoryReset için.
export function clearAllOtps(): void {
  clearOtpRecord('phone')
  clearOtpRecord('email')
}
