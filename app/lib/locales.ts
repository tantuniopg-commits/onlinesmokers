// VELIS'in tam yerelleştirme mimarisi için tohum - şu an sadece dil
// SEÇİMİNİ (bkz. lib/settings.ts) destekliyor. Uygulamanın geri kalanı
// henüz bu koda göre metin göstermiyor; gerçek çeviri sözlükleri ve bir
// i18n provider'ı bağlanana kadar arayüz İngilizce kalıyor. Bu dosya,
// o provider'ın SUPPORTED_LOCALES listesini nereden okuyacağını tanımlıyor.

export type Locale = {
  code: string
  englishName: string
  nativeName: string
}

export const DEFAULT_LOCALE_CODE = 'en'

export const SUPPORTED_LOCALES: Locale[] = [
  { code: 'en', englishName: 'English', nativeName: 'English (Default)' },
  { code: 'tr', englishName: 'Turkish', nativeName: 'Türkçe' },
]

export function getLocale(code: string): Locale {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0]
}
