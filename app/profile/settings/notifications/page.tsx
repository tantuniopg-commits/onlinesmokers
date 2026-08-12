'use client'

import { SettingsShell, SettingsCard, SettingsRow, Toggle } from '../shared'
import type { NotificationSettings } from '../../../services/SettingsService'
import { useSettings } from '../../../hooks/useSettings'
import { useLocale } from '../../../contexts/LocaleContext'
import type { TranslationKey } from '../../../lib/i18n'

const ROWS: { key: keyof NotificationSettings; labelKey: TranslationKey }[] = [
  { key: 'dailyRitualReminder', labelKey: 'settings.notifications.dailyRitualReminder' },
  { key: 'journeyReminder', labelKey: 'settings.notifications.journeyReminder' },
  { key: 'weeklySummary', labelKey: 'settings.notifications.weeklySummary' },
  { key: 'motivationalMessages', labelKey: 'settings.notifications.motivationalMessages' },
]

export default function NotificationSettingsPage() {
  const { t } = useLocale()
  const { settings, updateNotifications } = useSettings()
  const notifications = settings?.notifications

  const toggle = (key: keyof NotificationSettings, next: boolean) => {
    updateNotifications(key, next)
  }

  if (!notifications) return <SettingsShell title={t('settings.notifications.title')}>{null}</SettingsShell>

  return (
    <SettingsShell title={t('settings.notifications.title')}>
      <SettingsCard>
        {ROWS.map((row, i) => (
          <SettingsRow
            key={row.key}
            label={t(row.labelKey)}
            chevron={false}
            first={i === 0}
            rightElement={<Toggle checked={notifications[row.key]} onChange={(next) => toggle(row.key, next)} />}
          />
        ))}
      </SettingsCard>
    </SettingsShell>
  )
}
