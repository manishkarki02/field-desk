import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizations } from "@/features/organizations";
import { useImpersonationUsers } from "@/features/session";
import { TableEmptyState } from "@/shared/components/data-table";
import { usePageHeader } from "@/shared/hooks";
import { formatDate } from "@/shared/lib";

import { useTicket } from "../hooks/useTickets";
import { TicketPriorityBadge, TicketStatusBadge } from "./TicketBadges";

export function TicketDetailsPage({ ticketId }: { ticketId: string }) {
  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const { data: organizations } = useOrganizations();
  const { data: users } = useImpersonationUsers();
  usePageHeader("Ticket details", ticketId);

  const userNames = useMemo(
    () => new Map((users ?? []).map((user) => [user.id, user.name])),
    [users],
  );

  if (isLoading) {
    return (
      <main className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="space-y-4">
        <BackToTickets />
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <TableEmptyState
            icon={<LockIcon className="size-8 opacity-25" />}
            title="Ticket unavailable"
            description={
              error instanceof Error
                ? error.message
                : "This ticket does not exist."
            }
          />
        </div>
      </main>
    );
  }

  const meta: Array<{ label: string; value: string }> = [
    {
      label: "Organization",
      value:
        organizations?.find((org) => org.id === ticket.organizationId)?.name ??
        ticket.organizationId,
    },
    {
      label: "Assignee",
      value: ticket.assigneeId
        ? (userNames.get(ticket.assigneeId) ?? "Unknown")
        : "Unassigned",
    },
    {
      label: "Created by",
      value: userNames.get(ticket.createdById) ?? "Unknown",
    },
    { label: "Created", value: formatDate(ticket.createdAt) },
    { label: "Last updated", value: formatDate(ticket.updatedAt) },
  ];

  return (
    <main className="space-y-4">
      <BackToTickets />
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
          <CardTitle className="text-xl">{ticket.title}</CardTitle>
          <CardDescription>{ticket.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="max-w-prose text-sm leading-relaxed">
            {ticket.description}
          </p>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}

function BackToTickets() {
  return (
    <Button variant="ghost" size="sm" render={<Link to="/tickets" />}>
      <ArrowLeftIcon />
      Back to tickets
    </Button>
  );
}
