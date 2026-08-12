// Developer Panel'deki "Cooldown" bölümü için geliştirme-modu geçersiz
// kılması (bkz. devpanel/sections/Cooldown). Gerçek üretim soğuması her
// zaman JOURNEY_COOLDOWN_MS (24 saat) - bu dosya SADECE development
// modunda okunuyor, üretimde hiçbir etkisi yok.

import { isDev } from '../constants/env'

const DEV_COOLDOWN_KEY = 'velis_dev_cooldown_ms'

export function getDevCooldownOverrideMs(): number | null {
  if (!isDev || typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(DEV_COOLDOWN_KEY)
    return raw ? Number(raw) || null : null
  } catch {
    return null
  }
}

export function setDevCooldownOverrideMs(ms: number | null) {
  if (!isDev || typeof window === 'undefined') return
  if (ms === null) {
    window.localStorage.removeItem(DEV_COOLDOWN_KEY)
  } else {
    window.localStorage.setItem(DEV_COOLDOWN_KEY, String(ms))
  }
}
