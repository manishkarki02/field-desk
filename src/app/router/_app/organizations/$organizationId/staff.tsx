import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/features/permissions";
import { StaffListPage } from "@/features/staff";

export const Route = createFileRoute(
  "/_app/organizations/$organizationId/staff",
)({
  beforeLoad: () => requirePermission("staff.manage"),
  component: OrganizationStaffRoute,
});

function OrganizationStaffRoute() {
  const { organizationId } = Route.useParams();
  return <StaffListPage organizationId={organizationId} />;
}
