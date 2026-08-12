'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// GuideOverlay'in "spotlight" deliğini konumlandırmak için - hedef
// elementin ekran koordinatlarını ölçüyor, resize/scroll'da güncelliyor.
export default function useTargetRect(ref: RefObject<HTMLElement | null>, active: boolean) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!active) return
    const measure = () => setRect(ref.current?.getBoundingClientRect() ?? null)
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    const t = setInterval(measure, 300)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      clearInterval(t)
    }
  }, [ref, active])

  return rect
}
