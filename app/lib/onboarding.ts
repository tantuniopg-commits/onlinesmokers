// Welcome ekranının (bkz. app/WelcomeScreen.tsx) sadece kullanıcının GERÇEK
// ilk açılışında gösterilmesi için kalıcı bayrak - introPlayed'in aksine
// (sadece bu oturum için) bu, tam sayfa yenilemesinden sonra da kalıcı.
const WELCOME_SEEN_KEY = 'velis_welcome_seen'

export function hasSeenWelcome(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(WELCOME_SEEN_KEY) === '1'
}

export function markWelcomeSeen() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WELCOME_SEEN_KEY, '1')
}

// Developer Panel'in Reset bölümü için (bkz. services/DeveloperService.ts).
export function clearWelcomeSeen() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(WELCOME_SEEN_KEY)
}

// Dil seçim ekranı (bkz. app/LanguageSelectScreen.tsx) - Intro'dan hemen
// sonra, "Who are you?"dan ÖNCE, sadece ilk açılışta bir kez soruluyor.
// Seçilen dilin kendisi contexts/LocaleContext.tsx üzerinden ayrı kalıcı
// (velis_settings) - bu bayrak sadece "bu ekran bir daha gösterilmesin"
// anlamına geliyor.
const LANGUAGE_SELECTED_KEY = 'velis_language_selected'

export function hasSelectedLanguage(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(LANGUAGE_SELECTED_KEY) === '1'
}

export function markLanguageSelected() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LANGUAGE_SELECTED_KEY, '1')
}

// Developer Panel'in Reset bölümü için (bkz. services/DeveloperService.ts).
export function clearLanguageSelected() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LANGUAGE_SELECTED_KEY)
}

// "Who are you?" ekranı (bkz. app/WhoAreYouScreen.tsx) - Intro'dan sonra,
// Welcome'dan ÖNCE, sadece ilk açılışta bir kez soruluyor. Ayrı bir "seen"
// bayrağı yok - seçimin kendisi (null olmaması) zaten "soruldu" anlamına
// geliyor, hasCompletedFirstRitual'ın journeyTimestamp'e bağlı olması gibi.
export type UserType = 'Nonsmoker' | 'Smoker'
const USER_TYPE_KEY = 'velis_user_type'

export function getUserType(): UserType | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(USER_TYPE_KEY)
  return raw === 'Nonsmoker' || raw === 'Smoker' ? raw : null
}

export function saveUserType(type: UserType) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USER_TYPE_KEY, type)
}

// Developer Panel'in Reset bölümü için (bkz. services/DeveloperService.ts).
export function clearUserType() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(USER_TYPE_KEY)
}
