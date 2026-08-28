'use client'

import SectionCard, { Row } from '../SectionCard'
import type { VelisUser } from '../../lib/auth'
import { isDev } from '../../constants/env'
import { APP_VERSION } from '../../constants/version'

export default function AppStatusSection({ user }: { user: VelisUser | null }) {
  return (
    <SectionCard title="App Status">
      <Row label="Version" value={APP_VERSION} />
      <Row label="Build Mode" value={isDev ? 'Debug' : 'Release'} />
      <Row label="Environment" value={isDev ? 'Development' : 'Production'} />
      <Row label="Logged In User" value={user ? `${user.firstName} ${user.lastName}` : 'Guest'} />
      <Row
        label="Admin Status"
        value={user?.isAdmin ? `Admin (${user.email})` : isDev ? 'Dev build (unrestricted)' : 'Not an admin'}
      />
    </SectionCard>
  )
}
