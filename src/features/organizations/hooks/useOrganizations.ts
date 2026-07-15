import { useQuery } from "@tanstack/react-query";
import { useSessionStore } from "@/features/session";
import {
  fetchOrganizations,
  fetchOrganizationsWithStats,
} from "../api/organizationsService";

export const organizationsQueryKey = ["organizations"] as const;

/**
 * The directory is scoped by *user* (org users only see their own org),
 * not by the active-organization view filter, so the key varies on the
 * user's own org.
 */
function useDirectoryScope() {
  return useSessionStore((state) => state.user.organizationId);
}

export function useOrganizations() {
  const scope = useDirectoryScope();
  return useQuery({
    queryKey: [...organizationsQueryKey, { scope }],
    queryFn: fetchOrganizations,
  });
}

export function useOrganizationsWithStats() {
  const scope = useDirectoryScope();
  return useQuery({
    queryKey: [...organizationsQueryKey, "stats", { scope }],
    queryFn: fetchOrganizationsWithStats,
  });
}
