'use client'

import { useState } from 'react'

const devices = [
  { id: 'classic', name: 'Classic', desc: 'The original' },
  { id: 'iqos', name: 'IQOS', desc: 'Heat, not burn' },
  { id: 'puff', name: 'Puff', desc: 'Cloud culture' },
  { id: 'hookah', name: 'Hookah', desc: 'Slow & social' },
]

function ClassicCig({ inhaling }: { inhaling: boolean }) {
  return (
    <svg width="260" height="80" viewBox="0 0 260 80">
      <defs>
        <linearGradient id="cigWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f0ede8" />
          <stop offset="100%" stopColor="#ddd8d0" />
        </linearGradient>
        <linearGradient id="cigFilter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b87a" />
          <stop offset="50%" stopColor="#c8903a" />
          <stop offset="100%" stopColor="#a87020" />
        </linearGradient>
        <linearGradient id="cigTip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8040" />
          <stop offset="100%" stopColor="#cc4400" />
        </linearGradient>
        <linearGradient id="cigShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Gövde gölgesi */}
      <ellipse cx="155" cy="68" rx="90" ry="6" fill="#00000015" />
      {/* Sigara ana gövde - yatay */}
      <rect x="10" y="28" width="185" height="24" rx="12" fill="url(#cigWhite)" />
      {/* Üst parlaklık */}
      <rect x="14" y="30" width="177" height="8" rx="6" fill="url(#cigShadow)" />
      {/* Filtre */}
      <rect x="193" y="28" width="52" height="24" rx="12" fill="url(#cigFilter)" />
      {/* Filtre çizgileri */}
      <line x1="205" y1="30" x2="205" y2="50" stroke="#b87030" strokeWidth="0.5" opacity="0.4" />
      <line x1="215" y1="30" x2="215" y2="50" stroke="#b87030" strokeWidth="0.5" opacity="0.4" />
      <line x1="225" y1="30" x2="225" y2="50" stroke="#b87030" strokeWidth="0.5" opacity="0.4" />
      <line x1="235" y1="30" x2="235" y2="50" stroke="#b87030" strokeWidth="0.5" opacity="0.4" />
      {/* Filtre parlaklık */}
      <rect x="196" y="30" width="46" height="8" rx="4" fill="white" opacity="0.2" />
      {/* Kor ucu */}
      <ellipse cx="12" cy="40" rx="8" ry="12" fill={inhaling ? '#ff6b35' : '#cc4400'} />
      <ellipse cx="12" cy="40" rx="5" ry="8" fill={inhaling ? '#ffaa60' : '#ee7722'} />
      {/* Duman */}
      {inhaling && (
        <>
          <ellipse cx="6" cy="30" rx="5" ry="8" fill="#aaa" opacity="0.2" />
          <ellipse cx="2" cy="18" rx="6" ry="7" fill="#aaa" opacity="0.13" />
          <ellipse cx="8" cy="8" rx="5" ry="6" fill="#aaa" opacity="0.08" />
        </>
      )}
    </svg>
  )
}

