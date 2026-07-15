import { useQuery } from "@tanstack/react-query";
import { useOrgScope, useSessionStore } from "@/features/session";
import { fetchTicket, fetchTickets } from "../api/ticketsService";

export const ticketsQueryKey = ["tickets"] as const;

/**
 * Keyed on the user as well as the org scope: agents only see tickets
 * assigned to them, so two users in the same org have different lists.
 */
export function useTickets() {
  const scope = useOrgScope();
  const userId = useSessionStore((state) => state.user.id);
  return useQuery({
    queryKey: [...ticketsQueryKey, { scope, userId }],
    queryFn: fetchTickets,
  });
}

export function useTicket(ticketId: string) {
  const scope = useOrgScope();
  const userId = useSessionStore((state) => state.user.id);
  return useQuery({
    queryKey: [...ticketsQueryKey, { scope, userId, ticketId }],
    queryFn: () => fetchTicket(ticketId),
  });
}
