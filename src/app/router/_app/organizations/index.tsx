import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsListPage } from "@/features/organizations";
import { requirePermission } from "@/features/permissions";

export const Route = createFileRoute("/_app/organizations/")({
  beforeLoad: () => requirePermission("organizations.manage"),
  component: OrganizationsListPage,
});
