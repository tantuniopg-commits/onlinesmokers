// Çemberin bir noktası (0deg=sağ, 90deg=aşağı, 180deg=sol, 270deg=yukarı -
// SVG'nin y-aşağı eksenine göre). Sunucu/istemci arasında son ondalık
// basamakta oluşabilecek trig farkının hydration mismatch'e yol açmaması
// için 3 basamağa yuvarlanıyor.
export function circlePoint(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: Math.round(r * Math.cos(a) * 1000) / 1000, y: Math.round(r * Math.sin(a) * 1000) / 1000 }
}

// fromDeg noktasından toDeg noktasına, her zaman kısa yoldan (<=180deg)
// bir yay çiziyor. Path'in "M" (başlangıç) noktası her zaman fromDeg -
// bu, stroke-dasharray ile "çizilme" animasyonunun nereden başlayacağını
// belirlediği için önemli.
export function describeArcSegment(r: number, fromDeg: number, toDeg: number) {
  const start = circlePoint(r, fromDeg)
  const end = circlePoint(r, toDeg)
  const sweep = toDeg > fromDeg ? 1 : 0
  const diff = Math.abs(toDeg - fromDeg)
  const largeArcFlag = diff <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweep} ${end.x} ${end.y}`
}
