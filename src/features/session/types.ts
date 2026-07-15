import type { User } from '@/features/staff/types'

/**
 * Simulated session: the currently impersonated user plus, for
 * platform-level users, the organization they are currently viewing.
 */
export interface Session {
  user: User
  /**
   * Organization scope for platform-level users (switchable).
   * Org-level users are always locked to their own organization.
   */
  activeOrganizationId: string | null
}
