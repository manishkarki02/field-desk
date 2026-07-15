import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/features/analytics";
import { requirePermission } from "@/features/permissions";

export const Route = createFileRoute("/_app/analytics")({
  beforeLoad: () => requirePermission("analytics.view"),
  component: AnalyticsPage,
});
