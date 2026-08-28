'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SettingsShell, SettingsCard, SettingsRow, SANS } from '../shared'
import type { VelisUser } from '../../../lib/auth'
import {
  getStoredUser,
  updateUserName,
  changePassword as changePasswordService,
  logOut as logOutService,
  deleteAccount as deleteAccountService,
  getPasswordRuleStatus,
  isPasswordValid,
} from '../../../services/AuthService'
import type { PasswordRuleId } from '../../../services/AuthService'
import { useAppNav } from '../../../contexts/AppNavContext'
import { useLocale } from '../../../contexts/LocaleContext'

// app/profile/page.tsx'teki PasswordRuleRow ile aynı görsel dil (amber
// dolu daire + tik) - sadece burada tekrarlanıyor çünkü orijinali export
// edilmiyor ve bu tek bir küçük satır bileşeni.
function PasswordRuleRow({ label, met }: { label: string; met: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '14px',
          height: '14px',
          flexShrink: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: met ? '#E3C08C' : 'transparent',
          border: met ? 'none' : '1px solid rgba(255, 255, 255, 0.22)',
          transition: 'background 200ms ease-in-out, border 200ms ease-in-out',
        }}
      >
        {met && (
          <svg width="9" height="7" viewBox="0 0 14 11" fill="none">
            <path d="M1 5.5L5 9.5L13 1.5" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontFamily: SANS, fontSize: '12px', color: met ? '#E3C08C' : '#8F8A83', transition: 'color 200ms ease-in-out' }}>
        {label}
      </span>
    </div>
  )
}

function fieldInputStyle(focused: boolean, withRightSlot = false) {
  return {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: withRightSlot ? '13px 44px 13px 16px' : '13px 16px',
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

// app/profile/page.tsx'teki EyeIcon ile aynı görsel dil - burada tekrarlanıyor
// çünkü orijinali export edilmiyor.
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7c1.6 0 3 .3 4.2.8M22 12s-1 2-2.9 3.9M9.5 9.7A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Şifre alanları için: input + göz ikonlu göster/gizle butonu. Sadece bu
// sayfadaki 3 şifre alanı (mevcut/yeni/onay) için, tek bir yerde.
function PasswordField({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  focused,
  visible,
  onToggleVisible,
}: {
  value: string
  onChange: (v: string) => void
  onFocus: () => void
  onBlur: () => void
  placeholder: string
  focused: boolean
  visible: boolean
  onToggleVisible: () => void
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        style={fieldInputStyle(focused, true)}
      />
      <button
        type="button"
        onClick={onToggleVisible}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255, 255, 255, 0.4)',
          display: 'flex',
          padding: 0,
        }}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  )
}

type EditMode = 'name' | 'password' | null