function IQOSDevice({ inhaling }: { inhaling: boolean }) {
  return (
    <svg width="120" height="260" viewBox="0 0 120 260">
      <defs>
        <linearGradient id="iqosMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8cfd8" />
          <stop offset="30%" stopColor="#e8f4f8" />
          <stop offset="60%" stopColor="#d0e8f0" />
          <stop offset="100%" stopColor="#a0bcc8" />
        </linearGradient>
        <linearGradient id="iqosScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2a" />
          <stop offset="100%" stopColor="#0a0a1a" />
        </linearGradient>
        <linearGradient id="iqosStick" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d8d0c0" />
          <stop offset="40%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#c8c0b0" />
        </linearGradient>
      </defs>
      {/* Gölge */}
      <ellipse cx="60" cy="255" rx="30" ry="5" fill="#00000015" />
      {/* Ana cihaz gövdesi - silindir */}
      <rect x="30" y="80" width="60" height="165" rx="30" fill="url(#iqosMetal)" />
      {/* Sol kenar koyu */}
      <rect x="30" y="90" width="10" height="145" rx="5" fill="#8090a0" opacity="0.4" />
      {/* Sağ kenar koyu */}
      <rect x="80" y="90" width="10" height="145" rx="5" fill="#a0b8c8" opacity="0.3" />
      {/* Orta parlaklık şeridi */}
      <rect x="50" y="85" width="20" height="155" rx="10" fill="white" opacity="0.2" />
      {/* Ekran paneli */}
      <rect x="38" y="110" width="44" height="50" rx="8" fill="url(#iqosScreen)" />
      {/* Ekran çerçevesi */}
      <rect x="37" y="109" width="46" height="52" rx="9" fill="none" stroke="#c0d8e8" strokeWidth="1" opacity="0.6" />
      {/* Ekran iç ışıklar - 4 nokta */}
      <circle cx="48" cy="132" r="4" fill="none" stroke={inhaling ? '#60d0ff' : '#406080'} strokeWidth="1.5" />
      <circle cx="60" cy="132" r="4" fill="none" stroke={inhaling ? '#60d0ff' : '#406080'} strokeWidth="1.5" />
      <circle cx="72" cy="132" r="4" fill="none" stroke={inhaling ? '#60d0ff' : '#406080'} strokeWidth="1.5" />
      <circle cx="48" cy="144" r="4" fill="none" stroke={inhaling ? '#60d0ff' : '#406080'} strokeWidth="1.5" />
      {/* Alt düğme */}
      <rect x="45" y="195" width="30" height="10" rx="5" fill="#90b0c0" opacity="0.6" />
      {/* Stik - üstte ince beyaz çubuk */}
      <rect x="44" y="20" width="32" height="62" rx="16" fill="url(#iqosStick)" />
      {/* Stik parlaklık */}
      <rect x="48" y="24" width="8" height="54" rx="4" fill="white" opacity="0.3" />
      {/* Stik ucu */}
      <ellipse cx="60" cy="20" rx="16" ry="7" fill={inhaling ? '#ff9060' : '#d0a870'} />
      {/* Duman */}
      {inhaling && (
        <>
          <ellipse cx="60" cy="10" rx="8" ry="7" fill="#ccc" opacity="0.2" />
          <ellipse cx="55" cy="1" rx="6" ry="6" fill="#ccc" opacity="0.12" />
          <ellipse cx="65" cy="-5" rx="5" ry="5" fill="#ccc" opacity="0.08" />
        </>
      )}
    </svg>
  )
}

