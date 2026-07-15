import { createFileRoute } from "@tanstack/react-router";
import { requirePermission } from "@/features/permissions";
import { TicketDetailsPage } from "@/features/tickets";

export const Route = createFileRoute("/_app/tickets/$ticketId")({
  beforeLoad: () => requirePermission("tickets.view"),
  component: TicketDetailsRoute,
});

function TicketDetailsRoute() {
  const { ticketId } = Route.useParams();
  return <TicketDetailsPage ticketId={ticketId} />;
}
