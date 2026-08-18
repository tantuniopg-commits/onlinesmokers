'use client'

import { useEffect, useState } from 'react'
import type { KeyboardEvent } from 'react'
import VelisMark from './VelisMark'
import { FONT_SANS } from './lib/typography'
import { sendOtp, verifyOtp, getOtpState, getResendRemainingMs } from './services/VerificationService'
import type { OtpChannel } from './services/VerificationService'
import { isDev } from './constants/env'
import { useLocale } from './contexts/LocaleContext'

// Telefon VE e-posta doğrulaması için TEK, yeniden kullanılabilir adım -
// ikisi de aynı akışı izliyor (Send Code -> kod gir -> Verify), sadece
// hedef/metin farklı. Gerçek SMS/e-posta sağlayıcısı bağlanınca bu bileşen
// HİÇ değişmeyecek - sadece VerificationService'in içi değişecek.

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

function formatSeconds(ms: number) {
  return `${Math.ceil(ms / 1000)}s`
}

export default function OtpStep({
  channel,
  destination,
  title,
  onVerified,
  backLabel,
  onBack,
  devSkip,
}: {
  channel: OtpChannel
  destination: string
  title: string
  // Doğru kod girilince çağrılıyor. Bir string dönerse (ör. hesap oluşturma
  // API hatası) o, kod alanının altında hata olarak gösteriliyor.
  onVerified: () => void | string | Promise<void | string>
  backLabel?: string
  onBack?: () => void
  // Test kolaylığı için - SADECE dev modda görünen "Skip" linki, kod
  // girmeden onVerified()'ı direkt çağırıyor. Gerçek sağlayıcıya
  // geçildiğinde bu link tamamen kaldırılacak (bkz. isDev kontrolü).
  devSkip?: boolean
}) {
  const { t } = useLocale()
  const [sent, setSent] = useState(() => {
    const existing = getOtpState(channel)
    return !!existing && existing.expiresAt > Date.now()
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState(false)
  const [resendMs, setResendMs] = useState(0)

  useEffect(() => {
    const tick = () => setResendMs(getResendRemainingMs(channel))
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [channel])

  const handleSend = async () => {
    if (sending) return
    setSending(true)
    setError(null)
    try {
      await sendOtp(channel, destination)
      setSent(true)
      setCode('')
      setResendMs(getResendRemainingMs(channel))
    } catch (e) {
      setError(e instanceof Error ? e.message : t('otp.sendFailed'))
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    if (code.trim().length === 0 || submitting) return
    setSubmitting(true)
    setError(null)
    const ok = await verifyOtp(channel, code)
    if (!ok) {
      setError(t('otp.incorrect'))
      setSubmitting(false)
      return
    }
    const result = await onVerified()
    setSubmitting(false)
    if (typeof result === 'string') setError(result)
  }

  const handleSkip = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const result = await onVerified()
    setSubmitting(false)
    if (typeof result === 'string') setError(result)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleVerify()
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
      <h1 style={{ marginTop: '14px', fontFamily: FONT_SANS, fontWeight: 600, fontSize: '26px', color: '#F5F0EA', textAlign: 'center' }}>
        {title}
      </h1>
      <p style={{ marginTop: '8px', fontFamily: FONT_SANS, fontWeight: 400, fontSize: '14px', color: '#D2CCC5', textAlign: 'center' }}>
        {sent ? t('otp.sentTo', { destination: destination || 'you' }) : t('otp.willSendTo', { destination: destination || 'you' })}
      </p>

      {sent && (
        <div style={{ marginTop: '28px', width: '100%', maxWidth: '380px' }}>
          <label style={{ display: 'block', fontFamily: FONT_SANS, fontWeight: 500, fontSize: '12px', color: '#9A948C', marginBottom: '8px' }}>
            {t('otp.verify.code')}
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '13px 16px',
              borderRadius: '14px',
              border: error ? '1px solid rgba(255, 130, 100, 0.5)' : '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#F5F0EA',
              fontFamily: FONT_SANS,
              fontWeight: 600,
              fontSize: '18px',
              letterSpacing: '4px',
              outline: 'none',
              transition: 'border 200ms ease-out',
            }}
          />
        </div>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          marginTop: error ? '10px' : 0,
          maxHeight: error ? '40px' : 0,
          overflow: 'hidden',
          opacity: error ? 1 : 0,
          transition: 'opacity 250ms ease-in-out, max-height 250ms ease-in-out, margin-top 250ms ease-in-out',
        }}
      >
        <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: 'rgba(255, 150, 120, 0.85)', textAlign: 'center' }}>{error}</div>
      </div>

      <div style={{ marginTop: '20px', width: '100%', maxWidth: '380px' }}>
        {sent ? (
          <button className="velis-primary-btn" onClick={handleVerify} style={primaryButtonStyle(code.trim().length > 0 && !submitting)}>
            {submitting ? t('otp.verifying') : t('otp.verify')}
          </button>
        ) : (
          <button className="velis-primary-btn" onClick={handleSend} style={primaryButtonStyle(!sending)}>
            {sending ? t('otp.sending') : t('otp.sendCode')}
          </button>
        )}
      </div>

      {sent && (
        <button
          onClick={handleSend}
          disabled={resendMs > 0 || sending}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            cursor: resendMs > 0 || sending ? 'default' : 'pointer',
            fontFamily: FONT_SANS,
            fontWeight: 400,
            fontSize: '13px',
            color: resendMs > 0 ? '#5C574F' : '#E3C08C',
          }}
        >
          {resendMs > 0 ? t('otp.resendIn', { seconds: formatSeconds(resendMs) }) : t('otp.resend')}
        </button>
      )}

      {isDev && devSkip && (
        <button
          onClick={handleSkip}
          disabled={submitting}
          style={{
            marginTop: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: '13px',
            color: '#6E9A7A',
          }}
        >
          {t('otp.skipDev')}
        </button>
      )}

      {onBack && (
        <button
          onClick={onBack}
          style={{
            marginTop: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: FONT_SANS,
            fontWeight: 400,
            fontSize: '13px',
            color: '#8F8A83',
          }}
        >
          {backLabel ?? t('common.back')}
        </button>
      )}
    </main>
  )
}
