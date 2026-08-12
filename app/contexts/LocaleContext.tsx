'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getStoredSettings, saveSettings } from '../lib/settings'
import { translate } from '../lib/i18n'
import type { LocaleCode, TranslationKey } from '../lib/i18n'

// VELIS'in gerçek dil geçişi - Ayarlar > Language'daki seçim burada
// tüketiliyor. `t(key)` her yerde aynı anda güncel dilin metnini döndürüyor;
// dil değişince (updateLanguage) context re-render olup TÜM tüketicileri
// otomatik günceller.
type LocaleContextValue = {
  locale: LocaleCode
  setLocale: (code: LocaleCode) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  // SSR/istemci ilk render'ında AYNI varsayılanla başlıyor - gerçek tercih
  // sadece mount SONRASI okunuyor (hydration uyuşmazlığı riskini ortadan
  // kaldıran, bu projede zaten kurulu desen).
  const [locale, setLocaleState] = useState<LocaleCode>('en')

  useEffect(() => {
    const stored = getStoredSettings().language
    if (stored === 'tr' || stored === 'en') setLocaleState(stored)
  }, [])

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code)
    const current = getStoredSettings()
    saveSettings({ ...current, language: code })
  }, [])

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>) => translate(locale, key, vars), [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}
