import type { Organization } from "@/features/organizations/types";
import type { RolePermissions } from "@/features/permissions/types";
import type { User } from "@/features/staff/types";
import type { Ticket } from "@/features/tickets/types";
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
