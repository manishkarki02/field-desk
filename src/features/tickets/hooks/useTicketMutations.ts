import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignTicket,
  createTicket,
  deleteTicket,
  updateTicket,
  type TicketUpdateInput,
} from "../api/ticketsService";
import { ticketsQueryKey } from "./useTickets";

function useInvalidateTickets() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ticketsQueryKey });
    // Org ticket counts and analytics are both derived from tickets.
    void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    void queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };
}

export function useCreateTicket() {
  const invalidate = useInvalidateTickets();
  return useMutation({ mutationFn: createTicket, onSuccess: invalidate });
}

export function useUpdateTicket() {
  const invalidate = useInvalidateTickets();
  return useMutation({
    mutationFn: ({
      ticketId,
      input,
    }: {
      ticketId: string;
      input: TicketUpdateInput;
    }) => updateTicket(ticketId, input),
    onSuccess: invalidate,
  });
}

export function useAssignTicket() {
  const invalidate = useInvalidateTickets();
  return useMutation({
    mutationFn: ({
      ticketId,
      assigneeId,
    }: {
      ticketId: string;
      assigneeId: string | null;
    }) => assignTicket(ticketId, assigneeId),
    onSuccess: invalidate,
  });
}

export function useDeleteTicket() {
  const invalidate = useInvalidateTickets();
  return useMutation({ mutationFn: deleteTicket, onSuccess: invalidate });
}
