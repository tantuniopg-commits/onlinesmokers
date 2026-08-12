'use client'

import { useCallback, useEffect, useState } from 'react'
import { getStoredSettings, saveSettings } from '../services/SettingsService'
import type { UserSettings, NotificationSettings, AppearanceSettings } from '../services/SettingsService'

// Ayarlar sayfalarının (language/notifications/appearance) her birinin
// bağımsız olarak yaptığı "oku -> birleştir -> yaz" deseni burada tek
// yerde toplandı.
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    setSettings(getStoredSettings())
  }, [])

  const updateLanguage = useCallback((code: string) => {
    setSettings((prev) => {
      const current = prev ?? getStoredSettings()
      const next = { ...current, language: code }
      saveSettings(next)
      return next
    })
  }, [])

  const updateNotifications = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => {
      const current = prev ?? getStoredSettings()
      const next = { ...current, notifications: { ...current.notifications, [key]: value } }
      saveSettings(next)
      return next
    })
  }, [])

  const updateAppearance = useCallback((appearance: AppearanceSettings) => {
    setSettings((prev) => {
      const current = prev ?? getStoredSettings()
      const next = { ...current, appearance }
      saveSettings(next)
      return next
    })
  }, [])

  return { settings, updateLanguage, updateNotifications, updateAppearance }
}
