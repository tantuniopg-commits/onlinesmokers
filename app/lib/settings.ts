// Kullanıcı tercihleri için merkezi depo - lib/auth.ts'teki VelisUser/VelisStats
// deseninin aynısı. Backend yok, tercihler localStorage'da kalıcılaşıyor.
//
// appearance.darkMode ve language alanları şu an için TEK etkin değeri
// (koyu tema, İngilizce metin) temsil ediyor - gerçek Light Mode / çoklu dil
// desteği henüz uygulanmadı. Bu dosya, ileride bir ThemeProvider ve i18n
// sözlüğünün bağlanacağı YERİ hazırlıyor (bkz. lib/locales.ts) - Ayarlar
// ekranındaki seçim zaten kalıcılaşıyor, sadece geri kalan uygulama henüz
// buna göre render etmiyor.

export type NotificationSettings = {
  dailyRitualReminder: boolean
}

export type AppearanceSettings = {
  // Şu an tek desteklenen değer `true` - Light Mode gelince burası gerçek
  // bir seçim haline gelecek, ThemeProvider bu alanı okuyacak.
  darkMode: boolean
}

export type UserSettings = {
  language: string // bkz. lib/locales.ts SUPPORTED_LOCALES[].code
  notifications: NotificationSettings
  appearance: AppearanceSettings
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  notifications: {
    dailyRitualReminder: true,
  },
  appearance: {
    darkMode: true,
  },
}

const SETTINGS_KEY = 'velis_settings'

export function getStoredSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
      appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: UserSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
