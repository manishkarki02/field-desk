import { db } from "@/mocks/db";
import { assertPlatformUser, getSessionUser } from "@/mocks/scope";
import { delay } from "@/shared/lib";
import type { Organization, OrganizationWithStats } from "../types";

export interface OrganizationInput {
  name: string;
}

/**
 * The organization directory is platform data: org-level users only ever
 * see their own organization; the active-organization view filter does
 * not apply here (platform users need the full list to switch scope).
 */
function organizationsInScope(): Organization[] {
  const user = getSessionUser();
  return user.organizationId
    ? db.organizations.filter((org) => org.id === user.organizationId)
    : db.organizations;
}

function requireOrganization(organizationId: string): Organization {
  assertPlatformUser();
  const organization = db.organizations.find((org) => org.id === organizationId);
  if (!organization) throw new Error("Organization not found.");
  return organization;
}

export async function fetchOrganizations(): Promise<Organization[]> {
  await delay();
  return structuredClone(organizationsInScope());
}

export async function fetchOrganizationsWithStats(): Promise<
  OrganizationWithStats[]
> {
  await delay();
  return organizationsInScope().map((organization) => ({
    ...structuredClone(organization),
    userCount: db.users.filter((user) => user.organizationId === organization.id)
      .length,
    ticketCount: db.tickets.filter(
      (ticket) => ticket.organizationId === organization.id,
    ).length,
  }));
}

export async function createOrganization(
  input: OrganizationInput,
): Promise<Organization> {
  await delay();
  assertPlatformUser();
  const organization: Organization = {
    id: `org-${Date.now()}`,
    name: input.name,
    createdAt: new Date().toISOString(),
  };
  db.organizations.push(organization);
  return structuredClone(organization);
}

export async function updateOrganization(
  organizationId: string,
  input: OrganizationInput,
): Promise<Organization> {
  await delay();
  const organization = requireOrganization(organizationId);
  organization.name = input.name;
  return structuredClone(organization);
}

/** Deletes an organization along with its staff and tickets. */
export async function deleteOrganization(organizationId: string): Promise<void> {
  await delay();
  const organization = requireOrganization(organizationId);
  db.users = db.users.filter((user) => user.organizationId !== organization.id);
  db.tickets = db.tickets.filter(
    (ticket) => ticket.organizationId !== organization.id,
  );
  db.organizations.splice(db.organizations.indexOf(organization), 1);
}
