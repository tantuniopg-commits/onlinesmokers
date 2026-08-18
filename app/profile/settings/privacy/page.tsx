'use client'

import { useState } from 'react'
import { SettingsShell, SettingsCard, SettingsRow } from '../shared'
import { useLocale } from '../../../contexts/LocaleContext'
import { getPrivacyPolicy, getTermsOfService } from '../../../lib/legalDocuments'
import LegalReader from '../../../LegalReader'

type OpenDoc = 'privacy' | 'terms' | null

export default function PrivacySecuritySettings() {
  const { t, locale } = useLocale()
  const [openDoc, setOpenDoc] = useState<OpenDoc>(null)
  const [progress, setProgress] = useState(0)

  // Kayıt akışındaki (bkz. app/profile/page.tsx) AYNI gerçek doküman ve
  // AYNI okuyucu bileşeni - metin burada tekrarlanmıyor, tek kaynak
  // lib/legalDocuments.ts.
  if (openDoc) {
    return (
      <LegalReader
        doc={openDoc === 'privacy' ? getPrivacyPolicy(locale) : getTermsOfService(locale)}
        progress={progress}
        onProgress={setProgress}
        onBack={() => setOpenDoc(null)}
        onUnderstand={() => setOpenDoc(null)}
      />
    )
  }

  return (
    <SettingsShell title={t('settings.privacy.title')}>
      <SettingsCard>
        <SettingsRow
          label={t('settings.privacy.privacyPolicy')}
          onClick={() => {
            setProgress(0)
            setOpenDoc('privacy')
          }}
          first
        />
        <SettingsRow
          label={t('settings.privacy.termsOfService')}
          onClick={() => {
            setProgress(0)
            setOpenDoc('terms')
          }}
        />
      </SettingsCard>
    </SettingsShell>
  )
}
