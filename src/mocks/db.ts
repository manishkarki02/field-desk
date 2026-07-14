import type { Organization } from "@/features/organizations";
import type { RolePermissions } from "@/features/permissions";
import type { User } from "@/features/staff";
import type { Ticket } from "@/features/tickets";
import {
  seedOrganizations,
  seedRolePermissions,
  seedTickets,
  seedUsers,
} from "./seed";

interface Db {
  organizations: Organization[];
  users: User[];
  tickets: Ticket[];
  rolePermissions: RolePermissions;
}

export const db: Db = {
  organizations: structuredClone(seedOrganizations),
  users: structuredClone(seedUsers),
  tickets: structuredClone(seedTickets),
  rolePermissions: structuredClone(seedRolePermissions),
};
