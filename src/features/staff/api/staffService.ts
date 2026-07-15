import { db } from "@/mocks/db";
import {
  assertOrganizationAccess,
  getScopedOrganizationId,
  getSessionUser,
} from "@/mocks/scope";
import { delay } from "@/shared/lib";
import type { StaffRole, User } from "../types";

export interface StaffCreateInput {
  name: string;
  email: string;
  role: StaffRole;
  organizationId: string;
}

export interface StaffUpdateInput {
  name: string;
  email: string;
}

const staffRoles: StaffRole[] = ["org_admin", "team_lead", "agent"];

function assertStaffRole(role: StaffRole): void {
  if (!staffRoles.includes(role)) {
    throw new Error("Staff members must have an organization-level role.");
  }
}

/** Looks a staff member up and enforces organization scoping in one step. */
function requireStaffMember(userId: string): User & { organizationId: string } {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user || user.organizationId === null) {
    throw new Error("Staff member not found.");
  }
  assertOrganizationAccess(user.organizationId);
  return user as User & { organizationId: string };
}

/**
 * Staff in scope: a specific organization when `organizationId` is given
 * (still validated against the session scope), otherwise the session's
 * effective scope. Platform-level users are not staff and are excluded.
 */
export async function fetchStaff(organizationId?: string): Promise<User[]> {
  await delay();
  const scoped = organizationId ?? getScopedOrganizationId();
  if (scoped !== null) assertOrganizationAccess(scoped);
  const staff = db.users.filter((user) =>
    scoped === null ? user.organizationId !== null : user.organizationId === scoped,
  );
  return structuredClone(staff);
}

export async function createStaff(input: StaffCreateInput): Promise<User> {
  await delay();
  assertOrganizationAccess(input.organizationId);
  assertStaffRole(input.role);
  const user: User = {
    id: `user-${Date.now()}`,
    name: input.name,
    email: input.email,
    role: input.role,
    organizationId: input.organizationId,
  };
  db.users.push(user);
  return structuredClone(user);
}

export async function updateStaff(
  userId: string,
  input: StaffUpdateInput,
): Promise<User> {
  await delay();
  const user = requireStaffMember(userId);
  Object.assign(user, input);
  return structuredClone(user);
}

export async function changeStaffRole(
  userId: string,
  role: StaffRole,
): Promise<User> {
  await delay();
  assertStaffRole(role);
  const user = requireStaffMember(userId);
  user.role = role;
  return structuredClone(user);
}

export async function removeStaff(userId: string): Promise<void> {
  await delay();
  const user = requireStaffMember(userId);
  if (user.id === getSessionUser().id) {
    throw new Error("You cannot remove the user you are currently acting as.");
  }
  for (const ticket of db.tickets) {
    if (ticket.assigneeId === user.id) ticket.assigneeId = null;
  }
  db.users.splice(db.users.indexOf(user), 1);
}
