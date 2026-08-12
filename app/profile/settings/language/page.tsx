'use client'

import { SettingsShell, SettingsCard, CheckIcon, SANS } from '../shared'
import { SUPPORTED_LOCALES } from '../../../services/SettingsService'
import { useLocale } from '../../../contexts/LocaleContext'
import type { LocaleCode } from '../../../lib/i18n'

// Dil seçimi hem kalıcılaşıyor hem de ANINDA uygulanıyor - bkz.
// contexts/LocaleContext.tsx (setLocale hem state'i hem localStorage'ı
// güncelliyor, sayfa yenilemeden tüm uygulama yeni dile geçiyor).
export default function LanguageSettings() {
  const { locale, setLocale, t } = useLocale()

  return (
    <SettingsShell title={t('settings.language.title')}>
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '13px', color: '#8F8A83' }}>{t('settings.language.note')}</p>
      <SettingsCard>
        {SUPPORTED_LOCALES.map((loc, i) => (
          <div
            key={loc.code}
            onClick={() => setLocale(loc.code as LocaleCode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: '15px', color: '#F5F0EA' }}>{loc.nativeName}</span>
            {locale === loc.code && <CheckIcon />}
          </div>
        ))}
      </SettingsCard>
    </SettingsShell>
  )
}
