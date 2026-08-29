'use client'

import { SettingsShell, SettingsCard, SettingsRow } from '../shared'
import { APP_VERSION as VELIS_VERSION, BUILD_NUMBER } from '../../../constants/version'
import { useLocale } from '../../../contexts/LocaleContext'

const SUPPORT_EMAIL = 'contact@forsvelis.com'

export default function AboutSettings() {
  const { t } = useLocale()

  const contactSupport = () => {
    if (typeof window === 'undefined') return
    const subject = encodeURIComponent('Velis — Support')
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}`
  }

  return (
    <SettingsShell title={t('settings.about.title')}>
      <SettingsCard>
        <SettingsRow label={t('settings.about.version')} value={VELIS_VERSION} chevron={false} first />
        <SettingsRow label={t('settings.about.build')} value={BUILD_NUMBER} chevron={false} />
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label={t('settings.about.support')} value={SUPPORT_EMAIL} onClick={contactSupport} first />
      </SettingsCard>
    </SettingsShell>
  )
}
