import type { RolePermissions } from '@/features/permissions'
import type { Organization } from '@/features/organizations'
import type { User } from '@/features/staff'
import type { Ticket } from '@/features/tickets'

/**
 * Seed data for the mock backend:
 * - at least 3 organizations, each with their own users and tickets
 * - one seeded user per role so every role can be tested
 * - the initial (editable) role -> permissions map
 *
 * TODO: fill in seed records.
 */
export const seedOrganizations: Organization[] = []

export const seedUsers: User[] = []

export const seedTickets: Ticket[] = []

export const seedRolePermissions: RolePermissions = {
  super_admin: [
    'tickets.view',
    'tickets.create',
    'tickets.edit',
    'tickets.assign',
    'tickets.delete',
    'staff.manage',
    'organizations.manage',
    'analytics.view',
    'permissions.manage',
  ],
  auditor: ['tickets.view', 'analytics.view'],
  org_admin: [
    'tickets.view',
    'tickets.create',
    'tickets.edit',
    'tickets.assign',
    'tickets.delete',
    'staff.manage',
    'analytics.view',
  ],
  team_lead: [
    'tickets.view',
    'tickets.create',
    'tickets.edit',
    'tickets.assign',
    'analytics.view',
  ],
  agent: ['tickets.view', 'tickets.edit'],
}
