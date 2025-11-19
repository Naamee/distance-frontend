import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { List, ChevronsDown, ChevronsUp } from "lucide-react";
import { DataTable } from "./data-table";
import { useEntryStore } from "@/stores/entryStore";
import { type ColumnDef } from "@tanstack/react-table";

interface combinedData {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

interface EntryData {
  id: number;
  type: string;
  quantity: number;
  date: string;
}

interface FridgeEntryData {
  id: number;
  type: string;
  quantity: number;
  date: string;
}

interface FridgeEntryResponse {
  name: string;
  data: FridgeEntryData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  }
}

interface props {
  page: number;
  setPage: (newPage: number) => void;
  item: combinedData;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function EntriesDialog({ page, setPage, item, open, onOpenChange } : props) {
  const { fetchItemEntries } = useEntryStore();


  const [localEntries, setLocalEntries] = useState<FridgeEntryResponse>({
    name: "",
    data: [],
    pagination: {
      page: 1,
      per_page: 10,
      total_items: 0,
      total_pages: 0,
    },
  });

  useEffect(() => {
    async function loadEntries() {
      const entriesData = await fetchItemEntries(item.id, page);
      if (entriesData) {
        setLocalEntries(entriesData);
      }
    }
    if (open) {
      loadEntries();
    }
  }, [page]);



  const columns: ColumnDef<EntryData>[] = [
    {
      accessorKey: "type",
      header: "type",
      cell: (info) => (
        <div title={info.getValue() as string}>
          {info.getValue() as string === "add" ?
              (
                <div className="flex items-center gap-1">
                  <ChevronsUp className="text-green-600" />
                  <p>ADD</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <ChevronsDown className="text-red-600" />
                  <p>USED</p>
                </div>
              ) }
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
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <div className="flex gap-2"></div>,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          title="View Entries"
          className="hover:text-white bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
        >
          <List />
          <span className="sr-only">View Entries</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">View Entries</DialogTitle>
          <DialogDescription className="text-base">
            {item.name} - {item.category}
          </DialogDescription>
        </DialogHeader>

        <DataTable
          columns={columns}
          data={localEntries.data || []}
          pageIndex={localEntries.pagination.page}
          pageSize={localEntries.pagination.total_pages}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      </DialogContent>
    </Dialog>
  );
}
