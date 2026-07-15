import { useNavigate } from "@tanstack/react-router";
import { Building2Icon, PencilIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useState } from "react";

import { useSessionStore } from "@/features/session";
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

import type { Organization, OrganizationWithStats } from "../types";
import { useOrganizationsWithStats } from "../hooks/useOrganizations";
import { OrganizationDeleteConfirm } from "./OrganizationDeleteConfirm";
import { OrganizationFormModal } from "./OrganizationFormModal";

type OrganizationModal =
  | { type: "create" }
  | { type: "edit"; organization: Organization }
  | { type: "delete"; organization: Organization };

export function OrganizationsListPage() {
  const navigate = useNavigate();
  const setActiveOrganization = useSessionStore(
    (state) => state.setActiveOrganization,
  );
  const { data: organizations, isLoading, error } = useOrganizationsWithStats();
  const [modal, setModal] = useState<OrganizationModal | null>(null);

  const closeModal = () => setModal(null);

  const columns: DataTableColumn<OrganizationWithStats>[] = [
    {
      id: "name",
      header: "Name",
      cell: (organization) => (
        <div className="min-w-48">
          <div className="font-medium">{organization.name}</div>
          <div className="text-xs text-muted-foreground">{organization.id}</div>
        </div>
      ),
    },
    {
      id: "userCount",
      header: "Staff",
      align: "right",
      cell: (organization) => organization.userCount,
    },
    {
      id: "ticketCount",
      header: "Tickets",
      align: "right",
      cell: (organization) => organization.ticketCount,
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (organization) => formatDate(organization.createdAt),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (organization) => (
        <TableRowActions
          actions={[
            {
              label: "Manage staff",
              icon: UsersIcon,
              permission: "staff.manage",
              onSelect: () => {
                // Align the platform user's view scope with the org they
                // are drilling into, so the scoped staff fetch succeeds.
                setActiveOrganization(organization.id);
                void navigate({
                  to: "/organizations/$organizationId/staff",
                  params: { organizationId: organization.id },
                });
              },
            },
            {
              label: "Edit",
              icon: PencilIcon,
              permission: "organizations.manage",
              onSelect: () => setModal({ type: "edit", organization }),
            },
            {
              label: "Delete",
              icon: Trash2Icon,
              permission: "organizations.manage",
              destructive: true,
              onSelect: () => setModal({ type: "delete", organization }),
            },
          ]}
        />
      ),
    },
  ];

  const { pageRows, paginationProps } = useClientPagination(
    organizations ?? [],
  );

  return (
    <ListPageLayout
      title="Organizations"
      description="Customer organizations on the platform."
      viewPermission="organizations.manage"
      createAction={{
        label: "Create organization",
        permission: "organizations.manage",
        onClick: () => setModal({ type: "create" }),
      }}
    >
      <DataTable
        rows={pageRows}
        columns={columns}
        getRowId={(organization) => organization.id}
        isLoading={isLoading}
        error={error}
        pagination={<DataTablePagination {...paginationProps} />}
        emptyState={
          <TableEmptyState
            icon={<Building2Icon className="size-8 opacity-25" />}
            title="No organizations yet"
            description="Create the first organization to get started."
          />
        }
      />

      {modal?.type === "create" ? (
        <OrganizationFormModal open onOpenChange={closeModal} />
      ) : null}
      {modal?.type === "edit" ? (
        <OrganizationFormModal
          open
          onOpenChange={closeModal}
          organization={modal.organization}
        />
      ) : null}
      {modal?.type === "delete" ? (
        <OrganizationDeleteConfirm
          open
          onOpenChange={closeModal}
          organization={modal.organization}
        />
      ) : null}
    </ListPageLayout>
  );
}
