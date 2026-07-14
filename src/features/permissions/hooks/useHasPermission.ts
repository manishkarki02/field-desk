import { useSessionStore } from "@/features/session";
import type { PermissionKey } from "../types";
import { useRolePermissions } from "./useRolePermissions";


export function useHasPermission(permission: PermissionKey): boolean {
  const role = useSessionStore((state) => state.user?.role);
  const { data: rolePermissions } = useRolePermissions();

  if (!role || !rolePermissions) return false;
  return rolePermissions[role].includes(permission);
}
