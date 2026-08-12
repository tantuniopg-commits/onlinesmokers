'use client'

import { SettingsShell, SettingsCard, SettingsRow, Toggle, SANS } from '../shared'
import { useSettings } from '../../../hooks/useSettings'
import { useLocale } from '../../../contexts/LocaleContext'

// Dark Mode şu an TEK desteklenen görünüm - anahtar kilitli/varsayılan
// açık geliyor. Light Mode gelince bu sayfa gerçek bir seçime dönüşecek;
// mimari (bkz. lib/settings.ts appearance.darkMode) zaten hazır.
export default function AppearanceSettings() {
  const { t } = useLocale()
  const { settings, updateAppearance } = useSettings()
  const darkMode = settings?.appearance.darkMode ?? true

  const toggle = () => {
    // Light Mode henüz desteklenmiyor - anahtar şimdilik her zaman açık
    // durumda kalıyor, ama tercih yine de kalıcılaşıyor.
    updateAppearance({ darkMode: true })
  }

  return (
    <SettingsShell title={t('settings.appearance.title')}>
      <SettingsCard>
        <SettingsRow label={t('settings.appearance.darkMode')} chevron={false} first rightElement={<Toggle checked={darkMode} onChange={toggle} />} />
      </SettingsCard>
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: '#8F8A83' }}>{t('settings.appearance.comingSoon')}</p>
    </SettingsShell>
  )
}
