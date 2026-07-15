import { LockIcon, PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PermissionGate,
  usePermissions,
  type PermissionKey,
} from "@/features/permissions";
import { TableEmptyState } from "@/shared/components/data-table";
import { usePageHeader } from "@/shared/hooks";

import { ListToolbar } from "./ListToolbar";

type ListPageLayoutProps = {
  title: string;
  description?: string;
  /** Permission required to see this list at all. */
  viewPermission: PermissionKey;
  /** Primary toolbar action; rendered only with the given permission. */
  createAction?: {
    label: string;
    permission: PermissionKey;
    onClick: () => void;
  };
  /** Extra toolbar content rendered before the create button. */
  toolbarExtra?: ReactNode;
  children: ReactNode;
};

/**
 * Shared shell for every list page: publishes the title/description to
 * the app topbar, renders the gated create button above the feature's
 * table and modals, and handles the restricted-access state reactively,
 * revoking the view permission while the page is open swaps the table
 * for the restricted banner.
 */
export function ListPageLayout({
  title,
  description,
  viewPermission,
  createAction,
  toolbarExtra,
  children,
}: ListPageLayoutProps) {
  const { can, isLoading } = usePermissions();
  usePageHeader(title, description);

  if (isLoading) {
    return (
      <main className="space-y-4">
        <Skeleton className="ml-auto h-8 w-36" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (!can(viewPermission)) {
    return (
      <main>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <TableEmptyState
            icon={<LockIcon className="size-8 opacity-25" />}
            title="Access restricted"
            description="You don't have permission to view this page. Switch to a user with access or ask an administrator."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <ListToolbar
        actions={
          createAction || toolbarExtra ? (
            <>
              {toolbarExtra}
              {createAction ? (
                <PermissionGate permission={createAction.permission}>
                  <Button onClick={createAction.onClick}>
                    <PlusIcon />
                    {createAction.label}
                  </Button>
                </PermissionGate>
              ) : null}
            </>
          ) : null
        }
      />
      {children}
    </main>
  );
}
