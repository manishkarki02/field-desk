import { useCallback } from "react";
import { useSessionStore } from "@/features/session";
import type { PermissionKey } from "../types";
import { useRolePermissions } from "./useRolePermissions";

/**
 * Single source of truth for permission checks in components. Backed by
 * the role→permission map in the query cache, so edits made in the
 * permission matrix propagate to every consumer immediately.
 */
export function usePermissions() {
  const role = useSessionStore((state) => state.user.role);
  const { data: rolePermissions, isLoading } = useRolePermissions();

  const can = useCallback(
    (permission: PermissionKey): boolean =>
      rolePermissions?.[role]?.includes(permission) ?? false,
    [role, rolePermissions],
  );

  return { can, isLoading };
}
