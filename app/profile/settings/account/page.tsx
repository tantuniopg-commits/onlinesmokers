'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsShell, SettingsCard, SettingsRow, SANS } from '../shared'
import type { VelisUser } from '../../../lib/auth'
import {
  getStoredUser,
  updateUserName,
  updateUserEmail,
  changePassword as changePasswordService,
  logOut as logOutService,
  deleteAccount as deleteAccountService,
} from '../../../services/AuthService'
import { useAppNav } from '../../../contexts/AppNavContext'
import { useLocale } from '../../../contexts/LocaleContext'

function fieldInputStyle(focused: boolean) {
  return {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '13px 16px',
    borderRadius: '14px',
    border: focused ? '1px solid rgba(255, 178, 90, 0.55)' : '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: focused ? '0 0 0 3px rgba(255, 178, 90, 0.1)' : 'none',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#F5F0EA',
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: '15px',
    outline: 'none',
    transition: 'border 200ms ease-out, box-shadow 200ms ease-out',
  }
}

type EditMode = 'name' | 'email' | 'password' | null

export default function AccountSettings() {
  const router = useRouter()
  const { refreshAppState } = useAppNav()
  const { t } = useLocale()
  const [user, setUser] = useState<VelisUser | null>(null)
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    setUser(stored)
    if (stored) {
      setFirstName(stored.firstName)
      setLastName(stored.lastName)
      setEmail(stored.email)
    }
  }, [])

  const openEdit = (mode: EditMode) => {
    setEditMode(editMode === mode ? null : mode)
    setPasswordSaved(false)
  }

  const saveName = () => {
    if (!user) return
    const next = updateUserName(user, firstName, lastName)
    if (!next) return
    setUser(next)
    setEditMode(null)
  }

  const saveEmail = () => {
    if (!user) return
    const next = updateUserEmail(user, email)
    if (!next) return
    setUser(next)
    setEditMode(null)
  }

  const changePassword = () => {
    if (!changePasswordService(newPassword, confirmPassword)) return
    setPasswordSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => {
      setPasswordSaved(false)
      setEditMode(null)
    }, 1400)
  }

  const handleLogOut = () => {
    logOutService()
    refreshAppState()
    router.push('/profile')
  }

  const handleDeleteAccount = () => {
    deleteAccountService()
    refreshAppState()
    router.push('/profile')
  }

  return (
    <SettingsShell title={t('settings.account.title')}>
      <SettingsCard>
        <SettingsRow label={t('settings.account.editName')} onClick={() => openEdit('name')} chevron={editMode !== 'name'} first />
        {editMode === 'name' && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFocused('firstName')}
              onBlur={() => setFocused(null)}
              placeholder={t('settings.account.firstNamePlaceholder')}
              style={fieldInputStyle(focused === 'firstName')}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setFocused('lastName')}
              onBlur={() => setFocused(null)}
              placeholder={t('settings.account.lastNamePlaceholder')}
              style={fieldInputStyle(focused === 'lastName')}
            />
            <button onClick={saveName} style={saveButtonStyle}>
              {t('common.save')}
            </button>
          </div>
        )}

        <SettingsRow label={t('settings.account.editEmail')} onClick={() => openEdit('email')} chevron={editMode !== 'email'} />
        {editMode === 'email' && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              type="email"
              placeholder={t('settings.account.emailPlaceholder')}
              style={fieldInputStyle(focused === 'email')}
            />
            <button onClick={saveEmail} style={saveButtonStyle}>
              {t('common.save')}
            </button>
          </div>
        )}

        <SettingsRow label={t('settings.account.changePassword')} onClick={() => openEdit('password')} chevron={editMode !== 'password'} />
        {editMode === 'password' && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onFocus={() => setFocused('currentPassword')}
              onBlur={() => setFocused(null)}
              type="password"
              placeholder={t('settings.account.currentPasswordPlaceholder')}
              style={fieldInputStyle(focused === 'currentPassword')}
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocused('newPassword')}
              onBlur={() => setFocused(null)}
              type="password"
              placeholder={t('settings.account.newPasswordPlaceholder')}
              style={fieldInputStyle(focused === 'newPassword')}
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused('confirmPassword')}
              onBlur={() => setFocused(null)}
              type="password"
              placeholder={t('settings.account.confirmPasswordPlaceholder')}
              style={fieldInputStyle(focused === 'confirmPassword')}
            />
            <button onClick={changePassword} style={saveButtonStyle}>
              {passwordSaved ? t('settings.account.passwordUpdated') : t('settings.account.updatePassword')}
            </button>
          </div>
        )}
      </SettingsCard>

      <SettingsCard>
        <SettingsRow label={t('settings.account.logOut')} onClick={handleLogOut} chevron={false} first />
      </SettingsCard>

      <SettingsCard>
        {!confirmingDelete ? (
          <SettingsRow label={t('settings.account.deleteAccount')} danger onClick={() => setConfirmingDelete(true)} chevron={false} first />
        ) : (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontFamily: SANS, fontSize: '13px', color: '#E39C8C' }}>{t('settings.account.deleteWarning')}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDeleteAccount} style={{ ...saveButtonStyle, borderColor: 'rgba(227, 156, 140, 0.5)', color: '#E39C8C' }}>
                {t('settings.account.deleteAccount')}
              </button>
              <button onClick={() => setConfirmingDelete(false)} style={{ ...saveButtonStyle, background: 'transparent' }}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </SettingsCard>
    </SettingsShell>
  )
}

const saveButtonStyle = {
  padding: '12px 0',
  borderRadius: '999px',
  border: '1px solid rgba(255, 178, 90, 0.45)',
  background: 'rgba(255, 178, 90, 0.06)',
  color: '#E3C08C',
  fontFamily: SANS,
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
}
