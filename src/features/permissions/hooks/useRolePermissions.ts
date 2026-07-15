import { useQuery } from "@tanstack/react-query";
import { fetchRolePermissions } from "../api/permissionsService";

export const rolePermissionsQueryKey = ["rolePermissions"] as const;

export function useRolePermissions() {
  return useQuery({
    queryKey: rolePermissionsQueryKey,
    queryFn: fetchRolePermissions,
  });
}
