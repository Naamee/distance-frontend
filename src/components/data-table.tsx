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
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const { loading } = useItemStore();
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
                      className="text-amber-600 font-bold"
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
            {loading &&
              [...Array(10)].map((_, index) => (
                <TableRow key={index} className="border-amber-600/40">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-5.5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* Show data rows when not loading, or 'no result' text if no data */}
            {!loading && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-amber-600/40"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !loading && (
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

      <div className="flex items-center justify-center space-x-2 py-4 gap-3">
        <Button
          variant="outline"
          className="text-white hover:text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400   disabled:border-gray-300"
          size="sm"
          title="Previous page"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 1}
        >
          <ArrowLeft />
          <span className="sr-only">Previous Page</span>
        </Button>
        <p>
          {pageIndex} of {pageSize}
        </p>
        <Button
          variant="outline"
          className="text-white hover:text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400  disabled:border-gray-300"
          size="sm"
          title="Next page"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex == pageSize}
        >
          <ArrowRight />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
}
