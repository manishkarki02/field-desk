import type { User } from "../../staff/types.js";
import type { Ticket } from "../types.js";

/**
 * Applies the same ticket visibility rule everywhere tickets are summarized
 * or listed: organization scope first, then agent assignment scope.
 */
export function filterTicketsForScope(
  tickets: Ticket[],
  user: Pick<User, "id" | "role">,
  organizationId: string | null,
): Ticket[] {
  const organizationTickets =
    organizationId === null
      ? tickets
      : tickets.filter((ticket) => ticket.organizationId === organizationId);

  if (user.role !== "agent") {
    return organizationTickets;
  }

  return organizationTickets.filter((ticket) => ticket.assigneeId === user.id);
}
