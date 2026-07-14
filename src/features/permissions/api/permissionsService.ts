import { db } from "@/mocks/db";
import { delay } from "@/shared/lib";
import type { PermissionKey, Role, RolePermissions } from "../types";

/**
 * Mock api for the role→permission map. Always returns clones so
 * callers never hold a live reference into the mock DB.
 */

export async function fetchRolePermissions(): Promise<RolePermissions> {
  await delay();
  return structuredClone(db.rolePermissions);
}

/** Replaces one role's permission list and returns the updated map. */
export async function updateRolePermissions(
  role: Role,
  permissions: PermissionKey[],
): Promise<RolePermissions> {
  await delay();
  db.rolePermissions[role] = [...permissions];
  return structuredClone(db.rolePermissions);
}
