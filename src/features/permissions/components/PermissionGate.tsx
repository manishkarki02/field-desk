import type { ReactNode } from "react";
import type { PermissionKey } from "../types";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionGateProps {
  permission: PermissionKey;
  /** Rendered when the active user lacks the permission. */
  fallback?: ReactNode;
  children: ReactNode;
}

/** Conditionally renders children based on the active user's permissions. */
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can } = usePermissions();
  return can(permission) ? children : fallback;
}
