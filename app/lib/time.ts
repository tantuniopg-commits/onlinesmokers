// Zaman kaynağı soyutlaması - Journey/XP iş mantığı (bkz. journey.ts) ASLA
// doğrudan Date.now() çağırmıyor, her zaman bu modül üzerinden geçiyor.
// Şu an yerel cihaz saatini döndürüyor; ileride sunucu zamanına geçmek
// (ör. sunucudan alınan bir offset'i burada uygulamak) sadece BU dosyayı
// değiştirmeyi gerektirecek - iş mantığının geri kalanı hiç değişmeyecek.
//
// Developer Panel'deki "Time Machine" (bkz. devpanel/sections/TimeMachine)
// burada uygulanan bir ofset ekleyerek cihaz saatini DEĞİŞTİRMEDEN zamanı
// ileri alıyor. Bu ofset SADECE development modunda okunuyor - üretimde
// now() her zaman gerçek Date.now() döndürür, localStorage'da her ne
// olursa olsun hiçbir etkisi yoktur (gerçek kullanıcılar bunu ASLA
// kullanamaz).

import { isDev } from '../constants/env'

const DEV_TIME_OFFSET_KEY = 'velis_dev_time_offset_ms'

export function now(): number {
  return Date.now() + (isDev ? getDevTimeOffsetMs() : 0)
}

export function getDevTimeOffsetMs(): number {
  if (!isDev || typeof window === 'undefined') return 0
  try {
    const raw = window.localStorage.getItem(DEV_TIME_OFFSET_KEY)
    return raw ? Number(raw) || 0 : 0
  } catch {
    return 0
  }
}

export function advanceDevTime(ms: number) {
  if (!isDev || typeof window === 'undefined') return
  const next = getDevTimeOffsetMs() + ms
  window.localStorage.setItem(DEV_TIME_OFFSET_KEY, String(next))
}

export function resetDevTime() {
  if (!isDev || typeof window === 'undefined') return
  window.localStorage.removeItem(DEV_TIME_OFFSET_KEY)
}
