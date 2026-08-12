// Gerçek kimlik doğrulama backend'i (bkz. /server) - Express + JWT + MongoDB.
// Aynı ağdaki telefondan da erişilebilmesi için sabit bir host yerine sayfanın
// kendi hostname'i + 4000 portu kullanılıyor (next dev --hostname 0.0.0.0 ile
// aynı mantık, bkz. next.config.ts allowedDevOrigins).
import type { VelisStats } from './auth'

const AUTH_API_PORT = 4000

function apiBase() {
  if (typeof window === 'undefined') return ''
  return `${window.location.protocol}//${window.location.hostname}:${AUTH_API_PORT}`
}

export type AuthApiUser = { id: string; name: string; email: string; phone?: string; stats?: VelisStats }
export type AuthApiResult = { token: string; user: AuthApiUser }
export type AuthApiUserResult = { user: AuthApiUser }

export class AuthApiError extends Error {}

async function request<T>(method: string, path: string, body?: unknown, token?: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${apiBase()}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new AuthApiError('Could not reach the server. Check your connection.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new AuthApiError(data.error || 'Something went wrong.')
  return data as T
}

// Email VE telefon her ikisi de sunucuda benzersiz (bkz. server/src/models/User.js
// unique index'leri) - aynı email veya aynı telefonla ikinci bir hesap
// açılamıyor, sunucu 409 ile "already in use" hatası dönüyor.
export function registerRequest(name: string, email: string, password: string, phone?: string, stats?: VelisStats) {
  return request<AuthApiResult>('POST', '/api/auth/register', { name, email, password, phone, stats })
}

export function loginRequest(email: string, password: string) {
  return request<AuthApiResult>('POST', '/api/auth/login', { email, password })
}

// Bir ritüel tamamlandığında (bkz. lib/journey.ts completeRitual) en güncel
// ilerlemeyi sunucuya yazıyor - başka bir cihaz/tarayıcıdan bu hesaba giriş
// yapıldığında ilerlemenin "kaldığı yerden" devam etmesi bunun sayesinde.
// Best-effort: token yoksa (misafir/local-only kullanım) hiç çağrılmıyor,
// başarısız olursa sessizce yutuluyor - yerel ilerleme buna bağlı değil.
export function updateStatsRequest(token: string, stats: VelisStats) {
  return request<AuthApiUserResult>('PATCH', '/api/auth/stats', { stats }, token)
}

export type AuthApiLeaderboardUser = { id: string; name: string; stats?: VelisStats }
export type AuthApiLeaderboardResult = { users: AuthApiLeaderboardUser[] }

// Leaderboard - SADECE gerçekten kayıt olmuş kullanıcılardan oluşuyor (bkz.
// app/leaderboard/page.tsx). Herkese açık, token gerekmiyor.
export function getLeaderboardRequest() {
  return request<AuthApiLeaderboardResult>('GET', '/api/auth/leaderboard')
}

export type AuthApiStoredUser = { id: string; name: string; email: string; stats?: VelisStats; createdAt: string }
export type AuthApiUsersResult = { users: AuthApiStoredUser[] }

// SADECE Developer Panel için (bkz. devpanel/sections/UserDatabase.tsx) -
// kalıcı depolamada gerçekten ne saklandığını doğrulamak amacıyla. Şifre
// backend'den zaten hiç dönmüyor (bkz. authController.js listUsers).
export function getUsersRequest() {
  return request<AuthApiUsersResult>('GET', '/api/auth/users')
}

export type AuthApiAvailabilityResult = { available: boolean }

// Hesap oluşturma formunda email/telefon alanından çıkılınca ERKEN uyarı
// için (bkz. app/profile/page.tsx) - kesin/gerçek kontrol register() içinde
// zaten yapılıyor, bu sadece kullanıcı tüm formu+OTP adımlarını doldurup en
// sonda "zaten kayıtlı" hatası almasın diye.
export function checkEmailAvailableRequest(email: string) {
  return request<AuthApiAvailabilityResult>('GET', `/api/auth/check-email?email=${encodeURIComponent(email)}`)
}

export function checkPhoneAvailableRequest(phone: string) {
  return request<AuthApiAvailabilityResult>('GET', `/api/auth/check-phone?phone=${encodeURIComponent(phone)}`)
}
