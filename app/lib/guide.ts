// VELIS Guide (amber stick-figure onboarding tour) - kalıcı "tamamlandı"
// bayrağı. Skip veya son adımın (COMPLETION) bitişi bunu true yapıyor -
// ikisinden biri olunca rehber HİÇBİR yerde bir daha görünmüyor.
const GUIDE_COMPLETED_KEY = 'velis_guide_completed'

export function isGuideCompleted(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(GUIDE_COMPLETED_KEY) === '1'
}

export function setGuideCompleted() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(GUIDE_COMPLETED_KEY, '1')
}

// Developer Panel'in Reset bölümü için (bkz. services/DeveloperService.ts).
export function clearGuideCompleted() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(GUIDE_COMPLETED_KEY)
}
