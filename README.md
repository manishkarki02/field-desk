# FieldDesk

A multi-organization support-ticket dashboard with role-based, data-driven permissions.

Built with React 19, TypeScript, and Vite. Mock data only, no backend.

## Install & run

```bash
pnpm install
pnpm dev
```

Other scripts: `pnpm build` (typecheck + production build), `pnpm lint`,
`pnpm test`, `pnpm preview`.

## Submission links

- Public repository: [Link](https://github.com/manishkarki02/field-desk)
- Deployed URL: [Link]()

## Project structure

Feature-based layout: each feature owns its API service, components, hooks, and types. Cross-cutting code lives in `shared/`, app wiring in `app/`, and the mock backend in `mocks/`.

```
src/
├── app/                    # App shell & wiring (no business logic)
│   ├── App.tsx             #   Root component: providers + router
│   ├── providers/          #   Global provider composition
│   ├── router/             #   Route table, permission-gated routes
│   └── layout/             #   Sidebar / top bar shell
├── features/
│   ├── session/            # User switcher + active-org selection (session simulation)
│   ├── permissions/        # Role & permission model, single source of truth for access
│   ├── tickets/            # Ticket list, details, create/edit/assign/delete
│   ├── organizations/      # Organization directory & management
│   ├── staff/              # Staff directory & management
│   └── analytics/          # Ticket analytics (org- and permission-scoped)
│   └── <feature>/
│       ├── api/            #   Mock service functions for this feature
│       ├── components/     #   Feature-specific UI
│       ├── hooks/          #   Feature-specific hooks
│       ├── types.ts        #   Domain types
│       └── index.ts        #   Public barrel; other features import from here only
├── shared/                 # Common code used across features
│   ├── components/         #   UI primitives (spinner, empty state, restricted state, …)
│   ├── hooks/              #   Generic hooks
│   └── lib/                #   Utilities (e.g. simulated latency)
└── mocks/                  # In-memory mock DB + seed data (orgs, users, tickets, role permissions)
```

Conventions:

- Import via the `@/` alias (`@/features/tickets`), and only through a feature's `index.ts` barrel.
- UI never touches `mocks/` directly; data flows through each feature's `api/` service, which simulates latency.
- Access control comes from the editable role→permission map seeded in `mocks/seed.ts` (owned by the permissions feature); no hard-coded role checks scattered in components.

## Implemented surfaces

- Organization-scoped ticket list, ticket details, create/edit/assign/delete flows.
- Staff directory with create/edit/remove and role-change flows.
- Organization directory for platform-level users.
- Editable role-to-permission matrix used by route guards and UI actions.
- Analytics derived from the same ticket visibility rules as the ticket list.
- Demo session controls for switching users and active organization scope.

## How to test users and organizations

Use the **Acting as** selector in the top bar to switch between seeded users.
For platform-level users, use the organization selector beside it to view either
all organizations or one organization at a time.

Seeded organizations:

- Acme Retail
- Nova Logistics
- Helix Health

Suggested test users:

- **Sita Adhikari**: Super Admin, platform-level. Can view all organizations,
  manage organizations, staff, tickets, analytics, and role permissions.
- **Arjun Thapa**: Auditor, platform-level. Can view ticket and analytics data
  across organizations, but should not see management actions.
- **Priya Sharma**: Organization Admin for Acme Retail. Can manage Acme tickets
  and staff, but cannot access Nova Logistics or Helix Health data.
- **Bikash Gurung**: Team Lead for Acme Retail. Can manage tickets and view
  analytics in Acme, with no organization management access.
- **Maya Rai**: Agent for Acme Retail. Can only see tickets assigned to her and
  has limited ticket actions.

Useful checks:

- Switch from Sita to Priya and confirm the organization selector disappears.
- Switch from Priya to a Nova user and confirm ticket/staff data changes to that
  user's organization.
- Switch to an agent and confirm the ticket list only contains that agent's
  assigned tickets.
- Switch to Auditor and confirm create/edit/delete controls are not available.

## Permissions model

Permissions are stored as editable mock application data in
`src/mocks/seed.ts` under `seedRolePermissions`. The permission types and labels
live in `src/features/permissions/types.ts`, and the permissions exposed in the
role editor are grouped in `src/features/permissions/editablePermissions.ts`.

The permission map is loaded through `src/features/permissions/api` and cached
with TanStack Query. Updating a role permission writes the new map back into the
query cache, so route guards, navigation items, buttons, row actions, and page
states update without a reload.

Organization scoping is separate from permissions. It is enforced in
`src/mocks/scope.ts` and reused by feature API services, so organization-level
users cannot fetch or mutate data from another organization even if UI state is
changed manually. Ticket visibility uses `src/features/tickets/api/ticketScope.ts`;
agents only see tickets assigned to them.

Default role expectations:

- **Super Admin**: full access across all organizations, including permission
  and organization management.
- **Auditor**: read-only ticket and analytics access across organizations.
- **Organization Admin**: ticket, staff, and analytics management within one
  organization.
- **Team Lead**: ticket management and analytics within one organization.
- **Agent**: assigned-ticket access with limited ticket actions.

`permissions.manage` is intentionally reserved for Super Admin and is not shown
as an editable checkbox, so the demo cannot accidentally remove the only role
that can manage permissions.

## Technical decisions

- **Feature-first structure**: each domain owns its service, hooks, UI, and
  types. Other features import through public barrels.
- **Mock API layer**: the UI never reads `mocks/` directly. Services simulate
  latency and act like a small backend boundary.
- **Data-driven permissions**: components ask `usePermissions().can(...)`
  instead of checking roles directly.
- **Centralized access scope**: organization and agent visibility rules are
  applied in service helpers, not repeated in pages.
- **TanStack Router**: file routes keep route-level permission guards close to
  the route definitions.
- **TanStack Query**: feature hooks share loading/error states and immediate
  cache updates after mutations.
- **Reusable list/modal primitives**: shared table, list-page, and modal
  components keep feature pages consistent without hiding domain behavior.

## Known limitations

- Data is in memory only. Refreshing the page resets ticket, staff,
  organization, and permission changes back to seed data, except the selected
  demo session which is persisted locally.
- There is no real authentication, backend, database, or audit log.
- Test coverage focuses on the most important shared visibility rule: ticket
  scope across platform, organization, and agent contexts.
- Permission management is intentionally simplified to role-level permissions,
  not per-user overrides.
- The production bundle currently emits a Vite chunk-size warning. It does not
  break the build, but route-level code splitting would be a good next
  improvement.
- Public repository and deployed URL must be added in the submission links
  section before sending the assignment.

## Verification

```bash
pnpm lint
pnpm test
pnpm build
```

The test suite currently covers the core ticket visibility rule shared by
ticket lists and analytics: platform scope, organization scope, and
agent-assignment scope.
