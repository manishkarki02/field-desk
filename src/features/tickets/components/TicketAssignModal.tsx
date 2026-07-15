import { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels } from "@/features/permissions";
import { useStaff } from "@/features/staff";
import { FormModal } from "@/shared/components/modal";

import type { Ticket } from "../types";
import { useAssignTicket } from "../hooks/useTicketMutations";

const UNASSIGNED = "unassigned";

type TicketAssignModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket;
};

/** Assignment picker: staff of the ticket's organization, or unassigned. */
export function TicketAssignModal({
  open,
  onOpenChange,
  ticket,
}: TicketAssignModalProps) {
  const { data: staff, isLoading } = useStaff(ticket.organizationId);
  const assignTicket = useAssignTicket();
  const [assigneeId, setAssigneeId] = useState<string | null>(
    ticket.assigneeId,
  );

  const assignee = staff?.find((member) => member.id === assigneeId);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign ticket"
      description={`Choose who works on “${ticket.title}”.`}
      submitLabel="Assign"
      isPending={assignTicket.isPending}
      error={assignTicket.error?.message}
      onSubmit={(event) => {
        event.preventDefault();
        assignTicket.mutate(
          { ticketId: ticket.id, assigneeId },
          { onSuccess: () => onOpenChange(false) },
        );
      }}
    >
      <Field>
        <FieldLabel htmlFor="ticket-assignee">Assignee</FieldLabel>
        <Select
          value={assigneeId ?? UNASSIGNED}
          onValueChange={(value) =>
            setAssigneeId(value === UNASSIGNED ? null : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger id="ticket-assignee" className="w-full">
            <SelectValue>
              {assigneeId === null
                ? "Unassigned"
                : (assignee?.name ?? "Unknown user")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {staff?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <span>{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {roleLabels[member.role]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FormModal>
  );
}
