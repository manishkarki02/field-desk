import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { FormModal } from "@/shared/components/modal";

import {
  editablePermissionGroups,
  editablePermissionKeys,
} from "../editablePermissions";
import type { PermissionKey, Role } from "../types";
import { roleLabels } from "../types";
import { useRolePermissions } from "../hooks/useRolePermissions";
import { useUpdateRolePermissions } from "../hooks/useUpdateRolePermissions";

type RolePermissionsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
};

/** "Edit permissions for <Role>": grouped checkboxes, saved as one batch. */
export function RolePermissionsModal({
  open,
  onOpenChange,
  role,
}: RolePermissionsModalProps) {
  const { data: rolePermissions } = useRolePermissions();
  const updateRolePermissions = useUpdateRolePermissions();
  const [draft, setDraft] = useState<Set<PermissionKey>>(
    () => new Set(rolePermissions?.[role] ?? []),
  );

  const togglePermission = (key: PermissionKey) => {
    setDraft((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit permissions for ${roleLabels[role]}`}
      description="Changes apply everywhere immediately after saving, no reload needed."
      submitLabel="Save"
      isPending={updateRolePermissions.isPending}
      error={updateRolePermissions.error?.message}
      onSubmit={(event) => {
        event.preventDefault();
        // Keys hidden from the editor (permissions.manage) are preserved.
        const hidden = (rolePermissions?.[role] ?? []).filter(
          (key) => !editablePermissionKeys.has(key),
        );
        updateRolePermissions.mutate(
          {
            role,
            permissions: [
              ...hidden,
              ...[...draft].filter((key) => editablePermissionKeys.has(key)),
            ],
          },
          { onSuccess: () => onOpenChange(false) },
        );
      }}
    >
      {editablePermissionGroups.map((group) => (
        <div key={group.label} className="space-y-2">
          <div className="text-sm font-medium">{group.label}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {group.permissions.map((permission) => (
              <label
                key={permission.key}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={draft.has(permission.key)}
                  onCheckedChange={() => togglePermission(permission.key)}
                />
                {permission.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </FormModal>
  );
}
