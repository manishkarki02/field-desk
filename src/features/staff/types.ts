import type { Role } from '@/features/permissions'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  /** null for platform-level users (super_admin, auditor) */
  organizationId: string | null
}
