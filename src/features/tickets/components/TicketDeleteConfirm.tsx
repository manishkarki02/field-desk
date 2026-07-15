import { ConfirmDialog } from "@/shared/components/modal";
import type { Ticket } from "../types";
import { useDeleteTicket } from "../hooks/useTicketMutations";

type TicketDeleteConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
};

export function TicketDeleteConfirm({
  open,
  onOpenChange,
  ticket,
}: TicketDeleteConfirmProps) {
  const deleteTicket = useDeleteTicket();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete ticket?"
      description={`“${ticket.title}” will be permanently deleted. This cannot be undone.`}
      confirmLabel="Delete ticket"
      isPending={deleteTicket.isPending}
      error={deleteTicket.error?.message}
      onConfirm={() =>
        deleteTicket.mutate(ticket.id, { onSuccess: () => onOpenChange(false) })
      }
    />
  );
}
