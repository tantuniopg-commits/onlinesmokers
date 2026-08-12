// Developer Panel'in tüm bölümlerinin paylaştığı ortak stil belirteçleri -
// VELIS'in geri kalanıyla aynı dil (siyah zemin, amber vurgu, yuvarlak
// kartlar, ince bölücüler) ama bir "Apple internal debug panel" gibi
// kompakt/yardımcı-programsı bir yoğunlukla.

import type { CSSProperties } from 'react'

export const SANS = '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
export const SANS_DISPLAY = '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'

export const colors = {
  background: '#000000',
  card: 'rgba(255, 255, 255, 0.03)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  divider: 'rgba(255, 178, 90, 0.18)',
  white: '#F5F0EA',
  muted: '#8F8A83',
  amber: '#E3C08C',
  amberBright: '#F3CE8E',
  danger: '#E39C8C',
}

export const sectionTitleStyle: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
  color: colors.amber,
  margin: 0,
}

export const cardStyle: CSSProperties = {
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: '18px',
  background: colors.card,
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
}

export const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
}

export const rowLabelStyle: CSSProperties = {
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: '13px',
  color: colors.muted,
}

export const rowValueStyle: CSSProperties = {
  fontFamily: SANS_DISPLAY,
  fontWeight: 600,
  fontSize: '14px',
  color: colors.white,
  textAlign: 'right' as const,
}

export function buttonStyle(variant: 'default' | 'primary' | 'danger' = 'default'): CSSProperties {
  const base: CSSProperties = {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.2px',
    padding: '9px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: colors.white,
  }
  if (variant === 'primary') {
    return { ...base, border: '1px solid rgba(255, 178, 90, 0.45)', background: 'rgba(255, 178, 90, 0.08)', color: colors.amber }
  }
  if (variant === 'danger') {
    return { ...base, border: '1px solid rgba(227, 156, 140, 0.4)', background: 'rgba(227, 156, 140, 0.06)', color: colors.danger }
  }
  return base
}

export const inputStyle: CSSProperties = {
  padding: '9px 12px',
  borderRadius: '9px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  background: 'rgba(255, 255, 255, 0.03)',
  color: colors.white,
  fontFamily: SANS,
  fontSize: '13px',
  outline: 'none',
}

export const buttonGridStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
}
