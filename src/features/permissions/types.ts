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
  | 'tickets.edit_details'
  | 'tickets.assign'
  | 'tickets.delete'
  | 'staff.manage'
  | 'organizations.manage'
  | 'analytics.view'
  | 'permissions.manage'

export type RolePermissions = Record<Role, PermissionKey[]>

export const allRoles: Role[] = [
  'super_admin',
  'auditor',
  'org_admin',
  'team_lead',
  'agent',
]

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super Admin',
  auditor: 'Auditor',
  org_admin: 'Org Admin',
  team_lead: 'Team Lead',
  agent: 'Agent',
}

export const allPermissionKeys: PermissionKey[] = [
  'tickets.view',
  'tickets.create',
  'tickets.edit',
  'tickets.edit_details',
  'tickets.assign',
  'tickets.delete',
  'staff.manage',
  'organizations.manage',
  'analytics.view',
  'permissions.manage',
]

export const permissionLabels: Record<PermissionKey, string> = {
  'tickets.view': 'View tickets',
  'tickets.create': 'Create tickets',
  'tickets.edit': 'Update ticket status',
  'tickets.edit_details': 'Edit ticket details',
  'tickets.assign': 'Assign tickets',
  'tickets.delete': 'Delete tickets',
  'staff.manage': 'Manage staff',
  'organizations.manage': 'Manage organizations',
  'analytics.view': 'View analytics',
  'permissions.manage': 'Manage permissions',
}
