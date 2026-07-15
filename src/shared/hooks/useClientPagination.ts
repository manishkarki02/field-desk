import { useMemo, useState } from "react";

/**
 * Client-side pagination over an in-memory list, shaped to plug straight
 * into `DataTablePagination`.
 */
export function useClientPagination<T>(rows: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage, pageSize],
  );

  return {
    pageRows,
    paginationProps: {
      page: currentPage,
      pageSize,
      totalItems: rows.length,
      onPageChange: setPage,
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        setPage(1);
      },
    },
  };
}
