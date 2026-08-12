'use client'

import { useState } from 'react'
import { SettingsShell, SettingsCard, SettingsRow, SANS } from '../shared'
import { APP_VERSION as VELIS_VERSION, BUILD_NUMBER } from '../../../constants/version'
import { useLocale } from '../../../contexts/LocaleContext'

type Expanded = 'support' | 'rate' | 'website' | null

// Gerçek destek e-postası / web sitesi / mağaza sayfası henüz yok (VELIS
// yayınlanmadı) - bunları var gibi göstermek yerine dürüst bir "yakında"
// notu gösteriyoruz.
export default function AboutSettings() {
  const { t } = useLocale()
  const [expanded, setExpanded] = useState<Expanded>(null)

  const toggle = (key: Expanded) => setExpanded(expanded === key ? null : key)

  return (
    <SettingsShell title={t('settings.about.title')}>
      <SettingsCard>
        <SettingsRow label={t('settings.about.version')} value={VELIS_VERSION} chevron={false} first />
        <SettingsRow label={t('settings.about.build')} value={BUILD_NUMBER} chevron={false} />
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label={t('settings.about.support')} onClick={() => toggle('support')} chevron={expanded !== 'support'} first />
        {expanded === 'support' && <Note text={t('settings.about.supportNote')} />}

        <SettingsRow label={t('settings.about.rate')} onClick={() => toggle('rate')} chevron={expanded !== 'rate'} />
        {expanded === 'rate' && <Note text={t('settings.about.rateNote')} />}

        <SettingsRow label={t('settings.about.website')} onClick={() => toggle('website')} chevron={expanded !== 'website'} />
        {expanded === 'website' && <Note text={t('settings.about.websiteNote')} />}
      </SettingsCard>
    </SettingsShell>
  )
}

function Note({ text }: { text: string }) {
  return (
    <p style={{ margin: 0, padding: '0 20px 18px', fontFamily: SANS, fontSize: '13px', color: '#8F8A83', lineHeight: 1.5 }}>
      {text}
    </p>
  )
}
