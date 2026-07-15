import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/features/permissions";
import { StaffListPage } from "@/features/staff";

export const Route = createFileRoute("/_app/staff")({
  beforeLoad: () => requirePermission("staff.manage"),
  component: StaffListPage,
});
