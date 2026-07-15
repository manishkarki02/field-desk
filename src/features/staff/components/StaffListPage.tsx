import {
  PencilIcon,
  ShieldIcon,
  UserRoundXIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useOrganizations } from "@/features/organizations";
import { roleLabels } from "@/features/permissions";
import { useOrgScope } from "@/features/session";
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

import type { User } from "../types";
import { useStaff } from "../hooks/useStaff";
import { StaffFormModal } from "./StaffFormModal";
import { StaffRemoveConfirm } from "./StaffRemoveConfirm";
import { StaffRoleChangeModal } from "./StaffRoleChangeModal";

type StaffModal =
  | { type: "create" }
  | { type: "edit"; member: User }
  | { type: "role"; member: User }
  | { type: "remove"; member: User };

type StaffListPageProps = {
  /** Pins the list to one organization (per-organization staff page). */
  organizationId?: string;
};

export function StaffListPage({ organizationId }: StaffListPageProps) {
  const scope = useOrgScope();
  const { data: staff, isLoading, error } = useStaff(organizationId);
  const { data: organizations } = useOrganizations();
  const [modal, setModal] = useState<StaffModal | null>(null);

  const closeModal = () => setModal(null);

  const organizationNames = useMemo(
    () => new Map((organizations ?? []).map((org) => [org.id, org.name])),
    [organizations],
  );

  const pinnedOrganizationName = organizationId
    ? organizationNames.get(organizationId)
    : undefined;

  // The organization column only matters when viewing across orgs.
  const showOrganizationColumn = !organizationId && scope === null;

  const columns: DataTableColumn<User>[] = [
    {
      id: "name",
      header: "Name",
      cell: (member) => <span className="font-medium">{member.name}</span>,
    },
    {
      id: "email",
      header: "Email",
      cell: (member) => (
        <span className="text-muted-foreground">{member.email}</span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (member) => (
        <Badge variant="secondary">{roleLabels[member.role]}</Badge>
      ),
    },
    ...(showOrganizationColumn
      ? [
          {
            id: "organization",
            header: "Organization",
            cell: (member) =>
              member.organizationId
                ? (organizationNames.get(member.organizationId) ??
                  member.organizationId)
                : "Platform",
          } satisfies DataTableColumn<User>,
        ]
      : []),
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      cell: (member) => (
        <TableRowActions
          actions={[
            {
              label: "Edit",
              icon: PencilIcon,
              permission: "staff.manage",
              onSelect: () => setModal({ type: "edit", member }),
            },
            {
              label: "Change role",
              icon: ShieldIcon,
              permission: "staff.manage",
              onSelect: () => setModal({ type: "role", member }),
            },
            {
              label: "Remove",
              icon: UserRoundXIcon,
              permission: "staff.manage",
              destructive: true,
              onSelect: () => setModal({ type: "remove", member }),
            },
          ]}
        />
      ),
    },
  ];

  const { pageRows, paginationProps } = useClientPagination(staff ?? []);

  return (
    <ListPageLayout
      title={
        pinnedOrganizationName ? `Staff · ${pinnedOrganizationName}` : "Staff"
      }
      description="Organization members and their roles."
      viewPermission="staff.manage"
      createAction={{
        label: "Add staff",
        permission: "staff.manage",
        onClick: () => setModal({ type: "create" }),
      }}
    >
      <DataTable
        rows={pageRows}
        columns={columns}
        getRowId={(member) => member.id}
        isLoading={isLoading}
        error={error}
        pagination={<DataTablePagination {...paginationProps} />}
        emptyState={
          <TableEmptyState
            icon={<UsersIcon className="size-8 opacity-25" />}
            title="No staff yet"
            description="Add the first staff member to get started."
          />
        }
      />

      {modal?.type === "create" ? (
        <StaffFormModal
          open
          onOpenChange={closeModal}
          organizationId={organizationId}
        />
      ) : null}
      {modal?.type === "edit" ? (
        <StaffFormModal open onOpenChange={closeModal} member={modal.member} />
      ) : null}
      {modal?.type === "role" ? (
        <StaffRoleChangeModal
          open
          onOpenChange={closeModal}
          member={modal.member}
        />
      ) : null}
      {modal?.type === "remove" ? (
        <StaffRemoveConfirm
          open
          onOpenChange={closeModal}
          member={modal.member}
        />
      ) : null}
    </ListPageLayout>
  );
}
