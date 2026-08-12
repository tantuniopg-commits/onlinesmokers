'use client'

import { useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { buttonStyle, buttonGridStyle, inputStyle, colors, SANS } from '../styles'
import {
  setRitualDurationSec,
  PRODUCTION_RITUAL_DURATION_SEC,
  MIN_RITUAL_DURATION_SEC,
  MAX_RITUAL_DURATION_SEC,
} from '../../services/DeveloperService'
import { XP_PER_RITUAL } from '../../services/XPService'
import { useDevFlags } from '../../hooks/useDevFlags'

const PRESETS = [5, 10, 15, 30, 45, 60, 90, 120]

function formatDurationMs(ms: number) {
  if (ms < 60000) return `${Math.round(ms / 1000)} seconds`
  const totalMinutes = Math.round(ms / 60000)
  if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

// Ritüel süresi için merkezi yapılandırma servisi (bkz. lib/ritualConfig.ts)
// üzerinden okuyor/yazıyor - Ritual ekranı (app/page.tsx) AYNI servisi
// kullanıyor, bu yüzden buradaki her değişiklik bir sonraki ritüel
// başlangıcında yeniden başlatma/yenileme olmadan etkili oluyor.
export default function RitualConfigSection() {
  const { isDev, ritualDurationSec: duration, cooldownMs, refresh } = useDevFlags()
  const [customValue, setCustomValue] = useState('75')

  const apply = (seconds: number) => {
    setRitualDurationSec(seconds)
    refresh()
  }

  const applyCustom = () => {
    const n = Math.min(MAX_RITUAL_DURATION_SEC, Math.max(MIN_RITUAL_DURATION_SEC, Number(customValue) || PRODUCTION_RITUAL_DURATION_SEC))
    apply(n)
    setCustomValue(String(n))
  }

  return (
    <SectionCard title="Ritual Configuration">
      <Row label="Current Ritual Duration" value={`${duration} second${duration === 1 ? '' : 's'}`} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontFamily: SANS, fontSize: '12px', color: colors.muted }}>Presets</span>
        <div style={buttonGridStyle}>
          {PRESETS.map((p) => (
            <button key={p} onClick={() => apply(p)} style={duration === p ? buttonStyle('primary') : buttonStyle()}>
              {p} Seconds{p === PRODUCTION_RITUAL_DURATION_SEC ? ' (Default)' : ''}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontFamily: SANS, fontSize: '12px', color: colors.muted }}>
          Custom Duration ({MIN_RITUAL_DURATION_SEC}–{MAX_RITUAL_DURATION_SEC}s)
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyCustom()
            }}
            type="number"
            min={MIN_RITUAL_DURATION_SEC}
            max={MAX_RITUAL_DURATION_SEC}
            style={{ ...inputStyle, width: '90px' }}
          />
          <button style={buttonStyle('primary')} onClick={applyCustom}>
            Apply
          </button>
        </div>
      </div>

      <div style={{ height: '1px', background: colors.cardBorder }} />

      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: colors.muted }}>
        Current Configuration
      </span>
      <Row label="Current Ritual Duration" value={`${duration}s`} />
      <Row label="Current Journey Cooldown" value={formatDurationMs(cooldownMs)} />
      <Row label="Current XP Reward" value={`${XP_PER_RITUAL} XP`} />
      <Row label="Current Build Mode" value={isDev ? 'Debug' : 'Release'} />
    </SectionCard>
  )
}
