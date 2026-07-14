# FieldDesk

A multi-organization support-ticket dashboard with role-based, data-driven permissions.

Built with React 19, TypeScript, and Vite. Mock data only — no backend.

## Install & run

```bash
pnpm install
pnpm dev
```

Other scripts: `pnpm build` (typecheck + production build), `pnpm lint`, `pnpm preview`.

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
│   ├── permissions/        # Role & permission model — single source of truth for access
│   ├── tickets/            # Ticket list, details, create/edit/assign/delete
│   ├── organizations/      # Organization directory & management
│   ├── staff/              # Staff directory & management
│   └── analytics/          # Ticket analytics (org- and permission-scoped)
│   └── <feature>/
│       ├── api/            #   Mock service functions for this feature
│       ├── components/     #   Feature-specific UI
│       ├── hooks/          #   Feature-specific hooks
│       ├── types.ts        #   Domain types
│       └── index.ts        #   Public barrel — other features import from here only
├── shared/                 # Common code used across features
│   ├── components/         #   UI primitives (spinner, empty state, restricted state, …)
│   ├── hooks/              #   Generic hooks
│   ├── lib/                #   Utilities (e.g. simulated latency)
│   └── types/              #   Cross-cutting types
└── mocks/                  # In-memory mock DB + seed data (orgs, users, tickets, role permissions)
```

Conventions:

- Import via the `@/` alias (`@/features/tickets`), and only through a feature's `index.ts` barrel.
- UI never touches `mocks/` directly — data flows through each feature's `api/` service, which simulates latency.
- Access control comes from the editable role→permission map seeded in `mocks/seed.ts` (owned by the permissions feature); no hard-coded role checks scattered in components.

## Status

Structure scaffold only — feature logic, seed records, and UI are not implemented yet.
