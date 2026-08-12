'use client'

import { describeArcSegment } from './utils/geometry'

// Küçültülmüş, statik VELIS işareti - Journey/Profile akışındaki üst
// başlıklarda tekrar kullanılıyor (aynı halka-nesne geometrisi).

const RING_R = 26
const RING_GAP_HALF_DEG = 6
const OBJECT_WIDTH = 3.5
const OBJECT_HEIGHT = 64
const CORE_SIZE = 5

const topRightD = describeArcSegment(RING_R, 270 + RING_GAP_HALF_DEG, 360)
const bottomRightD = describeArcSegment(RING_R, 90 - RING_GAP_HALF_DEG, 0)
const topLeftD = describeArcSegment(RING_R, 270 - RING_GAP_HALF_DEG, 180)
const bottomLeftD = describeArcSegment(RING_R, 90 + RING_GAP_HALF_DEG, 180)

const ringPathStyle = {
  fill: 'none',
  stroke: '#F6F2EB',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
}

export default function VelisMark() {
  return (
    <div style={{ position: 'relative', width: `${OBJECT_WIDTH}px`, height: `${OBJECT_HEIGHT}px` }}>
      <svg
        viewBox="-32 -39 64 78"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '64px',
          height: '78px',
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 0 4px rgba(255, 178, 90, 0.26)) drop-shadow(0 0 7px rgba(255, 178, 90, 0.13))',
        }}
      >
        <path d={topRightD} style={ringPathStyle} />
        <path d={bottomRightD} style={ringPathStyle} />
        <path d={topLeftD} style={ringPathStyle} />
        <path d={bottomLeftD} style={ringPathStyle} />
      </svg>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          borderRadius: '999px',
          background: 'linear-gradient(90deg, #DAD5CE 0%, #F1EEE9 20%, #ECE8E3 50%, #F1EEE9 80%, #DAD5CE 100%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${CORE_SIZE}px`,
          height: `${CORE_SIZE}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #FFD9A0 0%, #FFB347 40%, #F08A24 75%, #D9701A 100%)',
          boxShadow: '0 0 4px 1px rgba(255, 178, 90, 0.35), 0 0 8px 2px rgba(240, 138, 36, 0.15)',
        }}
      />
    </div>
  )
}
