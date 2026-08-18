'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import VelisMark from './VelisMark'
import { FONT_SANS } from './lib/typography'
import { useLocale } from './contexts/LocaleContext'
import { getPasswordRuleStatus, isPasswordValid } from './services/AuthService'
import type { PasswordRuleId } from './services/AuthService'
import { forgotPasswordRequest, verifyResetCodeRequest, resetPasswordRequest, AuthApiError } from './lib/authApi'

// "Şifremi unuttum" akışı - email gir -> kod gir -> yeni şifre oluştur ->
// Sign In'e geri dön (bkz. app/profile/page.tsx, ForgotPasswordFlow burada
// mode==='signin' iken açılan ayrı bir ekran katmanı). Kod sunucuda
// hash'lenip saklanıyor (bkz. server/src/controllers/passwordResetController.js),
// gerçek e-posta o anki uygulama diliyle (locale) gönderiliyor.

type Step = 'email' | 'code' | 'newPassword'

function primaryButtonStyle(enabled: boolean) {
  return {
    width: '100%',
    padding: '15px 0',
    borderRadius: '999px',
    border: '1px solid rgba(255, 178, 90, 0.5)',
    background: 'transparent',
    color: '#E3C08C',
    fontFamily: FONT_SANS,
    fontWeight: 600 as const,
    fontSize: '16px',
    letterSpacing: '0.3px',
    cursor: enabled ? ('pointer' as const) : ('default' as const),
    opacity: enabled ? 1 : 0.4,
    pointerEvents: enabled ? ('auto' as const) : ('none' as const),
    transition: 'opacity 250ms ease-in-out, transform 150ms ease-out',
  }
}

function textInputStyle(withRightSlot = false) {
  return {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: withRightSlot ? '13px 44px 13px 16px' : '13px 16px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#F5F0EA',
    fontFamily: FONT_SANS,
    fontWeight: 400,
    fontSize: '15px',
    outline: 'none',
  }
}

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
      <span style={{ fontFamily: FONT_SANS, fontSize: '12px', color: met ? '#E3C08C' : '#8F8A83', transition: 'color 200ms ease-in-out' }}>
        {label}
      </span>
    </div>
  )
}

