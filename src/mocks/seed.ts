import type { RolePermissions } from '@/features/permissions'
import type { Organization } from '@/features/organizations'
import type { User } from '@/features/staff'
import type { Ticket } from '@/features/tickets'

export const seedOrganizations: Organization[] = [
  { id: 'org-acme', name: 'Acme Retail', createdAt: '2025-11-03T09:00:00Z' },
  { id: 'org-nova', name: 'Nova Logistics', createdAt: '2026-01-19T09:00:00Z' },
  { id: 'org-helix', name: 'Helix Health', createdAt: '2026-03-27T09:00:00Z' },
]

export const seedUsers: User[] = [
  // Platform-level users (no organization)
  {
    id: 'user-sa-1',
    name: 'Sita Adhikari',
    email: 'sita.adhikari@fielddesk.io',
    role: 'super_admin',
    organizationId: null,
  },
  {
    id: 'user-aud-1',
    name: 'Arjun Thapa',
    email: 'arjun.thapa@fielddesk.io',
    role: 'auditor',
    organizationId: null,
  },

  // Acme Retail
  {
    id: 'user-acme-admin',
    name: 'Priya Sharma',
    email: 'priya@acmeretail.com',
    role: 'org_admin',
    organizationId: 'org-acme',
  },
  {
    id: 'user-acme-lead',
    name: 'Bikash Gurung',
    email: 'bikash@acmeretail.com',
    role: 'team_lead',
    organizationId: 'org-acme',
  },
  {
    id: 'user-acme-agent-1',
    name: 'Maya Rai',
    email: 'maya@acmeretail.com',
    role: 'agent',
    organizationId: 'org-acme',
  },
  {
    id: 'user-acme-agent-2',
    name: 'Dipesh Karki',
    email: 'dipesh@acmeretail.com',
    role: 'agent',
    organizationId: 'org-acme',
  },

  // Nova Logistics
  {
    id: 'user-nova-admin',
    name: 'Ramesh Shrestha',
    email: 'ramesh@novalogistics.com',
    role: 'org_admin',
    organizationId: 'org-nova',
  },
  {
    id: 'user-nova-lead',
    name: 'Anita Tamang',
    email: 'anita@novalogistics.com',
    role: 'team_lead',
    organizationId: 'org-nova',
  },
  {
    id: 'user-nova-agent-1',
    name: 'Suraj Magar',
    email: 'suraj@novalogistics.com',
    role: 'agent',
    organizationId: 'org-nova',
  },

  // Helix Health
  {
    id: 'user-helix-admin',
    name: 'Kabita Joshi',
    email: 'kabita@helixhealth.com',
    role: 'org_admin',
    organizationId: 'org-helix',
  },
  {
    id: 'user-helix-lead',
    name: 'Niraj Basnet',
    email: 'niraj@helixhealth.com',
    role: 'team_lead',
    organizationId: 'org-helix',
  },
  {
    id: 'user-helix-agent-1',
    name: 'Sunita Lama',
    email: 'sunita@helixhealth.com',
    role: 'agent',
    organizationId: 'org-helix',
  },
]

