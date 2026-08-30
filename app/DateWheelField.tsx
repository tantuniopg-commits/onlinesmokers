'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { FONT_SANS } from './lib/typography'
import { useLocale } from './contexts/LocaleContext'

// Doğum tarihi alanı - native <input type="date">'in beyaz/sistem takvimi
// yerine VELIS temalı bir bottom-sheet + 3 tekerlek (gün / ay / yıl).
// Gender SelectField'iyle ayni görsel dil (koyu zemin, amber vurgu).
// Değer formatı dışarıya HER ZAMAN 'YYYY-MM-DD' (mevcut doğrulama bunu
// bekliyor, bkz. validateSignupForm birthDateValid).

const ITEM_H = 40
const VISIBLE = 5 // tek sayı - ortada net bir seçili satır

type WheelProps = {
  items: { value: number; label: string }[]
  value: number | null
  onChange: (v: number) => void
  ariaLabel: string
}

function Wheel({ items, value, onChange, ariaLabel }: WheelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pad = (VISIBLE - 1) / 2

  // Seçili değere kaydır (ilk açılışta ve dışarıdan değişince).
  useEffect(() => {
    const el = ref.current
    if (!el || value == null) return
    const idx = items.findIndex((it) => it.value === value)
    if (idx < 0) return
    el.scrollTop = idx * ITEM_H
  }, [value, items])

  const handleScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const el = ref.current
      if (!el) return
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)))
      el.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' })
      const next = items[idx]?.value
      if (next != null && next !== value) onChange(next)
    }, 90)
  }

  return (
    <div style={{ position: 'relative', flex: 1, height: `${ITEM_H * VISIBLE}px`, overflow: 'hidden' }}>
      {/* Ortadaki seçim bandı */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: `${ITEM_H * pad}px`,
          left: 4,
          right: 4,
          height: `${ITEM_H}px`,
          borderRadius: '10px',
          background: 'rgba(255, 178, 90, 0.1)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={ref}
        role="listbox"
        aria-label={ariaLabel}
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ height: `${ITEM_H * pad}px` }} />
        {items.map((it) => {
          const selected = it.value === value
          return (
            <div
              key={it.value}
              onClick={() => onChange(it.value)}
              style={{
                height: `${ITEM_H}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                fontFamily: FONT_SANS,
                fontSize: selected ? '18px' : '16px',
                fontWeight: selected ? 600 : 400,
                color: selected ? '#F3CE8E' : 'rgba(245, 240, 234, 0.5)',
                cursor: 'pointer',
                transition: 'color 150ms ease-out, font-size 150ms ease-out',
              }}
            >
              {it.label}
            </div>
          )
        })}
        <div style={{ height: `${ITEM_H * pad}px` }} />
      </div>
    </div>
  )
}

function daysInMonth(year: number, month1: number) {
  return new Date(year, month1, 0).getDate()
}

export default function DateWheelField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  triggerRef,
  error,
}: {
  label: string
  value: string // 'YYYY-MM-DD' | ''
  onChange: (value: string) => void
  onBlur: () => void
  placeholder: string
  triggerRef?: RefObject<HTMLButtonElement | null>
  error?: string | null
}) {
  const { locale } = useLocale()
  const [open, setOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  // Makul aralık: 13-100 yaş.
  const minYear = currentYear - 100
  const maxYear = currentYear - 13

  const parsed = useMemo(() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!m) return null
    return { y: Number(m[1]), mo: Number(m[2]), d: Number(m[3]) }
  }, [value])

  const [y, setY] = useState<number>(parsed?.y ?? maxYear - 5)
  const [mo, setMo] = useState<number>(parsed?.mo ?? 1)
  const [d, setD] = useState<number>(parsed?.d ?? 1)

  useEffect(() => {
    if (parsed) {
      setY(parsed.y)
      setMo(parsed.mo)
      setD(parsed.d)
    }
  }, [parsed])

  const monthNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' })
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2020, i, 1)))
  }, [locale])

  const dayCount = daysInMonth(y, mo)
  const clampedDay = Math.min(d, dayCount)

  const commit = (ny: number, nmo: number, nd: number) => {
    const dc = daysInMonth(ny, nmo)
    const day = Math.min(nd, dc)
    onChange(`${ny}-${String(nmo).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  }

  const close = () => {
    setOpen(false)
    onBlur()
  }

  const displayText = parsed
    ? new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(parsed.y, parsed.mo - 1, parsed.d)
      )
    : null

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({ value: maxYear - i, label: String(maxYear - i) }))
  const months = monthNames.map((name, i) => ({ value: i + 1, label: name }))
  const days = Array.from({ length: dayCount }, (_, i) => ({ value: i + 1, label: String(i + 1) }))

  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontFamily: FONT_SANS, fontWeight: 500, fontSize: '12px', color: '#9A948C', marginBottom: '8px' }}>
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          // Sheet ilk açılışında geçerli bir tarih yoksa makul bir başlangıç
          // seç ama HENÜZ commit etme - kullanıcı tekerleği çevirince yazılır.
          setOpen(true)
        }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '13px 16px',
          borderRadius: '14px',
          border: error ? '1px solid rgba(255, 130, 100, 0.5)' : open ? '1px solid rgba(255, 178, 90, 0.55)' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: open && !error ? '0 0 0 3px rgba(255, 178, 90, 0.1)' : 'none',
          background: 'rgba(255, 255, 255, 0.03)',
          color: displayText ? '#F5F0EA' : 'rgba(245, 240, 234, 0.4)',
          fontFamily: FONT_SANS,
          fontWeight: 400,
          fontSize: '16px',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          transition: 'border 200ms ease-out, box-shadow 200ms ease-out',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayText ?? placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="#9A948C" strokeWidth="1.7" />
          <path d="M3.5 9.5H20.5M8 3.5V6.5M16 3.5V6.5" stroke="#9A948C" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>

      <div
        style={{
          marginTop: error ? '6px' : 0,
          maxHeight: error ? '20px' : 0,
          overflow: 'hidden',
          opacity: error ? 1 : 0,
          transition: 'opacity 250ms ease-in-out, max-height 250ms ease-in-out, margin-top 250ms ease-in-out',
        }}
      >
        <div style={{ fontFamily: FONT_SANS, fontSize: '12px', color: 'rgba(255, 150, 120, 0.85)' }}>{error}</div>
      </div>

      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.55)',
          }}
        >
          <div
            className="velis-sheet--slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#0B0B0B',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderBottom: 'none',
              boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.5)',
              padding: '10px 16px calc(18px + env(safe-area-inset-bottom))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <div style={{ width: '36px', height: '5px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.2)', margin: '8px auto 14px' }} />
            <div
              style={{
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#9A948C',
                textAlign: 'center',
                padding: '0 8px 10px',
              }}
            >
              {label}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <Wheel
                items={days}
                value={clampedDay}
                ariaLabel="Day"
                onChange={(v) => {
                  setD(v)
                  commit(y, mo, v)
                }}
              />
              <Wheel
                items={months}
                value={mo}
                ariaLabel="Month"
                onChange={(v) => {
                  setMo(v)
                  commit(y, v, clampedDay)
                }}
              />
              <Wheel
                items={years}
                value={y}
                ariaLabel="Year"
                onChange={(v) => {
                  setY(v)
                  commit(v, mo, clampedDay)
                }}
              />
            </div>

            <button
              type="button"
              className="velis-primary-btn"
              onClick={() => {
                commit(y, mo, clampedDay)
                close()
              }}
              style={{
                marginTop: '18px',
                width: '100%',
                padding: '15px 0',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(180deg, #F3CE8E 0%, #D9A254 100%)',
                color: '#171410',
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {locale === 'tr' ? 'Tamam' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
