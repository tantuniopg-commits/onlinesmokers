// Gerçek backend'e (bkz. /server/src/routes/otpRoutes.js) bağlanan OTP
// istemcisi - kodun kendisi ASLA tarayıcıya inmiyor (server sadece hash
// saklıyor, doğrulama server-side yapılıyor). bkz. services/VerificationService.ts
import { apiBase } from './authApi'
import type { OtpChannel } from './verification'

export type SendOtpResult = { expiresAt: number; devCode?: string }

export class OtpApiError extends Error {}

// Backend uyuyabiliyor (Render free) - bkz. lib/authApi.ts aynı gerekçe.
const OTP_TIMEOUT_MS = 45000

export async function sendOtpRequest(channel: OtpChannel, destination: string, force?: boolean, locale?: string): Promise<SendOtpResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), OTP_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(`${apiBase()}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, destination, force, locale }),
      signal: controller.signal,
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new OtpApiError('The server is taking too long to respond. Please try again in a moment.')
    }
    throw new OtpApiError('Could not reach the server. Check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new OtpApiError(data.error || 'Could not send code.')
  return { expiresAt: data.expiresAt, devCode: data.devCode }
}

// Ağ hatası da dahil her başarısızlıkta false döner (OtpStep tarafında tek
// bir "incorrect code" mesajı yeterli - gönderim tarafındaki gibi ayrı bir
// hata metnine gerek yok).
export async function verifyOtpRequest(channel: OtpChannel, destination: string, code: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/api/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, destination, code }),
    })
    const data = await res.json().catch(() => ({}))
    return res.ok && !!data.valid
  } catch {
    return false
  }
}
