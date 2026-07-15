import { useNavigate } from "@tanstack/react-router";
import {
  EyeIcon,
  PencilIcon,
  TicketIcon,
  Trash2Icon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useOrganizations } from "@/features/organizations";
import { useOrgScope } from "@/features/session";
import { useStaff } from "@/features/staff";
import {
  DataTable,
  DataTablePagination,
  TableEmptyState,
  type DataTableColumn,
} from "@/shared/components/data-table";
import {
  ListPageLayout,
  TableRowActions,
} from "@/shared/components/list-page";
import { useClientPagination } from "@/shared/hooks";
import { formatDate } from "@/shared/lib";

import type { Ticket } from "../types";
import { useTickets } from "../hooks/useTickets";
import { TicketAssignModal } from "./TicketAssignModal";
import { TicketDeleteConfirm } from "./TicketDeleteConfirm";
import { TicketFormModal } from "./TicketFormModal";
import { TicketPriorityBadge, TicketStatusBadge } from "./TicketBadges";

type TicketModal =
  | { type: "create" }
  | { type: "edit"; ticket: Ticket }
  | { type: "assign"; ticket: Ticket }
  | { type: "delete"; ticket: Ticket };

export function TicketsListPage() {
  const navigate = useNavigate();
  const scope = useOrgScope();
  const { data: tickets, isLoading, error } = useTickets();
  const { data: organizations } = useOrganizations();
  const { data: staff } = useStaff();
  const [modal, setModal] = useState<TicketModal | null>(null);

  const closeModal = () => setModal(null);

  const staffNames = useMemo(
    () => new Map((staff ?? []).map((member) => [member.id, member.name])),
    [staff],
  );
  const organizationNames = useMemo(
    () => new Map((organizations ?? []).map((org) => [org.id, org.name])),
    [organizations],
  );

  // The organization column only matters when viewing across orgs.
  const showOrganizationColumn = scope === null;

  const columns: DataTableColumn<Ticket>[] = [
    {
      id: "title",
      header: "Subject",
      cell: (ticket) => (
        <div className="min-w-48">
          <div className="font-medium">{ticket.title}</div>
          <div className="text-xs text-muted-foreground">{ticket.id}</div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (ticket) => <TicketStatusBadge status={ticket.status} />,
    },
    {
      id: "priority",
      header: "Priority",
      cell: (ticket) => <TicketPriorityBadge priority={ticket.priority} />,
    },
    ...(showOrganizationColumn
      ? [
          {
            id: "organization",
            header: "Organization",
            cell: (ticket) =>
              organizationNames.get(ticket.organizationId) ??
              ticket.organizationId,
          } satisfies DataTableColumn<Ticket>,
        ]
      : []),
    {
      id: "assignee",
      header: "Assignee",
      cell: (ticket) =>
        ticket.assigneeId ? (
          (staffNames.get(ticket.assigneeId) ?? "Unknown")
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        ),
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (ticket) => formatDate(ticket.createdAt),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (ticket) => (
        <TableRowActions
          actions={[
            {
              label: "View",
              icon: EyeIcon,
              permission: "tickets.view",
              onSelect: () =>
                navigate({
                  to: "/tickets/$ticketId",
                  params: { ticketId: ticket.id },
                }),
            },
            {
              label: "Edit",
              icon: PencilIcon,
              permission: "tickets.edit",
              onSelect: () => setModal({ type: "edit", ticket }),
            },
            {
              label: "Assign",
              icon: UserRoundPlusIcon,
              permission: "tickets.assign",
              onSelect: () => setModal({ type: "assign", ticket }),
            },
            {
              label: "Delete",
              icon: Trash2Icon,
              permission: "tickets.delete",
              destructive: true,
              onSelect: () => setModal({ type: "delete", ticket }),
            },
          ]}
        />
      ),
    },
  ];

  const { pageRows, paginationProps } = useClientPagination(tickets ?? []);

  return (
    <ListPageLayout
      title="Tickets"
      description="Support tickets in the current organization scope."
      viewPermission="tickets.view"
      createAction={{
        label: "Create ticket",
        permission: "tickets.create",
        onClick: () => setModal({ type: "create" }),
      }}
    >
      <DataTable
        rows={pageRows}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        isLoading={isLoading}
        error={error}
        pagination={<DataTablePagination {...paginationProps} />}
        emptyState={
          <TableEmptyState
            icon={<TicketIcon className="size-8 opacity-25" />}
            title="No tickets yet"
            description="Tickets in the current organization scope will show up here."
          />
        }
      />

      {modal?.type === "create" ? (
        <TicketFormModal open onOpenChange={closeModal} />
      ) : null}
      {modal?.type === "edit" ? (
        <TicketFormModal open onOpenChange={closeModal} ticket={modal.ticket} />
      ) : null}
      {modal?.type === "assign" ? (
        <TicketAssignModal
          open
          onOpenChange={closeModal}
          ticket={modal.ticket}
        />
      ) : null}
      {modal?.type === "delete" ? (
        <TicketDeleteConfirm
          open
          onOpenChange={closeModal}
          ticket={modal.ticket}
        />
      ) : null}
    </ListPageLayout>
  );
}
