import { redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient";
import { useSessionStore } from "@/features/session";
import { fetchRolePermissions } from "./api/permissionsService";
import { rolePermissionsQueryKey } from "./hooks/useRolePermissions";
import type { PermissionKey } from "./types";

/**
 * Route guard for `beforeLoad`: resolves the role→permission map (cached
 * in the query client) and redirects to the dashboard when the active
 * user lacks the required permission. Keeps routes gated by permissions,
 * not roles.
 */
export async function requirePermission(permission: PermissionKey): Promise<void> {
  const { user } = useSessionStore.getState();

  const rolePermissions = await queryClient.ensureQueryData({
    queryKey: rolePermissionsQueryKey,
    queryFn: fetchRolePermissions,
  });

  if (!rolePermissions[user.role].includes(permission)) {
    throw redirect({ to: "/" });
  }
}
