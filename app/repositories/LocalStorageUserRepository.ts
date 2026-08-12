import type { UserRepository } from './UserRepository'
import { getStoredUser, saveUser, clearUser } from '../lib/auth'
import type { VelisUser } from '../lib/auth'

// UserRepository'nin bugünkü, tek implementasyonu - lib/auth.ts'in
// localStorage CRUD'una delege ediyor.
export class LocalStorageUserRepository implements UserRepository {
  get(): VelisUser | null {
    return getStoredUser()
  }
  save(user: VelisUser): void {
    saveUser(user)
  }
  clear(): void {
    clearUser()
  }
}
