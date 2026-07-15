import type { Role } from "@/features/permissions/types";

/** Roles a staff member (org-level user) can hold. */
export type StaffRole = Extract<Role, "org_admin" | "team_lead" | "agent">;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** null for platform-level users (super_admin, auditor) */
  organizationId: string | null;
}