function PuffDevice({ inhaling }: { inhaling: boolean }) {
  return (
    <svg width="130" height="240" viewBox="0 0 130 240">
      <defs>
        <linearGradient id="puffBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="30%" stopColor="#2a2a2a" />
          <stop offset="70%" stopColor="#222222" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <linearGradient id="puffCap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a1a9a" />
          <stop offset="50%" stopColor="#8b2fd4" />
          <stop offset="100%" stopColor="#6a20b0" />
        </linearGradient>
        <linearGradient id="puffStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a2ac4" />
          <stop offset="50%" stopColor="#b060ff" />
          <stop offset="100%" stopColor="#8a30d4" />
        </linearGradient>
      </defs>
      {/* Gölge */}
      <ellipse cx="65" cy="235" rx="35" ry="5" fill="#00000020" />
      {/* Ana gövde - köşeli dikdörtgen */}
      <rect x="18" y="50" width="94" height="172" rx="18" fill="url(#puffBody)" />
      {/* Speckle desen */}
      <circle cx="35" cy="80" r="1.5" fill="white" opacity="0.15" />
      <circle cx="90" cy="95" r="1" fill="white" opacity="0.12" />
      <circle cx="50" cy="150" r="1.5" fill="white" opacity="0.1" />
      <circle cx="85" cy="170" r="1" fill="white" opacity="0.13" />
      <circle cx="40" cy="200" r="1.5" fill="white" opacity="0.1" />
      <circle cx="95" cy="130" r="1" fill="white" opacity="0.12" />
      <circle cx="60" cy="110" r="1" fill="white" opacity="0.08" />
      <circle cx="75" cy="190" r="1.5" fill="white" opacity="0.1" />
      {/* Mor çizgiler diagonal */}
      <line x1="30" y1="75" x2="70" y2="115" stroke="url(#puffStripe)" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <line x1="44" y1="75" x2="84" y2="115" stroke="url(#puffStripe)" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <line x1="58" y1="75" x2="98" y2="115" stroke="url(#puffStripe)" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
      <line x1="72" y1="75" x2="108" y2="112" stroke="url(#puffStripe)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <line x1="20" y1="88" x2="56" y2="124" stroke="url(#puffStripe)" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
      {/* Sol mor daire */}
      <circle cx="28" cy="140" r="6" fill="#8b2fd4" opacity="0.7" />
      {/* Sağ mor daire */}
      <circle cx="102" cy="165" r="5" fill="#8b2fd4" opacity="0.6" />
      {/* Mor kapak - üst */}
      <rect x="18" y="20" width="94" height="34" rx="18" fill="url(#puffCap)" />
      <rect x="22" y="24" width="30" height="26" rx="10" fill="white" opacity="0.1" />
      {/* Kapak vidası */}
      <ellipse cx="65" cy="20" rx="20" ry="6" fill="#6a20b0" />
      {/* Askı halkası */}
      <path d="M95 30 Q110 30 110 20 Q110 10 100 10" stroke="#8b2fd4" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ağızlık - alt */}
      <rect x="35" y="218" width="60" height="14" rx="7" fill="#333" />
      <rect x="42" y="221" width="20" height="8" rx="4" fill="#444" opacity="0.6" />
      {/* Duman */}
      {inhaling && (
        <>
          <ellipse cx="65" cy="12" rx="14" ry="10" fill="#d8b4fe" opacity="0.3" />
          <ellipse cx="55" cy="1" rx="10" ry="9" fill="#d8b4fe" opacity="0.2" />
          <ellipse cx="76" cy="-3" rx="9" ry="8" fill="#d8b4fe" opacity="0.15" />
        </>
      )}
    </svg>
  )
}

