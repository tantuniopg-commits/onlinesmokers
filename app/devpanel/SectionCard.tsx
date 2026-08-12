'use client'

import type { ReactNode } from 'react'
import { sectionTitleStyle, cardStyle, colors } from './styles'

// Panelin 12 bölümünün her biri bu ortak kabuğu kullanıyor - "modüler"
// yapı burada somutlaşıyor: her bölüm kendi dosyasında, kendi state'iyle,
// sadece bu sarmalayıcıyı ve gerektiğinde lib/ servislerini kullanıyor.
export default function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <div style={cardStyle}>{children}</div>
      <div style={{ height: '1px', background: colors.divider, marginTop: '4px' }} />
    </div>
  )
}

export function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ fontFamily: '"SF Pro Text", sans-serif', fontSize: '13px', color: colors.muted }}>{label}</span>
      <span style={{ fontFamily: '"SF Pro Display", sans-serif', fontWeight: 600, fontSize: '14px', color: colors.white, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )
}
