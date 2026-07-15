import type { ReactNode } from "react";

type ListToolbarProps = {
  /** Right-aligned actions, typically the permission-gated create button. */
  actions?: ReactNode;
};

/**
 * Action row at the top of the list content area. The page title and
 * description live in the app topbar (via `usePageHeader`), not here.
 */
export function ListToolbar({ actions }: ListToolbarProps) {
  if (!actions) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {actions}
    </div>
  );
}
