'use client'

import { useEffect, useState } from 'react'
import SectionCard, { Row } from '../SectionCard'
import { buttonStyle, buttonGridStyle, colors, SANS } from '../styles'
import { getOtpState, getOtpExpiryRemainingMs, devRegenerateOtp } from '../../services/VerificationService'
import type { OtpChannel, OtpRecord } from '../../services/VerificationService'

function formatClock(ms: number) {
  if (ms <= 0) return 'Expired'
  const totalSeconds = Math.ceil(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString()
}

function ChannelBlock({ channel, label }: { channel: OtpChannel; label: string }) {
  const [record, setRecord] = useState<OtpRecord | null>(null)
  const [remainingMs, setRemainingMs] = useState(0)
  const [copied, setCopied] = useState(false)

  // Uygulamanın HERHANGİ bir yerinde (OtpStep) yeni bir OTP üretildiğinde bu
  // panel otomatik güncellensin diye - context yerine 1sn'lik polling
  // (LiveJourneyState/TimeMachine bölümleriyle aynı, zaten kanıtlanmış desen).
  useEffect(() => {
    const tick = () => {
      setRecord(getOtpState(channel))
      setRemainingMs(getOtpExpiryRemainingMs(channel))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [channel])

  const handleCopy = async () => {
    if (!record) return
    try {
      await navigator.clipboard.writeText(record.devCode ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // panoya erişim yoksa sessizce geç - sadece dev kolaylığı
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '1px', color: colors.muted, textTransform: 'uppercase' }}>
        {label}
      </div>
      <Row label="Current OTP" value={record?.devCode ?? '—'} />
      <Row label="Generated Time" value={record ? formatTime(record.generatedAt) : '—'} />
      <Row label="Expiration Countdown" value={record ? formatClock(remainingMs) : '—'} />
      <div style={buttonGridStyle}>
        <button style={buttonStyle()} onClick={handleCopy} disabled={!record?.devCode}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button style={buttonStyle('primary')} onClick={() => devRegenerateOtp(channel)}>
          Regenerate
        </button>
      </div>
    </div>
  )
}

// Phone + Email OTP doğrulaması için dev-only görünürlük (bkz.
// services/VerificationService.ts) - gerçek bir SMS/e-posta sağlayıcısı
// bağlanmadığı için, test edebilmenin TEK yolu burası. DevPanel zaten
// isDev + visible ile korunuyor, bu bölüm ekstra bir kontrol eklemiyor.
export default function VerificationSection() {
  return (
    <SectionCard title="Verification">
      <ChannelBlock channel="phone" label="Phone" />
      <div style={{ height: '1px', background: colors.divider }} />
      <ChannelBlock channel="email" label="Email" />
    </SectionCard>
  )
}
