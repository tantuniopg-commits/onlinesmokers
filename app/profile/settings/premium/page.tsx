'use client'

import { SettingsShell, SANS, SERIF } from '../shared'
import { useLocale } from '../../../contexts/LocaleContext'

export default function PremiumSettings() {
  const { t } = useLocale()
  return (
    <SettingsShell title={t('settings.premium.title')}>
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          border: '1px solid rgba(255, 178, 90, 0.22)',
          borderRadius: '20px',
          background: 'rgba(255, 178, 90, 0.03)',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '10px',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" fill="#F3CE8E" />
        </svg>
        <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: '20px', color: '#F5F0EA' }}>
          {t('settings.premium.heading')}
        </h2>
        <p style={{ margin: 0, fontFamily: SANS, fontWeight: 300, fontSize: '14px', color: '#9A948C' }}>{t('settings.premium.body')}</p>
      </div>
    </SettingsShell>
  )
}
