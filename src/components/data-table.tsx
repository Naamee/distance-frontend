import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { Button } from "@/components/ui/button";
import { useItemStore } from "@/stores/itemStore";
import { useEntryStore } from "@/stores/entryStore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type DataTableProps, type NavigationBtns } from "@/types";

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const { loading } = useItemStore();
  const { loading: entryLoading } = useEntryStore();
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const newPage =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize }).pageIndex
          : updater.pageIndex;
      onPageChange(newPage);
    },
  });

  const navigationBtns: NavigationBtns[] = [
    {
      icon: ArrowLeft,
      title: "Previous page",
      onClick: () => onPageChange(pageIndex - 1),
      disabled: pageIndex === 1,
    },
    {
      icon: ArrowRight,
      title: "Next page",
      onClick: () => onPageChange(pageIndex + 1),
      disabled: pageIndex == pageSize,
    },
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-sm border border-amber-600/40">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-amber-600/40" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`text-amber-600 font-bold ${['name', 'type'].includes(header.id) ? 'pl-5' : header.id == 'actions' ? 'pr-5' : ''}`}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Show loading skeletons when loading */}
            {(loading || entryLoading) &&
              [...Array(10)].map((_, index) => (
                <TableRow key={index} className="border-amber-600/40">
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-5.5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Show data rows when not loading, or 'no result' text if no data */}
            {(!loading && !entryLoading) && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-amber-600/40"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={`${cell.id.endsWith('name') || cell.id.endsWith('type') ? 'pl-5' : cell.id.endsWith('actions') ? 'pr-5' : ''}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (!loading && !entryLoading) && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        {navigationBtns.map((btn, index) => (
          <div key={index} className="flex items-center gap-5">
            <Button
              variant="outline"
              className="text-white hover:text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600
            active:from-amber-400 active:to-amber-500 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400   disabled:border-gray-300"
              size="sm"
              title={btn.title}
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              <btn.icon />
              <span className="sr-only">{btn.title}</span>
            </Button>

            {index === 0 ? (
              <p>
                Page {pageIndex} of {pageSize}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
