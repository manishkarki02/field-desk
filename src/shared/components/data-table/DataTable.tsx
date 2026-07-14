import type { MouseEvent, ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { TableEmptyState } from "./TableEmptyState";
import type { DataTableColumn } from "./table-types";

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  onRowSelect?: (row: T) => void;
  selectedRowId?: string | null;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  isLoading?: boolean;
  error?: unknown;
  emptyState?: ReactNode;
  loadingRowCount?: number;
  rowClassName?: (row: T) => string;
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const interactiveSelector =
  'button,a,input,select,textarea,[role="button"],[data-row-action="true"]';

function isInteractiveTarget(event: MouseEvent<HTMLTableRowElement>): boolean {
  return (
    event.target instanceof Element &&
    event.target.closest(interactiveSelector) !== null
  );
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  onRowSelect,
  selectedRowId,
  toolbar,
  pagination,
  isLoading = false,
  error,
  emptyState,
  loadingRowCount = 5,
  rowClassName,
}: DataTableProps<T>) {
  const showError = Boolean(error) && !isLoading;
  const showEmpty = !isLoading && !showError && rows.length === 0;

  return (
    <div className="w-full space-y-4">
      {toolbar}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "whitespace-nowrap text-muted-foreground",
                      alignClasses[column.align ?? "left"],
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: loadingRowCount }, (_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : showError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <span className="text-sm text-destructive">
                      Failed to load data.
                    </span>
                  </TableCell>
                </TableRow>
              ) : showEmpty ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="p-0 whitespace-normal"
                  >
                    {emptyState ?? (
                      <TableEmptyState
                        title="No results found"
                        description="Try adjusting your search or filters."
                      />
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const rowId = getRowId(row);
                  return (
                    <TableRow
                      key={rowId}
                      onClick={
                        onRowSelect
                          ? (event) => {
                              if (isInteractiveTarget(event)) return;
                              onRowSelect(row);
                            }
                          : undefined
                      }
                      className={cn(
                        "hover:bg-muted/50",
                        onRowSelect && "cursor-pointer",
                        rowId === selectedRowId &&
                          "bg-primary/5 ring-1 ring-inset ring-primary/20",
                        rowClassName?.(row),
                      )}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          className={cn(
                            "align-middle",
                            alignClasses[column.align ?? "left"],
                            column.className,
                          )}
                        >
                          {column.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {pagination}
    </div>
  );
}
