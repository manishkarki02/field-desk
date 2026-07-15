import { useQuery } from "@tanstack/react-query";
import { useOrgScope } from "@/features/session";
import { fetchStaff } from "../api/staffService";

export const staffQueryKey = ["staff"] as const;

/**
 * Staff in scope. Pass `organizationId` to pin the list to one org
 * (e.g. the per-organization staff page); the mock API still validates
 * it against the session scope.
 */
export function useStaff(organizationId?: string) {
  const scope = useOrgScope();
  return useQuery({
    queryKey: [
      ...staffQueryKey,
      { scope, organizationId: organizationId ?? null },
    ],
    queryFn: () => fetchStaff(organizationId),
  });
}
