import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { DataTable } from "@/components/data-table";
import { useEntryStore } from "@/stores/entryStore";
import { type ColumnDef } from "@tanstack/react-table";
import { createFileRoute } from "@tanstack/react-router";
import EntryDialog from "@/components/dialog-entry";
import EditEntryDialog from "@/components/dialog-entry-edit";
import DeleteEntryDialog from "@/components/dialog-entry-delete";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { type FridgeEntryData } from "@/types";

export const Route = createFileRoute("/fridge-entries/$itemId")({
  parseParams: (params) => ({
    itemId: Number(params.itemId), // parse itemId as number
  }),
  component: FridgeEntries,
});

function FridgeEntries() {
  const itemId = Route.useParams().itemId;
  const [page, setPage] = useState<number>(1);
  const perPage = useMediaQuery({ maxWidth: 425 }) ? null : 10
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const { entries, fetchItemEntries } = useEntryStore();

  const columns: ColumnDef<FridgeEntryData>[] = [
    {
      accessorKey: "type",
      header: "type",
      cell: (info) => (
        <div title={info.getValue() as string}>
          {(info.getValue() as string) === "add" ? (
            <div className="flex items-center text-green-600 font-bold gap-1">
              <ChevronsUp className="text-green-600" />
              <p className="text-md tracking-wider">ADDED</p>
            </div>
          ) : (
            <div className="flex items-center text-rose-600 font-bold gap-1">
              <ChevronsDown className="text-rose-600" />
              <p className="text-md tracking-wider">USED</p>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div>{new Date(row.original.date).toLocaleDateString("en-GB")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <div className="flex border border-amber-500 bg-amber-500/20 rounded-md gap-0.5">
          <EditEntryDialog itemId={itemId} entry={row.original} />
          <DeleteEntryDialog itemId={itemId} entry={row.original} />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      await fetchItemEntries(itemId, page, perPage);
    })();
  }, [page]);

  return (
    <div
      className={`flex gap-10 justify-center mt-10 ${isMobile ? "mx-5 mb-6" : "mx-10"}`}
    >
      <div
        className={`bg-white border border-amber-500 p-10 transition-all duration-300 rounded-sm w-full h-full md:max-w-xl`}
      >
        {!isMobile && (
          <>
            <h1 className="mb-4 text-2xl font-bold text-amber-600">
              {entries.name} [{" "}
              <span className="text-gray-400 text-xl">{entries.category}</span>{" "}
              ]
            </h1>
            <DataTable
              columns={columns}
              data={entries.data || []}
              pageIndex={entries.pagination.page}
              pageSize={entries.pagination.total_pages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          </>
        )}

        {isMobile && (
          <>
                      <h1 className="mb-4 text-xl font-bold text-amber-600">
              {entries.name} [{" "}
              <span className="text-gray-400 text-lg">{entries.category}</span>{" "}
              ]
            </h1>
              <div className="flex flex-col max-h-[calc(100vh-22rem)] overflow-auto border border-amber-600/40 bg-amber-600/5 rounded-sm">
                {entries.data.map((entry, index) => (
                  <EntryDialog
                    key={index}
                    itemId={itemId}
                    isLast={index == entries.data.length - 1}
                    entry={entry}
                  />
                ))}
              </div>
              </>
        )}
      </div>
    </div>
  );
}
