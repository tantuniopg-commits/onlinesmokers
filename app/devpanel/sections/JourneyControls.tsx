'use client'

import { useState } from 'react'
import SectionCard from '../SectionCard'
import { buttonStyle, buttonGridStyle, inputStyle } from '../styles'
import { getStoredStats } from '../../lib/auth'
import { devSetJourneyDay, devResetJourney, TOTAL_JOURNEY_DAYS } from '../../services/JourneyService'

const MAX_DAY = TOTAL_JOURNEY_DAYS

export default function JourneyControlsSection() {
  const [jumpValue, setJumpValue] = useState('1')

  const bumpDay = (delta: number) => {
    const current = getStoredStats()
    devSetJourneyDay(Math.max(0, current.journeyDay + delta))
  }

  const jumpToDay = () => {
    const n = Math.min(MAX_DAY, Math.max(1, Number(jumpValue) || 1))
    devSetJourneyDay(n)
    setJumpValue(String(n))
  }

  return (
    <SectionCard title="Journey Controls">
      <div style={buttonGridStyle}>
        <button style={buttonStyle()} onClick={() => bumpDay(1)}>
          +1 Day
        </button>
        <button style={buttonStyle()} onClick={() => bumpDay(-1)}>
          -1 Day
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') jumpToDay()
          }}
          type="number"
          min={1}
          max={MAX_DAY}
          style={{ ...inputStyle, width: '90px' }}
        />
        <button style={buttonStyle('primary')} onClick={jumpToDay}>
          Jump to Day
        </button>
      </div>

      <div style={buttonGridStyle}>
        <button style={buttonStyle('danger')} onClick={() => devResetJourney()}>
          Reset Journey
        </button>
        <button style={buttonStyle()} onClick={() => devSetJourneyDay(MAX_DAY)}>
          Unlock All Journey Days
        </button>
        <button style={buttonStyle()} onClick={() => devSetJourneyDay(0)}>
          Lock All Journey Days
        </button>
      </div>
    </SectionCard>
  )
}
