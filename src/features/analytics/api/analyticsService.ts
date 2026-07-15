import { db } from "@/mocks/db";
import { ticketsInScope } from "@/features/tickets/api/ticketsService";
import { delay } from "@/shared/lib";
import type { TicketAnalytics } from "../types";

/**
 * Computed from `ticketsInScope()`, so analytics follows exactly the
 * same organization and agent visibility rules as the ticket list.
 */
export async function fetchTicketAnalytics(): Promise<TicketAnalytics> {
  await delay();
  const tickets = ticketsInScope();

  const byStatus: TicketAnalytics["byStatus"] = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  };
  const byPriority: TicketAnalytics["byPriority"] = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };
  const assigneeCounts = new Map<string, number>();

  for (const ticket of tickets) {
    byStatus[ticket.status] += 1;
    byPriority[ticket.priority] += 1;
    if (ticket.assigneeId) {
      assigneeCounts.set(
        ticket.assigneeId,
        (assigneeCounts.get(ticket.assigneeId) ?? 0) + 1,
      );
    }
  }

  const byAssignee = [...assigneeCounts]
    .map(([userId, count]) => ({
      userId,
      name: db.users.find((user) => user.id === userId)?.name ?? "Unknown",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { total: tickets.length, byStatus, byPriority, byAssignee };
}
