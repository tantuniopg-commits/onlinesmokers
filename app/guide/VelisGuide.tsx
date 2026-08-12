'use client'

// <VelisGuide /> - "the spirit of VELIS itself", NOT a mascot. A minimal
// amber stick figure: thin warm-amber line limbs, head = the same glowing
// amber-core language as the ritual object's bead. No face, no mouth, no
// eyes - glow and motion carry all the emotion. Idle: gentle breathing
// (92% -> 100% -> 92%, 3s loop) + a very small float. `pointing` raises the
// (single-segment) right arm to point at something; `reaching` bends it at
// the elbow instead - a softer, flexible lift toward a speech bubble sitting
// above the guide's right shoulder (viewer's right).
export default function VelisGuide({
  pointing = false,
  reaching = false,
  speaking = false,
  opacity = 1,
  size = 50,
}: {
  pointing?: boolean
  reaching?: boolean
  // Konuşma metni yazılırken kafa hafifçe parlaklaşıyor, bitince yumuşakça
  // eski haline dönüyor - poz/oran/renk DEĞİŞMİYOR, sadece glow yoğunluğu.
  speaking?: boolean
  // Mesaj bitince ~%70'e iniyor - odak objeye dönüyor, rehber sessizce yanda
  // kalıyor (poz/renk/oran değişmiyor, sadece opaklık).
  opacity?: number
  size?: number
}) {
  const stroke = 'rgba(216, 174, 108, 0.85)'
  return (
    <div
      className="guide-breathe guide-float"
      style={{
        width: `${size}px`,
        height: `${size * 1.9}px`,
        opacity,
        filter: speaking
          ? 'drop-shadow(0 0 15px rgba(216, 174, 108, 0.55))'
          : 'drop-shadow(0 0 10px rgba(216, 174, 108, 0.35))',
        transition: 'filter 400ms ease-in-out, opacity 500ms ease-in-out',
      }}
    >
      <svg viewBox="0 0 60 120" width="100%" height="100%" fill="none">
        {/* Head - existing amber core language (radial glow, no face) */}
        <circle cx="30" cy="15" r="9" fill="url(#velisGuideCoreGradient)" />
        <circle cx="30" cy="15" r="9" fill="none" />
        {/* Body */}
        <line x1="30" y1="24" x2="30" y2="72" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* Left arm - always resting */}
        <line x1="30" y1="38" x2="15" y2="58" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        {/* Right arm - reaching: bent at the elbow, softly raised toward a
            bubble up-right. pointing: rotates straight out. Otherwise rest. */}
        {reaching ? (
          <g style={{ transition: 'transform 400ms ease-in-out' }}>
            <line x1="30" y1="38" x2="43" y2="33" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
            <line x1="43" y1="33" x2="51" y2="21" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ) : (
          <g
            style={{
              transformOrigin: '30px 38px',
              transform: pointing ? 'rotate(-95deg)' : 'rotate(0deg)',
              transition: 'transform 400ms ease-in-out',
            }}
          >
            <line x1="30" y1="38" x2="45" y2="58" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}
        {/* Legs */}
        <line x1="30" y1="72" x2="18" y2="112" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="30" y1="72" x2="42" y2="112" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <radialGradient id="velisGuideCoreGradient" cx="0.35" cy="0.3" r="0.75">
            <stop offset="0%" stopColor="#FFF3D9" />
            <stop offset="30%" stopColor="#FFD9A0" />
            <stop offset="55%" stopColor="#FFB347" />
            <stop offset="82%" stopColor="#F08A24" />
            <stop offset="100%" stopColor="#D9701A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
