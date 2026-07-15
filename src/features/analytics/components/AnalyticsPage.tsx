import { ChartColumnIcon, LockIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/features/permissions";
import {
  ticketPriorities,
  ticketPriorityLabels,
  ticketStatuses,
  ticketStatusLabels,
} from "@/features/tickets";
import { TableEmptyState } from "@/shared/components/data-table";
import { usePageHeader } from "@/shared/hooks";

import { useTicketAnalytics } from "../hooks/useTicketAnalytics";

export function AnalyticsPage() {
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { data: analytics, isLoading } = useTicketAnalytics();
  usePageHeader(
    "Analytics",
    "Ticket volume and workload for the current scope.",
  );

  if (permissionsLoading || isLoading) {
    return (
      <main className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (!can("analytics.view")) {
    return (
      <main>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <TableEmptyState
            icon={<LockIcon className="size-8 opacity-25" />}
            title="Access restricted"
            description="You don't have permission to view analytics. Switch to a user with access or ask an administrator."
          />
        </div>
      </main>
    );
  }

  if (!analytics || analytics.total === 0) {
    return (
      <main>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <TableEmptyState
            icon={<ChartColumnIcon className="size-8 opacity-25" />}
            title="No ticket data"
            description="Analytics will appear once there are tickets in the current scope."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Total tickets" value={analytics.total} />
        {ticketStatuses.map((status) => (
          <StatTile
            key={status}
            label={ticketStatusLabels[status]}
            value={analytics.byStatus[status]}
          />
        ))}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by priority</CardTitle>
            <CardDescription>
              How the current scope's tickets are prioritized.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketPriorities.map((priority) => (
              <BarRow
                key={priority}
                label={ticketPriorityLabels[priority]}
                count={analytics.byPriority[priority]}
                max={Math.max(...ticketPriorities.map(
                  (candidate) => analytics.byPriority[candidate],
                ))}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workload by assignee</CardTitle>
            <CardDescription>
              Open and closed tickets currently assigned to each person.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.byAssignee.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tickets are assigned yet.
              </p>
            ) : (
              analytics.byAssignee.map((assignee) => (
                <BarRow
                  key={assignee.userId}
                  label={assignee.name}
                  count={assignee.count}
                  max={analytics.byAssignee[0].count}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="gap-1 py-4">
      <CardHeader className="pb-0">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

/** Single-measure horizontal bar: text labels carry identity and value. */
function BarRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const width = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate">{label}</span>
        <span className="font-medium tabular-nums">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