export const seedTickets: Ticket[] = [
  // Acme Retail
  {
    id: 'ticket-1001',
    organizationId: 'org-acme',
    title: 'POS terminal freezes during checkout',
    description:
      'The point-of-sale terminal at store #12 freezes intermittently when processing card payments, forcing staff to restart it mid-sale.',
    status: 'open',
    priority: 'urgent',
    assigneeId: 'user-acme-agent-1',
    createdById: 'user-acme-admin',
    createdAt: '2026-07-10T08:15:00Z',
    updatedAt: '2026-07-12T14:30:00Z',
  },
  {
    id: 'ticket-1002',
    organizationId: 'org-acme',
    title: 'Loyalty points not applied to online orders',
    description:
      'Customers report that loyalty points earned in-store are not being applied at checkout on the web shop.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-acme-agent-2',
    createdById: 'user-acme-lead',
    createdAt: '2026-07-08T11:40:00Z',
    updatedAt: '2026-07-13T09:05:00Z',
  },
  {
    id: 'ticket-1003',
    organizationId: 'org-acme',
    title: 'Weekly sales report email arrives empty',
    description:
      'The automated Monday sales report email has arrived with an empty attachment for the last two weeks.',
    status: 'open',
    priority: 'medium',
    assigneeId: null,
    createdById: 'user-acme-admin',
    createdAt: '2026-07-13T07:55:00Z',
    updatedAt: '2026-07-13T07:55:00Z',
  },
  {
    id: 'ticket-1004',
    organizationId: 'org-acme',
    title: 'Request: dark mode for the store dashboard',
    description:
      'Night-shift staff have asked for a dark theme on the internal store dashboard to reduce eye strain.',
    status: 'resolved',
    priority: 'low',
    assigneeId: 'user-acme-agent-1',
    createdById: 'user-acme-agent-1',
    createdAt: '2026-06-21T16:20:00Z',
    updatedAt: '2026-07-02T10:10:00Z',
  },
  {
    id: 'ticket-1005',
    organizationId: 'org-acme',
    title: 'Barcode scanner pairing drops after sleep',
    description:
      'Bluetooth barcode scanners lose pairing whenever the register goes to sleep and need a manual re-pair.',
    status: 'closed',
    priority: 'medium',
    assigneeId: 'user-acme-agent-2',
    createdById: 'user-acme-lead',
    createdAt: '2026-05-30T13:00:00Z',
    updatedAt: '2026-06-18T15:45:00Z',
  },

  // Nova Logistics
  {
    id: 'ticket-2001',
    organizationId: 'org-nova',
    title: 'GPS tracking gaps on route NL-7',
    description:
      'Delivery vehicles on route NL-7 show 20–30 minute gaps in GPS tracking, breaking customer ETA notifications.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-nova-agent-1',
    createdById: 'user-nova-lead',
    createdAt: '2026-07-06T09:30:00Z',
    updatedAt: '2026-07-11T17:00:00Z',
  },
  {
    id: 'ticket-2002',
    organizationId: 'org-nova',
    title: 'Warehouse scanner app crashes on Android 15',
    description:
      'After the latest OS update, the warehouse inventory scanner app crashes on launch on all Android 15 devices.',
    status: 'open',
    priority: 'urgent',
    assigneeId: null,
    createdById: 'user-nova-admin',
    createdAt: '2026-07-12T06:45:00Z',
    updatedAt: '2026-07-12T06:45:00Z',
  },
  {
    id: 'ticket-2003',
    organizationId: 'org-nova',
    title: 'Duplicate invoices generated for bulk shipments',
    description:
      'Bulk shipments split across multiple pallets occasionally generate two invoices for the same consignment.',
    status: 'open',
    priority: 'high',
    assigneeId: 'user-nova-agent-1',
    createdById: 'user-nova-admin',
    createdAt: '2026-07-09T12:10:00Z',
    updatedAt: '2026-07-10T08:25:00Z',
  },
  {
    id: 'ticket-2004',
    organizationId: 'org-nova',
    title: 'Driver mobile app battery drain',
    description:
      'Drivers report the app drains a full battery over one shift; suspected excessive location polling.',
    status: 'resolved',
    priority: 'medium',
    assigneeId: 'user-nova-agent-1',
    createdById: 'user-nova-lead',
    createdAt: '2026-06-14T10:00:00Z',
    updatedAt: '2026-07-01T11:35:00Z',
  },

  // Helix Health
  {
    id: 'ticket-3001',
    organizationId: 'org-helix',
    title: 'Patient portal login loop on Safari',
    description:
      'Patients using Safari get redirected back to the login page after entering valid credentials.',
    status: 'open',
    priority: 'urgent',
    assigneeId: 'user-helix-agent-1',
    createdById: 'user-helix-admin',
    createdAt: '2026-07-11T14:20:00Z',
    updatedAt: '2026-07-13T16:50:00Z',
  },
  {
    id: 'ticket-3002',
    organizationId: 'org-helix',
    title: 'Appointment reminder SMS sent twice',
    description:
      'Some patients receive duplicate appointment reminder texts, causing confusion about rescheduled slots.',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'user-helix-agent-1',
    createdById: 'user-helix-lead',
    createdAt: '2026-07-05T09:00:00Z',
    updatedAt: '2026-07-09T13:15:00Z',
  },
  {
    id: 'ticket-3003',
    organizationId: 'org-helix',
    title: 'Lab results PDF export missing header',
    description:
      'Exported lab result PDFs are missing the clinic header and patient ID block on the first page.',
    status: 'open',
    priority: 'low',
    assigneeId: null,
    createdById: 'user-helix-admin',
    createdAt: '2026-07-13T10:40:00Z',
    updatedAt: '2026-07-13T10:40:00Z',
  },
  {
    id: 'ticket-3004',
    organizationId: 'org-helix',
    title: 'Pharmacy stock sync delayed by 24 hours',
    description:
      'Stock levels shown to prescribing clinicians lag the pharmacy system by a full day.',
    status: 'closed',
    priority: 'high',
    assigneeId: 'user-helix-agent-1',
    createdById: 'user-helix-lead',
    createdAt: '2026-05-22T08:30:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
  },
]

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
