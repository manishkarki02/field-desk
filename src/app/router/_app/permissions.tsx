import { createFileRoute } from "@tanstack/react-router";
import { PermissionsPage, requirePermission } from "@/features/permissions";

export const Route = createFileRoute("/_app/permissions")({
  beforeLoad: () => requirePermission("permissions.manage"),
  component: PermissionsPage,
});
