// Admin İçerik Modu (bkz. app/admin/journey-content) için yerel geçersiz
// kılma katmanı. Gerçek bir backend/CMS olmadığı için düzenlemeler
// tarayıcıya kalıcılaşıyor. İleride bu dosya bir API çağrısıyla
// değiştirildiğinde, getJourneyDayContent() dahil onu çağıran hiçbir kod
// değişmek zorunda kalmayacak - tek temas noktası burası.

export type JourneyContentOverride = {
  title?: string
  subtitle?: string
  quote?: string
  xp?: number
}

const OVERRIDES_KEY = 'velis_admin_content_overrides'

function readAll(): Record<number, JourneyContentOverride> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(all: Record<number, JourneyContentOverride>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all))
}

export function getOverride(day: number): JourneyContentOverride | null {
  return readAll()[day] ?? null
}

export function getAllOverrides(): Record<number, JourneyContentOverride> {
  return readAll()
}

export function setOverride(day: number, override: JourneyContentOverride) {
  const all = readAll()
  all[day] = override
  writeAll(all)
}

export function clearOverride(day: number) {
  const all = readAll()
  delete all[day]
  writeAll(all)
}

// Developer Panel'in "Factory Reset" kontrolü için (bkz.
// devpanel/sections/Reset) - tüm günlerin düzenlemelerini tek seferde siler.
export function clearAllOverrides() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(OVERRIDES_KEY)
}
