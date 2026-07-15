import { useQuery } from "@tanstack/react-query";
import { fetchImpersonationUsers } from "../api/sessionService";

export const impersonationUsersQueryKey = ["session", "impersonation-users"] as const;

export function useImpersonationUsers() {
  return useQuery({
    queryKey: impersonationUsersQueryKey,
    queryFn: fetchImpersonationUsers,
  });
}
