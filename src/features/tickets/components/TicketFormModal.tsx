import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useOrganizations } from "@/features/organizations";
import { roleLabels, usePermissions } from "@/features/permissions";
import { useOrgScope } from "@/features/session";
import { useStaff } from "@/features/staff";
import { FormModal } from "@/shared/components/modal";

import {
  ticketPriorities,
  ticketPriorityLabels,
  ticketStatuses,
  ticketStatusLabels,
  type Ticket,
} from "../types";
import {
  useCreateTicket,
  useUpdateTicket,
} from "../hooks/useTicketMutations";

const UNASSIGNED = "unassigned";

const ticketFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  priority: z.enum(ticketPriorities),
  status: z.enum(ticketStatuses),
  organizationId: z.string().min(1, "Select an organization."),
  assigneeId: z.string().nullable(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

type TicketFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the modal edits this ticket instead of creating one. */
  ticket?: Ticket;
};

/**
 * One form for both create and edit. Fields are individually
 * permission-gated: detail fields need `tickets.edit_details` when
 * editing (a status-only role sees just the status field), and the
 * assignee picker on create needs `tickets.assign`.
 */
export function TicketFormModal({
  open,
  onOpenChange,
  ticket,
}: TicketFormModalProps) {
  const scope = useOrgScope();
  const { can } = usePermissions();
  const { data: organizations } = useOrganizations();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();

  // Platform users viewing all organizations must pick one on create.
  const showOrganizationField = !ticket && scope === null;
  const canEditDetails = !ticket || can("tickets.edit_details");
  const showAssigneeField = !ticket && can("tickets.assign");

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: ticket
      ? {
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          organizationId: ticket.organizationId,
          assigneeId: ticket.assigneeId,
        }
      : {
          title: "",
          description: "",
          priority: "medium",
          status: "open",
          organizationId: scope ?? "",
          assigneeId: null,
        },
  });

  const selectedOrganizationId = useWatch({
    control,
    name: "organizationId",
  });
  const { data: staff, isLoading: staffLoading } = useStaff(
    showAssigneeField && selectedOrganizationId
      ? selectedOrganizationId
      : undefined,
  );

  const onSubmit = handleSubmit((values) => {
    const options = { onSuccess: () => onOpenChange(false) };
    if (ticket) {
      updateTicket.mutate(
        {
          ticketId: ticket.id,
          input: {
            title: values.title,
            description: values.description,
            status: values.status,
            priority: values.priority,
          },
        },
        options,
      );
    } else {
      createTicket.mutate(
        {
          organizationId: values.organizationId,
          title: values.title,
          description: values.description,
          priority: values.priority,
          assigneeId: values.assigneeId,
        },
        options,
      );
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={ticket ? "Edit ticket" : "Create ticket"}
      description={
        ticket
          ? canEditDetails
            ? "Update the ticket's details."
            : "Update the ticket's status."
          : "File a new support ticket."
      }
      submitLabel={ticket ? "Save changes" : "Create ticket"}
      isPending={createTicket.isPending || updateTicket.isPending}
      error={(ticket ? updateTicket.error : createTicket.error)?.message}
      onSubmit={onSubmit}
    >
      {canEditDetails ? (
        <>
          <Field>
            <FieldLabel htmlFor="ticket-title">Title</FieldLabel>
            <Input
              id="ticket-title"
              placeholder="Short summary of the issue"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="ticket-description">Description</FieldLabel>
            <Textarea
              id="ticket-description"
              rows={4}
              placeholder="What happened, and what did you expect?"
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>
        </>
      ) : null}

      {showOrganizationField ? (
        <Controller
          control={control}
          name="organizationId"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="ticket-organization">
                Organization
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Assignees are per-organization.
                  setValue("assigneeId", null);
                }}
              >
                <SelectTrigger id="ticket-organization" className="w-full">
                  <SelectValue>
                    {organizations?.find((org) => org.id === field.value)
                      ?.name ?? "Select an organization"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.organizationId]} />
            </Field>
          )}
        />
      ) : null}

      {showAssigneeField ? (
        <Controller
          control={control}
          name="assigneeId"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="ticket-assignee">Assignee</FieldLabel>
              <Select
                value={field.value ?? UNASSIGNED}
                onValueChange={(value) =>
                  field.onChange(value === UNASSIGNED ? null : value)
                }
                disabled={!selectedOrganizationId || staffLoading}
              >
                <SelectTrigger id="ticket-assignee" className="w-full">
                  <SelectValue>
                    {!selectedOrganizationId
                      ? "Select an organization first"
                      : field.value === null
                        ? "Unassigned"
                        : (staff?.find((member) => member.id === field.value)
                            ?.name ?? "Unknown user")}
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
          )}
        />
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        {canEditDetails ? (
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ticket-priority" className="w-full">
                    <SelectValue>
                      {ticketPriorityLabels[field.value]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ticketPriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {ticketPriorityLabels[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        ) : null}

        {ticket ? (
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ticket-status" className="w-full">
                    <SelectValue>{ticketStatusLabels[field.value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ticketStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {ticketStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        ) : null}
      </div>
    </FormModal>
  );
}
