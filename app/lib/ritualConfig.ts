// Ritüel süresi için merkezi yapılandırma servisi. Ritual ekranı (app/page.tsx)
// süreyi ASLA kendi içinde sabitlemiyor - her zaman getRitualDurationSec()
// çağırıyor. Developer Panel'in "Ritual Configuration" bölümü (bkz.
// devpanel/sections/RitualConfig) development modunda bu süreyi
// değiştirebiliyor ve değişiklik anında etkili oluyor (sayfa yenilemeye
// gerek yok - Ritual ekranı zaten her ritüel başlangıcında bu servisten
// taze bir değer okuyor).
//
// ÜRETİMDE bu servis HER ZAMAN PRODUCTION_RITUAL_DURATION_SEC (90 saniye)
// döndürür - localStorage'da ne olursa olsun hiçbir etkisi yok. Normal
// kullanıcılar bu süreyi asla değiştiremez.

import { isDev } from '../constants/env'

export const PRODUCTION_RITUAL_DURATION_SEC = 90
export const MIN_RITUAL_DURATION_SEC = 1
export const MAX_RITUAL_DURATION_SEC = 600

const STORAGE_KEY = 'velis_dev_ritual_duration_sec'

export function getRitualDurationSec(): number {
  if (!isDev || typeof window === 'undefined') return PRODUCTION_RITUAL_DURATION_SEC
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return PRODUCTION_RITUAL_DURATION_SEC
    const n = Number(raw)
    if (!Number.isFinite(n) || n < MIN_RITUAL_DURATION_SEC || n > MAX_RITUAL_DURATION_SEC) {
      return PRODUCTION_RITUAL_DURATION_SEC
    }
    return n
  } catch {
    return PRODUCTION_RITUAL_DURATION_SEC
  }
}

export function setRitualDurationSec(seconds: number) {
  if (!isDev || typeof window === 'undefined') return
  const clamped = Math.min(MAX_RITUAL_DURATION_SEC, Math.max(MIN_RITUAL_DURATION_SEC, Math.round(seconds)))
  window.localStorage.setItem(STORAGE_KEY, String(clamped))
}

export function resetRitualDurationSec() {
  if (!isDev || typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
