import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRolePermissions } from "../api/permissionsService";
import type { PermissionKey, Role, RolePermissions } from "../types";
import { rolePermissionsQueryKey } from "./useRolePermissions";

interface UpdateVariables {
  role: Role;
  permissions: PermissionKey[];
}

export function useToggleRolePermission() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ role, permissions }: UpdateVariables) =>
      updateRolePermissions(role, permissions),
    onMutate: async ({ role, permissions }) => {
      await queryClient.cancelQueries({ queryKey: rolePermissionsQueryKey });
      const previous = queryClient.getQueryData<RolePermissions>(
        rolePermissionsQueryKey,
      );
      if (previous) {
        queryClient.setQueryData<RolePermissions>(rolePermissionsQueryKey, {
          ...previous,
          [role]: permissions,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(rolePermissionsQueryKey, context.previous);
      }
    },
    onSuccess: (rolePermissions) => {
      queryClient.setQueryData(rolePermissionsQueryKey, rolePermissions);
    },
  });

  const toggle = (role: Role, permission: PermissionKey) => {
    const rolePermissions = queryClient.getQueryData<RolePermissions>(
      rolePermissionsQueryKey,
    );
    if (!rolePermissions) return; // map not loaded yet — nothing to toggle
    const current = rolePermissions[role];
    const permissions = current.includes(permission)
      ? current.filter((key) => key !== permission)
      : [...current, permission];
    mutation.mutate({ role, permissions });
  };

  return { toggle, isPending: mutation.isPending };
}
