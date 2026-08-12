'use client'

import { useEffect, useState } from 'react'
import SectionCard from '../SectionCard'
import { buttonStyle, colors, SANS, SANS_DISPLAY } from '../styles'
import { getUsersRequest } from '../../lib/authApi'
import type { AuthApiStoredUser } from '../../lib/authApi'

// Gerçek/kalıcı depolamada (bkz. server/src/config/db.js - artık diske
// kalıcı yazan bir MongoDB) NELERİN saklandığını doğrudan görebilmek için -
// backend'e her kayıt olan/giriş yapan kullanıcı burada listeleniyor. Şifre
// backend'den zaten hiç dönmüyor (bkz. authController.js listUsers) - burada
// da gösterilmiyor, sadece hesabın var olduğu doğrulanabiliyor.
export default function UserDatabaseSection() {
  const [users, setUsers] = useState<AuthApiStoredUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    setError(null)
    getUsersRequest()
      .then((res) => setUsers(res.users))
      .catch(() => setError('Could not reach the server.'))
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  return (
    <SectionCard title={`Registered Accounts (Persistent Storage)${users ? ` — ${users.length}` : ''}`}>
      <button style={buttonStyle()} onClick={refresh} disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh'}
      </button>

      {error && <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.danger }}>{error}</p>}

      {users && users.length === 0 && !error && (
        <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: colors.muted }}>
          No accounts registered yet - this list only ever shows real accounts, never generated ones.
        </p>
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
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontFamily: SANS_DISPLAY, fontWeight: 600, fontSize: '14px', color: colors.white }}>{u.name}</span>
                <span style={{ fontFamily: SANS, fontSize: '11px', color: colors.muted }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: '12px', color: colors.muted }}>{u.email}</span>
              <span style={{ fontFamily: SANS, fontSize: '12px', color: colors.amber }}>
                {u.stats?.currentStreak ?? 0} day streak · {u.stats?.totalXP ?? 0} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
