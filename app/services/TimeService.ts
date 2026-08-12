// Zaman servisi - lib/time.ts'in ince bir katmanı (tek zaman kaynağı, dev
// Time Machine ofseti dahil).
import { now } from '../lib/time'

export * from '../lib/time'

// Haftanın günü (Pazartesi=0..Pazar=6) - now() üzerinden, ASLA doğrudan
// `new Date()` ile değil, böylece dev Time Machine ofseti (bkz. lib/time.ts)
// bu hesaba da yansıyor. Üretimde now() === Date.now() olduğu için gerçek
// kullanıcılar için hiçbir davranış farkı yok.
export function getTodayIndexMondayFirst(): number {
  const jsDay = new Date(now()).getDay() // 0=Sun..6=Sat
  return (jsDay + 6) % 7 // 0=Mon..6=Sun
}

// Wall-clock zaman damgası (ör. veri dışa aktarma) - now() üzerinden aynı
// tutarlılık nedeniyle.
export function nowIso(): string {
  return new Date(now()).toISOString()
}
