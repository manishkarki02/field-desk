import type { PermissionKey } from "../types";
import { usePermissions } from "./usePermissions";

export function useHasPermission(permission: PermissionKey): boolean {
  return usePermissions().can(permission);
}
