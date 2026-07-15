import type { PermissionKey } from "./types";

/**
 * Permissions offered in the role editor, grouped by resource.
 * Permission management itself is intentionally absent: it belongs to
 * the Super Admin alone and can't be granted or revoked from the UI.
 */
export const editablePermissionGroups: Array<{
  label: string;
  permissions: Array<{ key: PermissionKey; label: string }>;
}> = [
  {
    label: "Tickets",
    permissions: [
      { key: "tickets.view", label: "View" },
      { key: "tickets.create", label: "Create" },
      { key: "tickets.edit", label: "Update status" },
      { key: "tickets.edit_details", label: "Edit details" },
      { key: "tickets.assign", label: "Assign" },
      { key: "tickets.delete", label: "Delete" },
    ],
  },
  {
    label: "Staff",
    permissions: [{ key: "staff.manage", label: "Manage" }],
  },
  {
    label: "Organizations",
    permissions: [{ key: "organizations.manage", label: "Manage" }],
  },
  {
    label: "Analytics",
    permissions: [{ key: "analytics.view", label: "View" }],
  },
];

export const editablePermissionKeys = new Set<PermissionKey>(
  editablePermissionGroups.flatMap((group) =>
    group.permissions.map((permission) => permission.key),
  ),
);
