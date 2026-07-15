import { useQuery } from "@tanstack/react-query";
import { useOrgScope, useSessionStore } from "@/features/session";
import { fetchTicketAnalytics } from "../api/analyticsService";

export const analyticsQueryKey = ["analytics"] as const;

/** Keyed like the ticket list: per scope and per user (agent visibility). */
export function useTicketAnalytics() {
  const scope = useOrgScope();
  const userId = useSessionStore((state) => state.user.id);
  return useQuery({
    queryKey: [...analyticsQueryKey, { scope, userId }],
    queryFn: fetchTicketAnalytics,
  });
}
