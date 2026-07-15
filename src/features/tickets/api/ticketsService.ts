import { db } from "@/mocks/db";
import {
  assertOrganizationAccess,
  getScopedOrganizationId,
  getSessionUser,
} from "@/mocks/scope";
import { delay } from "@/shared/lib";
import type { Ticket, TicketPriority, TicketStatus } from "../types";
import { filterTicketsForScope } from "./ticketScope";

export interface TicketCreateInput {
  organizationId: string;
  title: string;
  description: string;
  priority: TicketPriority;
  assigneeId?: string | null;
}

export interface TicketUpdateInput {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

/**
 * Tickets the session may see: the organization scope plus, for agents,
 * only tickets assigned to them. This is a data-scope rule (like the org
 * lock), not a permission. Analytics shares it so both surfaces follow
 * the same visibility.
 */
export function ticketsInScope(): Ticket[] {
  const user = getSessionUser();
  const organizationId = getScopedOrganizationId();
  return filterTicketsForScope(db.tickets, user, organizationId);
}

function assertAssigneeInOrganization(
  assigneeId: string,
  organizationId: string,
): void {
  const assignee = db.users.find((user) => user.id === assigneeId);
  if (!assignee || assignee.organizationId !== organizationId) {
    throw new Error("Assignee must belong to the ticket's organization.");
  }
}

/** Looks a ticket up and enforces organization + agent scoping in one step. */
function requireTicket(ticketId: string): Ticket {
  const ticket = db.tickets.find((candidate) => candidate.id === ticketId);
  if (!ticket) throw new Error("Ticket not found.");
  assertOrganizationAccess(ticket.organizationId);
  const user = getSessionUser();
  if (user.role === "agent" && ticket.assigneeId !== user.id) {
    throw new Error("You can only access tickets assigned to you.");
  }
  return ticket;
}

export async function fetchTickets(): Promise<Ticket[]> {
  await delay();
  return structuredClone(ticketsInScope());
}

export async function fetchTicket(ticketId: string): Promise<Ticket> {
  await delay();
  return structuredClone(requireTicket(ticketId));
}

export async function createTicket(input: TicketCreateInput): Promise<Ticket> {
  await delay();
  assertOrganizationAccess(input.organizationId);
  const user = getSessionUser();
  if (input.assigneeId) {
    assertAssigneeInOrganization(input.assigneeId, input.organizationId);
  }
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    status: "open",
    priority: input.priority,
    // Agents only see tickets assigned to them, so tickets they create
    // default to being assigned to them rather than vanishing.
    assigneeId:
      input.assigneeId ?? (user.role === "agent" ? user.id : null),
    createdById: user.id,
    createdAt: now,
    updatedAt: now,
  };
  db.tickets.push(ticket);
  return structuredClone(ticket);
}

export async function updateTicket(
  ticketId: string,
  input: TicketUpdateInput,
): Promise<Ticket> {
  await delay();
  const ticket = requireTicket(ticketId);
  Object.assign(ticket, input, { updatedAt: new Date().toISOString() });
  return structuredClone(ticket);
}

export async function assignTicket(
  ticketId: string,
  assigneeId: string | null,
): Promise<Ticket> {
  await delay();
  const ticket = requireTicket(ticketId);
  if (assigneeId !== null) {
    assertAssigneeInOrganization(assigneeId, ticket.organizationId);
  }
  ticket.assigneeId = assigneeId;
  ticket.updatedAt = new Date().toISOString();
  return structuredClone(ticket);
}

export async function deleteTicket(ticketId: string): Promise<void> {
  await delay();
  const ticket = requireTicket(ticketId);
  db.tickets.splice(db.tickets.indexOf(ticket), 1);
}
