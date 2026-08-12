'use client'

import { useState } from 'react'
import SectionCard from '../SectionCard'
import { buttonStyle, buttonGridStyle, colors, SANS } from '../styles'
import { deleteAccount, logOut } from '../../services/AuthService'
import { devResetJourney, devResetXP } from '../../lib/journey'
import { factoryReset } from '../../services/DeveloperService'
import { useAppNav } from '../../contexts/AppNavContext'

export default function ResetSection() {
  const { refreshAppState } = useAppNav()
  const [confirming, setConfirming] = useState(false)

  const resetProfile = () => {
    deleteAccount()
    refreshAppState()
  }

  const resetAuthentication = () => {
    logOut()
    refreshAppState()
  }

  return (
    <SectionCard title="Reset">
      <div style={buttonGridStyle}>
        <button style={buttonStyle('danger')} onClick={() => devResetJourney()}>
          Reset Journey
        </button>
        <button style={buttonStyle('danger')} onClick={() => devResetXP()}>
          Reset XP
        </button>
        <button style={buttonStyle('danger')} onClick={resetProfile}>
          Reset Profile
        </button>
        <button style={buttonStyle('danger')} onClick={resetAuthentication}>
          Reset Authentication
        </button>
      </div>

      {!confirming ? (
        <button style={{ ...buttonStyle('danger'), alignSelf: 'flex-start' }} onClick={() => setConfirming(true)}>
          Factory Reset
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: SANS, fontSize: '12px', color: colors.danger }}>
            This clears all local development data and reloads the app. Are you sure?
          </span>
          <button style={buttonStyle('danger')} onClick={factoryReset}>
            Confirm
          </button>
          <button style={buttonStyle()} onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </div>
      )}
    </SectionCard>
  )
}
