'use client'

import { useEffect, useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { buttonStyle, buttonGridStyle } from '../styles'
import { getStoredStats } from '../../lib/auth'
import { devAddXP, devResetXP } from '../../lib/journey'

export default function XPSection() {
  const [xp, setXp] = useState<number | null>(null)

  useEffect(() => {
    setXp(getStoredStats().totalXP)
  }, [])

  const apply = (fn: () => { totalXP: number }) => {
    const next = fn()
    setXp(next.totalXP)
  }

  return (
    <SectionCard title="XP">
      <Row label="Current XP" value={xp ?? '—'} />
      <div style={buttonGridStyle}>
        <button style={buttonStyle()} onClick={() => apply(() => devAddXP(10))}>
          +10 XP
        </button>
        <button style={buttonStyle()} onClick={() => apply(() => devAddXP(100))}>
          +100 XP
        </button>
        <button style={buttonStyle()} onClick={() => apply(() => devAddXP(1000))}>
          +1000 XP
        </button>
        <button style={buttonStyle('danger')} onClick={() => apply(() => devResetXP())}>
          Reset XP
        </button>
      </div>
    </SectionCard>
  )
}
