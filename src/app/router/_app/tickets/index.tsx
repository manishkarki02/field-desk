import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/features/permissions";
import { TicketsListPage } from "@/features/tickets";

export const Route = createFileRoute("/_app/tickets/")({
  beforeLoad: () => requirePermission("tickets.view"),
  component: TicketsListPage,
});
