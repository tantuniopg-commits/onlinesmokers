// Gerçek backend'e (bkz. /server/src/routes/otpRoutes.js) bağlanan OTP
// istemcisi - kodun kendisi ASLA tarayıcıya inmiyor (server sadece hash
// saklıyor, doğrulama server-side yapılıyor). bkz. services/VerificationService.ts
import { apiBase } from './authApi'
import type { OtpChannel } from './verification'

export type SendOtpResult = { expiresAt: number; devCode?: string }

export class OtpApiError extends Error {}

export async function sendOtpRequest(channel: OtpChannel, destination: string, force?: boolean): Promise<SendOtpResult> {
  let res: Response
  try {
    res = await fetch(`${apiBase()}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, destination, force }),
    })
  } catch {
    throw new OtpApiError('Could not reach the server. Check your connection.')
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
