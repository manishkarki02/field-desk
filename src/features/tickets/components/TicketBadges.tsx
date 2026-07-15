import { Badge } from "@/components/ui/badge";
import {
  ticketPriorityLabels,
  ticketStatusLabels,
  type TicketPriority,
  type TicketStatus,
} from "../types";

const statusVariants: Record<
  TicketStatus,
  "default" | "secondary" | "outline"
> = {
  open: "default",
  in_progress: "secondary",
  resolved: "outline",
  closed: "outline",
};

const priorityVariants: Record<
  TicketPriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Badge variant={statusVariants[status]}>{ticketStatusLabels[status]}</Badge>;
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge variant={priorityVariants[priority]}>
      {ticketPriorityLabels[priority]}
    </Badge>
  );
}
