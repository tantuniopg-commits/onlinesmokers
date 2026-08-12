'use client'

import { useEffect, useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { buttonStyle, buttonGridStyle } from '../styles'
import { advanceDevTime, resetDevTime, getDevTimeOffsetMs } from '../../lib/time'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const STEPS = [
  { label: '+1 Hour', ms: HOUR },
  { label: '+6 Hours', ms: 6 * HOUR },
  { label: '+12 Hours', ms: 12 * HOUR },
  { label: '+24 Hours', ms: DAY },
  { label: '+7 Days', ms: 7 * DAY },
]

function formatOffset(ms: number) {
  if (ms === 0) return 'No offset (real device time)'
  const sign = ms > 0 ? '+' : '-'
  const abs = Math.abs(ms)
  const days = Math.floor(abs / DAY)
  const hours = Math.floor((abs % DAY) / HOUR)
  return `${sign}${days > 0 ? `${days}d ` : ''}${hours}h`
}

// Cihaz saatini hiç değiştirmeden uygulamanın "şimdi" algısını ileri alıyor
// (bkz. lib/time.ts) - lib/journey.ts'teki TÜM soğuma hesaplamaları bu
// ofseti otomatik olarak görüyor, ekstra bir kod değişikliği gerekmiyor.
export default function TimeMachineSection() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    setOffset(getDevTimeOffsetMs())
  }, [])

  const advance = (ms: number) => {
    advanceDevTime(ms)
    setOffset(getDevTimeOffsetMs())
  }

  const reset = () => {
    resetDevTime()
    setOffset(0)
  }

  return (
    <SectionCard title="Time Machine">
      <Row label="Simulated Offset" value={formatOffset(offset)} />
      <div style={buttonGridStyle}>
        {STEPS.map((step) => (
          <button key={step.label} style={buttonStyle()} onClick={() => advance(step.ms)}>
            {step.label}
          </button>
        ))}
        <button style={buttonStyle('danger')} onClick={reset}>
          Reset Time
        </button>
      </div>
    </SectionCard>
  )
}
