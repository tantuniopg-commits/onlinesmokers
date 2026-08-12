'use client'

import { useEffect, useState } from 'react'
import SectionCard from '../SectionCard'
import { buttonStyle, buttonGridStyle, colors, SANS } from '../styles'
import { getDevCooldownOverrideMs, setDevCooldownOverrideMs } from '../../lib/devCooldown'
import { JOURNEY_COOLDOWN_MS } from '../../lib/journey'

const OPTIONS = [
  { label: '10 Seconds', ms: 10 * 1000 },
  { label: '30 Seconds', ms: 30 * 1000 },
  { label: '1 Minute', ms: 60 * 1000 },
  { label: '5 Minutes', ms: 5 * 60 * 1000 },
  { label: '24 Hours', ms: JOURNEY_COOLDOWN_MS },
]

// Değiştirme ANINDA lib/journey.ts'teki getActiveCooldownMs() tarafından
// okunuyor - sunucu/uygulama yeniden başlatmaya gerek yok, bir sonraki
// completeRitual()/getCooldownRemainingMs() çağrısı doğrudan yeni değeri
// kullanıyor.
export default function CooldownSection() {
  const [activeMs, setActiveMs] = useState<number | null>(null)

  useEffect(() => {
    setActiveMs(getDevCooldownOverrideMs() ?? JOURNEY_COOLDOWN_MS)
  }, [])

  const choose = (ms: number) => {
    setDevCooldownOverrideMs(ms === JOURNEY_COOLDOWN_MS ? null : ms)
    setActiveMs(ms)
  }

  return (
    <SectionCard title="Cooldown">
      <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.muted }}>
        Controls how long a user must wait before the next completed ritual can advance the Journey Day.
      </p>
      <div style={buttonGridStyle}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => choose(opt.ms)}
            style={activeMs === opt.ms ? buttonStyle('primary') : buttonStyle()}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
