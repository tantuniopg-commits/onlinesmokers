'use client'

// O an SÜREN bir ritüelin ilerlemesini bileşen DIŞINDA tutar. Ritual Home
// ('/') başka bir sekmeye geçilince unmount oluyor ve tüm React state'i
// kayboluyordu - kullanıcı geri dönünce ritüel baştan başlıyordu. Bu modül
// aktivasyon/hazır/ritüel fazlarını DUVAR SAATİNE (epoch ms) göre
// sessionStorage'da kalıcılaştırıyor: geri dönünce ekran dışında geçen süre
// de sayılarak kaldığı yerden devam ediyor.
//
// Neden sessionStorage: yarım kalmış bir ritüel uygulama kapanınca
// temizlensin - localStorage olsaydı günler sonra bile "yarım ritüel"
// takılı kalırdı. Aynı oturum boyunca (sekmeler arası gezinme) kalıcı.

const KEY = 'velis_ritual_session'

export type RitualSessionPhase = 'activating' | 'ready' | 'ritual'

export type RitualSession = {
  phase: RitualSessionPhase
  // Bu faz şu epoch ms'de başladı - 'activating' ve 'ritual' için geçen
  // süre buradan hesaplanıyor.
  phaseStartedAt: number
  // O an süren ritüelin toplam süresi (sn) - ritüel ORTASINDA config
  // değişse bile bu tur bu süreyle bitiyor.
  durationSec: number
  // O ana kadar toplanan amber top bonus XP'si.
  orbXP: number
}

export function loadRitualSession(): RitualSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as RitualSession
    if (!s || typeof s.phaseStartedAt !== 'number' || typeof s.phase !== 'string') return null
    return s
  } catch {
    return null
  }
}

export function saveRitualSession(s: RitualSession): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // kota/erişim hatası - kalıcılık olmadan da ritüel çalışır
  }
}

// Var olan oturumu kısmen günceller (yoksa hiçbir şey yapmaz).
export function patchRitualSession(patch: Partial<RitualSession>): void {
  const cur = loadRitualSession()
  if (!cur) return
  saveRitualSession({ ...cur, ...patch })
}

export function clearRitualSession(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    // yok say
  }
}
