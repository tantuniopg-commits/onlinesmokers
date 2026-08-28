'use client'

// Gün 7 (ve 7'nin her katı) ödül rozeti - VELIS amber temasına uygun,
// çerçeveli hediye ikonu (bkz. app/journey/page.tsx DayCard,
// app/reward/page.tsx). Ödül artık tek seferlik +500 XP - herhangi bir
// ortaklık/marka yok.
export default function RewardBadge({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'rgba(255, 178, 90, 0.06)',
        border: '1px solid rgba(216, 174, 108, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 0 10px 1px rgba(216, 174, 108, 0.25)',
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="9" width="16" height="11" rx="1.2" stroke="#E3C08C" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M4 9h16v3.5H4V9Z" stroke="#E3C08C" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 9v11" stroke="#E3C08C" strokeWidth="1.6" />
        <path
          d="M12 9c0-2.2-1.6-4-3.5-4C7.1 5 6 6 6 7.2 6 8.4 7 9 8.5 9H12Z"
          stroke="#E3C08C"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9c0-2.2 1.6-4 3.5-4C16.9 5 18 6 18 7.2 18 8.4 17 9 15.5 9H12Z"
          stroke="#E3C08C"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
