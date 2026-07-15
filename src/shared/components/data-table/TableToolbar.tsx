import type { ReactNode } from "react";

type TableToolbarProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export function TableToolbar({ left, right }: TableToolbarProps) {
  if (!left && !right) return null;

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">{left}</div>
      <div className="flex flex-wrap items-center gap-2">{right}</div>
    </div>
  );
}
