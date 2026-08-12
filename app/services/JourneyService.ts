// Journey (gün/seri) servisi - lib/journey.ts (ilerleme/soğuma kuralları)
// ve lib/journeyContent.ts (gün içerikleri) üzerine ince bir katman.
export * from '../lib/journey'
export * from '../lib/journeyContent'

// Bir günün gerçekten unlocked olup olmadığı - daha önce app/journey/page.tsx
// (canOpen) ve app/aftercare/page.tsx'te (requestedViewDay sınır kontrolü)
// bağımsız olarak birbirinin aynısı iki kez yazılmıştı, burada birleşti.
// Development-modu bypass'ı (isDev) KASITLI OLARAK burada değil, çağıran
// tarafta kalıyor - bu fonksiyon sadece "gerçek" unlock kuralını temsil ediyor.
export function canViewJourneyDay(day: number, journeyDay: number): boolean {
  return day >= 1 && day <= journeyDay
}
