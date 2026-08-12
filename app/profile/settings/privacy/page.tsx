'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsShell, SettingsCard, SettingsRow, SANS } from '../shared'
import { buildExportPayload } from '../../../services/SettingsService'
import { useLocale } from '../../../contexts/LocaleContext'

type Expanded = 'privacy' | 'terms' | null

export default function PrivacySecuritySettings() {
  const router = useRouter()
  const { t } = useLocale()
  const [expanded, setExpanded] = useState<Expanded>(null)
  const [exported, setExported] = useState(false)

  // Gerçek bir dışa aktarma - kullanıcının cihazda tutulan tüm verisini
  // (kimlik, Journey/XP, tercihler) tek bir JSON dosyası olarak indiriyor.
  // Backend olmadığı için bu, "kendi verin senindir" ilkesini somut olarak
  // uygulayabildiğimiz TEK yer.
  const exportData = () => {
    const payload = buildExportPayload()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'velis-data-export.json'
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 1800)
  }

  return (
    <SettingsShell title={t('settings.privacy.title')}>
      <SettingsCard>
        <SettingsRow label={t('settings.privacy.changePassword')} onClick={() => router.push('/profile/settings/account')} first />
        <SettingsRow
          label={exported ? t('settings.privacy.exported') : t('settings.privacy.exportData')}
          onClick={exportData}
          chevron={!exported}
        />
      </SettingsCard>

      <SettingsCard>
        <SettingsRow
          label={t('settings.privacy.privacyPolicy')}
          onClick={() => setExpanded(expanded === 'privacy' ? null : 'privacy')}
          chevron={expanded !== 'privacy'}
          first
        />
        {expanded === 'privacy' && (
          <p style={{ margin: 0, padding: '0 20px 18px', fontFamily: SANS, fontSize: '13px', color: '#8F8A83', lineHeight: 1.5 }}>
            {t('settings.privacy.privacyPolicyNote')}
          </p>
        )}

        <SettingsRow
          label={t('settings.privacy.termsOfService')}
          onClick={() => setExpanded(expanded === 'terms' ? null : 'terms')}
          chevron={expanded !== 'terms'}
        />
        {expanded === 'terms' && (
          <p style={{ margin: 0, padding: '0 20px 18px', fontFamily: SANS, fontSize: '13px', color: '#8F8A83', lineHeight: 1.5 }}>
            {t('settings.privacy.termsOfServiceNote')}
          </p>
        )}
      </SettingsCard>
    </SettingsShell>
  )
}
