'use client'

import { useEffect, useState } from 'react'
import SectionCard from '../SectionCard'
import { buttonStyle, colors, SANS, SANS_DISPLAY } from '../styles'
import { getUsersRequest } from '../../lib/authApi'
import type { AuthApiStoredUser } from '../../lib/authApi'
import { getStoredToken } from '../../lib/auth'

// Backend'e kayıtlı HER hesabın, kayıt sırasında girdiği bilgiler + canlı
// ilerleme (journey day / streak / XP ...). Sunucuda requireAdmin ile
// korunuyor - sadece admin token'ıyla çekilebiliyor. Şifre hiç dönmüyor.
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
      <span style={{ fontFamily: SANS, fontSize: '11px', color: colors.muted }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: '11px', color: colors.white, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function UserDatabaseSection() {
  const [users, setUsers] = useState<AuthApiStoredUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    const token = getStoredToken()
    if (!token) {
      setError('Sign in with an admin account to view registered users.')
      return
    }
    setLoading(true)
    setError(null)
    getUsersRequest(token)
      .then((res) => setUsers(res.users))
      .catch((e) => setError(e?.message === 'Admin access required' ? 'This account is not an admin.' : 'Could not reach the server.'))
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  return (
    <SectionCard title={`Registered Accounts${users ? ` — ${users.length}` : ''}`}>
      <button style={buttonStyle()} onClick={refresh} disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh'}
      </button>

      {error && <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.danger }}>{error}</p>}

      {users && users.length === 0 && !error && (
        <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.muted }}>No accounts registered yet.</p>
      )}

      {users && users.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: SANS_DISPLAY, fontWeight: 600, fontSize: '14px', color: colors.white }}>
                  {u.name}
                  {u.isAdmin && (
                    <span style={{ fontFamily: SANS, fontSize: '10px', color: colors.amber, marginLeft: '6px' }}>ADMIN</span>
                  )}
                </span>
                <span style={{ fontFamily: SANS, fontSize: '11px', color: colors.muted }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>

              <Field label="Email" value={u.email} />
              {u.phone && <Field label="Phone" value={u.phone} />}
              <Field label="Gender" value={u.gender || '—'} />
              <Field label="Birth date" value={u.birthDate || '—'} />
              <Field label="Language" value={(u.locale || 'en').toUpperCase()} />

              <div style={{ height: '1px', background: colors.cardBorder, margin: '3px 0' }} />

              <Field label="Journey day" value={String(u.stats?.journeyDay ?? 0)} />
              <Field label="Streak" value={`${u.stats?.currentStreak ?? 0} days`} />
              <Field label="Total XP" value={String(u.stats?.totalXP ?? 0)} />
              <Field label="Rituals" value={String(u.stats?.totalRitualCount ?? 0)} />
              <Field
                label="Ritual time"
                value={`${Math.round((u.stats?.totalRitualTimeSec ?? 0) / 60)} min`}
              />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