export default function ForgotPasswordFlow({ onDone, onCancel }: { onDone: (email: string) => void; onCancel: () => void }) {
  const { t, locale } = useLocale()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordRules = getPasswordRuleStatus(newPassword)
  const canSubmitNewPassword = isPasswordValid(newPassword) && newPassword === confirmPassword

  const handleSendCode = async () => {
    if (submitting || !email.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await forgotPasswordRequest(email.trim(), locale)
      setStep('code')
    } catch (e) {
      setError(e instanceof AuthApiError ? e.message : t('profile.error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyCode = async () => {
    if (submitting || code.trim().length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await verifyResetCodeRequest(email.trim(), code.trim())
      if (!result.valid) {
        setError(t('otp.incorrect'))
        return
      }
      setStep('newPassword')
    } catch (e) {
      setError(e instanceof AuthApiError ? e.message : t('profile.error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (submitting || !canSubmitNewPassword) return
    setSubmitting(true)
    setError(null)
    try {
      await resetPasswordRequest(email.trim(), code.trim(), newPassword)
      onDone(email.trim())
    } catch (e) {
      setError(e instanceof AuthApiError ? e.message : t('profile.error.generic'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, submit: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <main
      style={{
        height: '100dvh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(28px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))',
        overflow: 'hidden',
      }}
    >
      <VelisMark />

      {step === 'email' && (
        <>
          <h1 style={{ marginTop: '14px', fontFamily: FONT_SANS, fontWeight: 600, fontSize: '26px', color: '#F5F0EA', textAlign: 'center' }}>
            {t('passwordReset.email.title')}
          </h1>
          <p style={{ marginTop: '8px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '14px', color: '#D2CCC5', textAlign: 'center' }}>
            {t('passwordReset.email.subtitle')}
          </p>
          <div style={{ marginTop: '28px', width: '100%', maxWidth: '380px' }}>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleSendCode)}
              placeholder={t('passwordReset.email.placeholder')}
              style={textInputStyle()}
            />
          </div>
          {error && (
            <div style={{ marginTop: '10px', width: '100%', maxWidth: '380px' }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: 'rgba(255, 150, 120, 0.85)', textAlign: 'center' }}>{error}</div>
            </div>
          )}
          <div style={{ marginTop: '20px', width: '100%', maxWidth: '380px' }}>
            <button onClick={handleSendCode} style={primaryButtonStyle(email.trim().length > 0 && !submitting)}>
              {submitting ? t('passwordReset.sending') : t('passwordReset.continue')}
            </button>
          </div>
        </>
      )}

      {step === 'code' && (
        <>
          <h1 style={{ marginTop: '14px', fontFamily: FONT_SANS, fontWeight: 600, fontSize: '26px', color: '#F5F0EA', textAlign: 'center' }}>
            {t('passwordReset.code.title')}
          </h1>
          <p style={{ marginTop: '8px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '14px', color: '#D2CCC5', textAlign: 'center' }}>
            {t('passwordReset.code.subtitle', { email: email.trim() })}
          </p>
          <div style={{ marginTop: '28px', width: '100%', maxWidth: '380px' }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => handleKeyDown(e, handleVerifyCode)}
              style={{ ...textInputStyle(), fontWeight: 600, fontSize: '18px', letterSpacing: '4px' }}
            />
          </div>
          {error && (
            <div style={{ marginTop: '10px', width: '100%', maxWidth: '380px' }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: 'rgba(255, 150, 120, 0.85)', textAlign: 'center' }}>{error}</div>
            </div>
          )}
          <div style={{ marginTop: '20px', width: '100%', maxWidth: '380px' }}>
            <button onClick={handleVerifyCode} style={primaryButtonStyle(code.trim().length > 0 && !submitting)}>
              {submitting ? t('otp.verifying') : t('otp.verify')}
            </button>
          </div>
          <button
            onClick={() => {
              setStep('email')
              setError(null)
            }}
            style={{ marginTop: '16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT_SANS, fontSize: '13px', color: '#8F8A83' }}
          >
            {t('passwordReset.back')}
          </button>
        </>
      )}

      {step === 'newPassword' && (
        <>
          <h1 style={{ marginTop: '14px', fontFamily: FONT_SANS, fontWeight: 600, fontSize: '26px', color: '#F5F0EA', textAlign: 'center' }}>
            {t('passwordReset.newPassword.title')}
          </h1>
          <p style={{ marginTop: '8px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '14px', color: '#D2CCC5', textAlign: 'center' }}>
            {t('passwordReset.newPassword.subtitle')}
          </p>
          <div style={{ marginTop: '28px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('settings.account.newPasswordPlaceholder')}
                style={textInputStyle(true)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
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
                <EyeIcon open={showNewPassword} />
              </button>
            </div>

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

            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleResetPassword)}
                placeholder={t('settings.account.confirmPasswordPlaceholder')}
                style={textInputStyle(true)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </div>
          {error && (
            <div style={{ marginTop: '10px', width: '100%', maxWidth: '380px' }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: 'rgba(255, 150, 120, 0.85)', textAlign: 'center' }}>{error}</div>
            </div>
          )}
          <div style={{ marginTop: '20px', width: '100%', maxWidth: '380px' }}>
            <button onClick={handleResetPassword} style={primaryButtonStyle(canSubmitNewPassword && !submitting)}>
              {submitting ? t('passwordReset.submitting') : t('passwordReset.submit')}
            </button>
          </div>
        </>
      )}

      {step === 'email' && (
        <button
          onClick={onCancel}
          style={{ marginTop: '14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT_SANS, fontSize: '13px', color: '#8F8A83' }}
        >
          {t('common.back')}
        </button>
      )}
    </main>
  )
}
