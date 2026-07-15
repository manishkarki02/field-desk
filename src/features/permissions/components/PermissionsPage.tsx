import { LockIcon, PencilIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableEmptyState } from "@/shared/components/data-table";
import { usePageHeader } from "@/shared/hooks";

import {
  editablePermissionGroups,
  editablePermissionKeys,
} from "../editablePermissions";
import { allRoles, roleLabels, type Role } from "../types";
import { usePermissions } from "../hooks/usePermissions";
import { useRolePermissions } from "../hooks/useRolePermissions";
import { RolePermissionsModal } from "./RolePermissionsModal";

/** One card per role; editing opens the grouped-checkbox modal. */
export function PermissionsPage() {
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissions, isLoading } = useRolePermissions();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  usePageHeader(
    "Permissions",
    "What each role is allowed to do. Changes apply everywhere immediately, no reload needed.",
  );

  if (permissionsLoading || isLoading) {
    return (
      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-36 w-full" />
        ))}
      </main>
    );
  }

  if (!can("permissions.manage")) {
    return (
      <main>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <TableEmptyState
            icon={<LockIcon className="size-8 opacity-25" />}
            title="Access restricted"
            description="Only users who can manage permissions may edit roles."
          />
        </div>
      </main>
    );
  }

  const totalEditable = editablePermissionKeys.size;

  return (
    <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allRoles.map((role) => {
        const granted = (rolePermissions?.[role] ?? []).filter((key) =>
          editablePermissionKeys.has(key),
        );
        const grantedSet = new Set(granted);
        return (
          <Card key={role}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                <CardTitle>{roleLabels[role]}</CardTitle>
              </div>
              <CardDescription>
                {granted.length} of {totalEditable} permissions granted
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <dl className="space-y-1 text-sm">
                {editablePermissionGroups.map((group) => {
                  const names = group.permissions
                    .filter((permission) => grantedSet.has(permission.key))
                    .map((permission) => permission.label);
                  return (
                    <div key={group.label} className="flex gap-2">
                      <dt className="w-28 shrink-0 text-muted-foreground">
                        {group.label}
                      </dt>
                      <dd className="min-w-0 truncate">
                        {names.length > 0 ? names.join(", ") : "-"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEditingRole(role)}
              >
                <PencilIcon />
                Edit
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {editingRole ? (
        <RolePermissionsModal
          open
          onOpenChange={() => setEditingRole(null)}
          role={editingRole}
        />
      ) : null}
    </main>
  );
}
