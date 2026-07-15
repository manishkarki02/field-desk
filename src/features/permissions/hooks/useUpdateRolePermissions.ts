import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRolePermissions } from "../api/permissionsService";
import type { PermissionKey, Role } from "../types";
import { rolePermissionsQueryKey } from "./useRolePermissions";

interface UpdateVariables {
  role: Role;
  permissions: PermissionKey[];
}

/**
 * Replaces one role's permission list. Writing the result back to the
 * query cache re-renders every `usePermissions` consumer immediately.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, permissions }: UpdateVariables) =>
      updateRolePermissions(role, permissions),
    onSuccess: (rolePermissions) => {
      queryClient.setQueryData(rolePermissionsQueryKey, rolePermissions);
    },
  });
}
