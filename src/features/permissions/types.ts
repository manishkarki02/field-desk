export type Role =
  | 'super_admin'
  | 'auditor'
  | 'org_admin'
  | 'team_lead'
  | 'agent'

export type PermissionKey =
  | 'tickets.view'
  | 'tickets.create'
  | 'tickets.edit'
  | 'tickets.assign'
  | 'tickets.delete'
  | 'staff.manage'
  | 'organizations.manage'
  | 'analytics.view'
  | 'permissions.manage'

/**
 * Editable application data — the single source of truth for access control.
 * Stored in the mock DB and updated live from the permissions feature.
 */
export type RolePermissions = Record<Role, PermissionKey[]>