function HookahDevice({ inhaling }: { inhaling: boolean }) {
  return (
    <svg width="160" height="280" viewBox="0 0 160 280">
      <defs>
        <linearGradient id="hookahGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d0e8f8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f0f8ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c0d8f0" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="hookahMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="40%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="hookahWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f0ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#b0d8f8" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Gölge */}
      <ellipse cx="80" cy="274" rx="40" ry="6" fill="#00000015" />
      {/* Cam hazne - elmas desen şeklinde */}
      <path d="M50 175 Q35 200 40 230 Q45 255 80 265 Q115 255 120 230 Q125 200 110 175 Z" fill="url(#hookahGlass)" stroke="#c0d8f0" strokeWidth="1" />
      {/* Elmas desen çizgileri */}
      <line x1="50" y1="190" x2="110" y2="190" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.5" />
      <line x1="46" y1="205" x2="114" y2="205" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.5" />
      <line x1="44" y1="220" x2="116" y2="220" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.5" />
      <line x1="47" y1="235" x2="113" y2="235" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.5" />
      <line x1="55" y1="178" x2="55" y2="260" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.4" />
      <line x1="68" y1="175" x2="68" y2="264" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.4" />
      <line x1="80" y1="174" x2="80" y2="265" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.4" />
      <line x1="92" y1="175" x2="92" y2="264" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.4" />
      <line x1="105" y1="178" x2="105" y2="260" stroke="#b0c8e0" strokeWidth="0.5" opacity="0.4" />
      {/* Su */}
      <path d="M52 220 Q38 232 42 248 Q47 262 80 268 Q113 262 118 248 Q122 232 108 220 Z" fill="url(#hookahWater)" />
      {/* Cam parlaklık */}
      <ellipse cx="58" cy="205" rx="6" ry="20" fill="white" opacity="0.2" />
      {/* Bağlantı parçası */}
      <rect x="62" y="158" width="36" height="20" rx="6" fill="url(#hookahMetal)" />
      <ellipse cx="80" cy="158" rx="18" ry="6" fill="#3a3a3a" />
      {/* Hortum bağlantısı */}
      <circle cx="52" cy="168" r="6" fill="#2a2a2a" stroke="#4a4a4a" strokeWidth="1" />
      {/* Ana boru */}
      <rect x="74" y="60" width="12" height="100" rx="6" fill="url(#hookahMetal)" />
      <rect x="76" y="62" width="4" height="96" rx="2" fill="#5a5a5a" opacity="0.4" />
      {/* Boru eklentileri */}
      <rect x="72" y="110" width="16" height="8" rx="4" fill="#3a3a3a" />
      <rect x="72" y="130" width="16" height="8" rx="4" fill="#3a3a3a" />
      {/* Kase bağlantısı */}
      <rect x="70" y="40" width="20" height="22" rx="6" fill="url(#hookahMetal)" />
      {/* Kase */}
      <ellipse cx="80" cy="35" rx="28" ry="12" fill="#2a2a2a" stroke="#4a4a4a" strokeWidth="1" />
      <ellipse cx="80" cy="32" rx="22" ry="9" fill="#1a1a1a" />
      <ellipse cx="80" cy="30" rx="16" ry="6" fill={inhaling ? '#ff6030' : '#2a1a10'} />
      {/* Kor */}
      <ellipse cx="80" cy="28" rx="12" ry="4" fill={inhaling ? '#ffaa40' : '#4a2010'} opacity="0.8" />
      {/* Kase tepsi */}
      <ellipse cx="80" cy="22" rx="32" ry="8" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="1" />
      {/* Hortum */}
      <path d="M52 168 Q20 160 10 180 Q0 200 15 220 Q25 235 30 250" stroke="#1a1a1a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M52 168 Q20 160 10 180 Q0 200 15 220 Q25 235 30 250" stroke="#3a3a3a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Hortum ağızlığı */}
      <ellipse cx="30" cy="252" rx="10" ry="5" fill="#2a2a2a" stroke="#4a4a4a" strokeWidth="1" />
      <rect x="24" y="252" width="12" height="16" rx="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.5" />
      {/* Duman */}
      {inhaling && (
        <>
          <ellipse cx="80" cy="14" rx="12" ry="9" fill="#9ca3af" opacity="0.2" />
          <ellipse cx="73" cy="4" rx="9" ry="8" fill="#9ca3af" opacity="0.13" />
          <ellipse cx="88" cy="-2" rx="8" ry="7" fill="#9ca3af" opacity="0.1" />
        </>
      )}
    </svg>
  )
}

export default function Simulate() {
  const [selected, setSelected] = useState('classic')
  const [puffs, setPuffs] = useState(0)
  const [inhaling, setInhaling] = useState(false)

  const handlePuff = () => {
    setInhaling(true)
    setTimeout(() => setInhaling(false), 1800)
    setPuffs(p => p + 1)
  }

  const renderDevice = () => {
    switch (selected) {
      case 'classic': return <ClassicCig inhaling={inhaling} />
      case 'iqos': return <IQOSDevice inhaling={inhaling} />
      case 'puff': return <PuffDevice inhaling={inhaling} />
      case 'hookah': return <HookahDevice inhaling={inhaling} />
    }
  }

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-sm tracking-widest text-gray-400">ONLINESMOKERS</h1>

      <div className="flex gap-3 flex-wrap justify-center">
        {devices.map(d => (
          <button
            key={d.id}
            onClick={() => { setSelected(d.id); setInhaling(false) }}
            className={`px-5 py-2 text-xs tracking-widest border transition-all duration-300 ${
              selected === d.id
                ? 'border-black text-black'
                : 'border-gray-200 text-gray-400 hover:border-gray-400'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className={`transition-all duration-700 flex items-center justify-center ${inhaling ? 'scale-105' : 'scale-100'}`} style={{ minHeight: '280px' }}>
        {renderDevice()}
      </div>

      <button
        onClick={handlePuff}
        className="border border-black px-16 py-4 text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300"
      >
        PUFF
      </button>

      <p className="text-gray-400 text-xs tracking-widest">{puffs} puffs today</p>
    </main>
  )
}