export default function AccountSettings() {
  const router = useRouter()
  const { refreshAppState } = useAppNav()
  const { t, locale } = useLocale()
  const [user, setUser] = useState<VelisUser | null>(null)
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nameSaving, setNameSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [finalConfirmingDelete, setFinalConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const stored = getStoredUser()
    setUser(stored)
    if (stored) {
      setFirstName(stored.firstName)
      setLastName(stored.lastName)
    }
  }, [])

  const openEdit = (mode: EditMode) => {
    setEditMode(editMode === mode ? null : mode)
    setPasswordSaved(false)
    setPasswordError(null)
    setNameError(null)
  }

  const saveName = async () => {
    if (!user || nameSaving) return
    setNameSaving(true)
    setNameError(null)
    const next = await updateUserName(user, firstName, lastName)
    setNameSaving(false)
    if (!next) {
      setNameError(t('settings.account.saveFailed'))
      return
    }
    setUser(next)
    setEditMode(null)
  }

  const passwordRules = getPasswordRuleStatus(newPassword)
  const canSubmitPassword = isPasswordValid(newPassword) && newPassword === confirmPassword && currentPassword.length > 0

  const changePassword = async () => {
    if (passwordSaving || !canSubmitPassword) return
    setPasswordSaving(true)
    setPasswordError(null)
    const ok = await changePasswordService(currentPassword, newPassword, confirmPassword, locale)
    setPasswordSaving(false)
    if (!ok) {
      setPasswordError(t('settings.account.saveFailed'))
      return
    }
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

  const handleDeleteAccount = async () => {
    if (deleting) return
    setDeleting(true)
    await deleteAccountService()
    // Sert yenilemeyle '/'ye - client-side router.push ile gidilirse ağaçta
    // eski React state'i (ve intro/guide "görüldü" işaretleri) hayatta kalıp
    // ilk-açılış turu tekrar oynamıyordu. Bkz. AuthService.deleteAccount.
    if (typeof window !== 'undefined') window.location.href = '/'
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
            {nameError && <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: '#E39C8C' }}>{nameError}</p>}
            <button onClick={saveName} disabled={nameSaving} style={{ ...saveButtonStyle, opacity: nameSaving ? 0.6 : 1 }}>
              {nameSaving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        )}

        <SettingsRow label={t('settings.account.changePassword')} onClick={() => openEdit('password')} chevron={editMode !== 'password'} />
        {editMode === 'password' && (
          <div style={{ padding: '4px 20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <PasswordField
              value={currentPassword}
              onChange={setCurrentPassword}
              onFocus={() => setFocused('currentPassword')}
              onBlur={() => setFocused(null)}
              placeholder={t('settings.account.currentPasswordPlaceholder')}
              focused={focused === 'currentPassword'}
              visible={showCurrentPassword}
              onToggleVisible={() => setShowCurrentPassword((v) => !v)}
            />
            <PasswordField
              value={newPassword}
              onChange={setNewPassword}
              onFocus={() => setFocused('newPassword')}
              onBlur={() => setFocused(null)}
              placeholder={t('settings.account.newPasswordPlaceholder')}
              focused={focused === 'newPassword'}
              visible={showNewPassword}
              onToggleVisible={() => setShowNewPassword((v) => !v)}
            />
            {focused === 'newPassword' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '8px', columnGap: '12px' }}>
                {(
                  [
                    ['length', t('profile.password.rule.length')],
                    ['uppercase', t('profile.password.rule.uppercase')],
                    ['lowercase', t('profile.password.rule.lowercase')],
                    ['number', t('profile.password.rule.number')],
                    ['special', t('profile.password.rule.special')],
                  ] as [PasswordRuleId, string][]
                ).map(([rule, label]) => (
                  <PasswordRuleRow key={rule} label={label} met={passwordRules[rule]} />
                ))}
              </div>
            )}
            <PasswordField
              value={confirmPassword}
              onChange={setConfirmPassword}
              onFocus={() => setFocused('confirmPassword')}
              onBlur={() => setFocused(null)}
              placeholder={t('settings.account.confirmPasswordPlaceholder')}
              focused={focused === 'confirmPassword'}
              visible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((v) => !v)}
            />
            {passwordError && <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: '#E39C8C' }}>{passwordError}</p>}
            <button
              onClick={changePassword}
              disabled={passwordSaving || !canSubmitPassword}
              style={{ ...saveButtonStyle, opacity: passwordSaving || !canSubmitPassword ? 0.4 : 1 }}
            >
              {passwordSaving ? t('common.saving') : passwordSaved ? t('settings.account.passwordUpdated') : t('settings.account.updatePassword')}
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
        ) : !finalConfirmingDelete ? (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontFamily: SANS, fontSize: '13px', color: '#E39C8C' }}>{t('settings.account.deleteWarning')}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setFinalConfirmingDelete(true)} style={{ ...saveButtonStyle, borderColor: 'rgba(227, 156, 140, 0.5)', color: '#E39C8C' }}>
                {t('settings.account.deleteAccount')}
              </button>
              <button onClick={() => setConfirmingDelete(false)} style={{ ...saveButtonStyle, background: 'transparent' }}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontFamily: SANS, fontWeight: 600, fontSize: '13px', color: '#E39C8C' }}>
              {t('settings.account.deleteFinalConfirm')}
            </p>
            <p style={{ margin: 0, fontFamily: SANS, fontSize: '12px', color: '#8F8A83' }}>{t('settings.account.deleteFinalWarning')}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ ...saveButtonStyle, borderColor: 'rgba(227, 156, 140, 0.6)', background: 'rgba(227, 156, 140, 0.1)', color: '#E39C8C', opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? t('common.saving') : t('settings.account.deleteFinalConfirmYes')}
              </button>
              <button
                onClick={() => {
                  setConfirmingDelete(false)
                  setFinalConfirmingDelete(false)
                }}
                style={{ ...saveButtonStyle, background: 'transparent' }}
              >
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
