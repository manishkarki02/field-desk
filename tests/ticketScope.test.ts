import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filterTicketsForScope } from "../src/features/tickets/api/ticketScope.js";
import type { Ticket } from "../src/features/tickets/types.js";

const tickets: Ticket[] = [
  {
    id: "ticket-acme-agent",
    organizationId: "org-acme",
    title: "Acme agent ticket",
    description: "Visible to the assigned Acme agent.",
    status: "open",
    priority: "medium",
    assigneeId: "user-acme-agent",
    createdById: "user-acme-admin",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "ticket-acme-other",
    organizationId: "org-acme",
    title: "Acme team ticket",
    description: "Visible to non-agent Acme roles.",
    status: "in_progress",
    priority: "high",
    assigneeId: "user-acme-lead",
    createdById: "user-acme-admin",
    createdAt: "2026-01-02T00:00:00Z",
    updatedAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "ticket-nova",
    organizationId: "org-nova",
    title: "Nova ticket",
    description: "Visible only when Nova is in scope.",
    status: "resolved",
    priority: "low",
    assigneeId: "user-nova-agent",
    createdById: "user-nova-admin",
    createdAt: "2026-01-03T00:00:00Z",
    updatedAt: "2026-01-03T00:00:00Z",
  },
];

describe("filterTicketsForScope", () => {
  it("returns all tickets for platform users with all-organization scope", () => {
    const scoped = filterTicketsForScope(
      tickets,
      { id: "user-auditor", role: "auditor" },
      null,
    );

    assert.deepEqual(
      scoped.map((ticket) => ticket.id),
      ["ticket-acme-agent", "ticket-acme-other", "ticket-nova"],
    );
  });

  it("limits non-agent users to the active organization", () => {
    const scoped = filterTicketsForScope(
      tickets,
      { id: "user-acme-admin", role: "org_admin" },
      "org-acme",
    );

    assert.deepEqual(
      scoped.map((ticket) => ticket.id),
      ["ticket-acme-agent", "ticket-acme-other"],
    );
  });

  it("limits agents to tickets assigned to them inside the active organization", () => {
    const scoped = filterTicketsForScope(
      tickets,
      { id: "user-acme-agent", role: "agent" },
      "org-acme",
    );

    assert.deepEqual(
      scoped.map((ticket) => ticket.id),
      ["ticket-acme-agent"],
    );
  });
});
