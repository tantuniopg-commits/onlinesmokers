// VELIS'in TEK tipografi sistemi - Journey, Leaderboard, Profile, Settings,
// Ritual, Authentication, Developer Panel ve tüm Completion ekranları BUNU
// kullanıyor. Editoryal/dergi hissi veren serif başlıklar tamamen
// kaldırıldı - Apple Health/Journal/Fitness gibi tek, sakin bir sans-serif
// ölçek var artık. Sadece tipografi değişti; hiçbir ekranın layout'u,
// boşlukları ya da renkleri bu dosya yüzünden değişmedi.

export const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif'

// 7 katmanlı ölçek - spesifikasyondaki birebir değerler.
export const type = {
  displayTitle: { fontFamily: FONT_SANS, fontWeight: 700, fontSize: '32px' },
  pageTitle: { fontFamily: FONT_SANS, fontWeight: 600, fontSize: '26px' },
  sectionTitle: { fontFamily: FONT_SANS, fontWeight: 600, fontSize: '18px' },
  body: { fontFamily: FONT_SANS, fontWeight: 400, fontSize: '16px' },
  secondary: { fontFamily: FONT_SANS, fontWeight: 400, fontSize: '14px' },
  caption: { fontFamily: FONT_SANS, fontWeight: 500, fontSize: '12px' },
  smallLabel: { fontFamily: FONT_SANS, fontWeight: 600, fontSize: '11px' },
  // Butonlar ve kart başlıkları için ayrı, isimli belirteçler.
  button: { fontFamily: FONT_SANS, fontWeight: 600, fontSize: '16px' },
  cardTitle: { fontFamily: FONT_SANS, fontWeight: 600, fontSize: '18px' },
} as const

// Metin renkleri - amber SADECE vurgu gereken yerde, aşırı kullanılmıyor.
export const textColor = {
  primary: '#F5F0EA',
  secondary: '#9A948C',
  accent: '#E3C08C',
} as const
