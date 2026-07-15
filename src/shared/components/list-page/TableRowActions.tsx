import { MoreHorizontalIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions, type PermissionKey } from "@/features/permissions";

export type RowAction = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  /** Omit for actions available to anyone who can see the list. */
  permission?: PermissionKey;
  destructive?: boolean;
};

type TableRowActionsProps = {
  actions: RowAction[];
  triggerLabel?: string;
};

/**
 * Row-level action menu. Each action is individually permission-gated;
 * the whole menu disappears when none are allowed.
 */
export function TableRowActions({
  actions,
  triggerLabel = "Open row actions",
}: TableRowActionsProps) {
  const { can } = usePermissions();
  const visibleActions = actions.filter(
    (action) => !action.permission || can(action.permission),
  );

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={triggerLabel} />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            variant={action.destructive ? "destructive" : "default"}
            onClick={action.onSelect}
          >
            {action.icon ? <action.icon /> : null}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
