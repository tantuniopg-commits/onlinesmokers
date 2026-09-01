'use client'

import { SettingsShell, SettingsCard, CheckIcon, SANS } from '../shared'
import { useSettings } from '../../../hooks/useSettings'
import { useLocale } from '../../../contexts/LocaleContext'
import type { SoundPalette } from '../../../services/SettingsService'
import type { TranslationKey } from '../../../lib/i18n'
import { playSound } from '../../../lib/sound'

// Ses paletleri hem kalıcılaşıyor hem de seçildiği an KISA bir önizleme
// çalıyor (bkz. lib/sound.ts playSound force parametresi) - kullanıcı
// ritüele girmeden farkı duyuyor. 'off' seçilince önizleme de sessiz.
const OPTIONS: { code: SoundPalette; nameKey: TranslationKey; descKey: TranslationKey }[] = [
  { code: 'ceramic', nameKey: 'settings.sound.ceramic', descKey: 'settings.sound.ceramic.desc' },
  { code: 'bowl', nameKey: 'settings.sound.bowl', descKey: 'settings.sound.bowl.desc' },
  { code: 'breath', nameKey: 'settings.sound.breath', descKey: 'settings.sound.breath.desc' },
  { code: 'off', nameKey: 'settings.sound.off', descKey: 'settings.sound.off.desc' },
]

export default function SoundSettings() {
  const { t } = useLocale()
  const { settings, updateSound } = useSettings()
  const current = settings?.sound.palette

  const choose = (code: SoundPalette) => {
    updateSound(code)
    // Seçilen paletin "hazır" tonu + bir top dokunuşu - kısa ama karakteri
    // belli eden bir örnek.
    playSound('ready', code)
    if (code !== 'off') window.setTimeout(() => playSound('orb', code), 620)
  }

  if (!current) return <SettingsShell title={t('settings.sound.title')}>{null}</SettingsShell>

  return (
    <SettingsShell title={t('settings.sound.title')}>
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '13px', color: '#8F8A83' }}>{t('settings.sound.note')}</p>
      <SettingsCard>
        {OPTIONS.map((opt, i) => (
          <div
            key={opt.code}
            onClick={() => choose(opt.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '15px 20px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: '15px', color: '#F5F0EA' }}>
                {t(opt.nameKey)}
              </span>
              <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: '#8F8A83' }}>
                {t(opt.descKey)}
              </span>
            </div>
            {current === opt.code && (
              <div style={{ flexShrink: 0 }}>
                <CheckIcon />
              </div>
            )}
          </div>
        ))}
      </SettingsCard>
    </SettingsShell>
  )
}
