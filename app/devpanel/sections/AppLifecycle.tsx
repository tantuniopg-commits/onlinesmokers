'use client'

import { useEffect, useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { buttonStyle, colors, SANS } from '../styles'
import { getStoredStats } from '../../lib/auth'
import {
  getCooldownRemainingMs,
  formatCooldown,
  devSetJourneyDay,
  devResetJourney,
  devAddXP,
  devAdjustStreak,
  devRestartCooldown,
  devSkipCooldown,
} from '../../services/JourneyService'
import { advanceDevTime } from '../../lib/time'
import { factoryReset, resetDeveloperFlags } from '../../services/DeveloperService'
import { deleteAccount } from '../../services/AuthService'
import { getAppState, devJumpToState } from '../../services/AppStateManager'
import type { AppLifecycleState } from '../../services/AppStateManager'

const STATES: AppLifecycleState[] = ['FIRST_LAUNCH', 'FIRST_RITUAL_COMPLETED', 'GUEST', 'REGISTERING', 'REGISTERED']

const TIME_STEPS = [
  { label: '+1 Hour', ms: 60 * 60 * 1000 },
  { label: '+6 Hours', ms: 6 * 60 * 60 * 1000 },
  { label: '+12 Hours', ms: 12 * 60 * 60 * 1000 },
  { label: '+24 Hours', ms: 24 * 60 * 60 * 1000 },
  { label: '+7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
]

function StateRadioRow({ state, active, onSelect }: { state: AppLifecycleState; active: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '2px 0' }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          flexShrink: 0,
          border: `1.5px solid ${active ? colors.amber : 'rgba(255, 255, 255, 0.25)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.amber }} />}
      </div>
      <span style={{ fontFamily: SANS, fontSize: '13px', fontWeight: active ? 600 : 400, color: active ? colors.amber : colors.white }}>
        {state}
      </span>
    </div>
  )
}

function StepperRow({ onDecrement, onIncrement, decrementLabel = '−', incrementLabel = '+' }: {
  onDecrement: () => void
  onIncrement: () => void
  decrementLabel?: string
  incrementLabel?: string
}) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button style={buttonStyle()} onClick={onDecrement}>
        {decrementLabel}
      </button>
      <button style={buttonStyle()} onClick={onIncrement}>
        {incrementLabel}
      </button>
    </div>
  )
}

// VELIS'in tek yaşam döngüsü kaynağı (bkz. services/AppStateManager.ts) +
// en sık kullanılan Journey/XP/Streak/Countdown/Time/Reset kısayolları için
// tek, kompakt Developer Panel bölümü. Daha ayrıntılı/eski kontroller
// (JourneyControls, XP, Cooldown, LiveJourneyState, TimeMachine, Reset
// bölümleri) panelde AYNEN kalıyor - bu sadece hızlı erişim için üstlerine
// eklenen bir kısayol katmanı.
export default function AppLifecycleSection() {
  const [appState, setAppState] = useState<AppLifecycleState>('FIRST_LAUNCH')
  const [journeyDay, setJourneyDay] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [cooldownMs, setCooldownMs] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => {
      setAppState(getAppState())
      const stats = getStoredStats()
      setJourneyDay(stats.journeyDay)
      setTotalXP(stats.totalXP)
      setCurrentStreak(stats.currentStreak)
      setCooldownMs(getCooldownRemainingMs(stats.journeyTimestamp))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <SectionCard title="Application State">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {STATES.map((state) => (
            <StateRadioRow key={state} state={state} active={appState === state} onSelect={() => devJumpToState(state)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Journey">
        <Row label="Current Day" value={journeyDay} />
        <StepperRow onDecrement={() => devSetJourneyDay(journeyDay - 1)} onIncrement={() => devSetJourneyDay(journeyDay + 1)} />
      </SectionCard>

      <SectionCard title="XP">
        <Row label="Total XP" value={`${totalXP} XP`} />
        <StepperRow
          decrementLabel="-100"
          incrementLabel="+100"
          onDecrement={() => devAddXP(-100)}
          onIncrement={() => devAddXP(100)}
        />
      </SectionCard>

      <SectionCard title="Streak">
        <Row label="Current Streak" value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`} />
        <StepperRow onDecrement={() => devAdjustStreak(-1)} onIncrement={() => devAdjustStreak(1)} />
      </SectionCard>

      <SectionCard title="Countdown">
        <Row label="Current Countdown" value={cooldownMs !== null ? formatCooldown(cooldownMs) : 'Available now'} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={buttonStyle()} onClick={() => devRestartCooldown()}>
            Reset
          </button>
          <button style={buttonStyle('primary')} onClick={() => devSkipCooldown()}>
            Complete Now
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Developer Time Machine">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TIME_STEPS.map((step) => (
            <button key={step.label} style={buttonStyle()} onClick={() => advanceDevTime(step.ms)}>
              {step.label}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Reset Application">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
          <button style={buttonStyle('danger')} onClick={factoryReset}>
            Factory Reset
          </button>
          <button style={buttonStyle('danger')} onClick={() => devResetJourney()}>
            Reset Journey
          </button>
          <button style={buttonStyle('danger')} onClick={deleteAccount}>
            Reset Account
          </button>
          <button style={buttonStyle('danger')} onClick={resetDeveloperFlags}>
            Reset Developer Flags
          </button>
        </div>
      </SectionCard>
    </>
  )
}
