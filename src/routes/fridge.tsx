import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { type ColumnDef } from "@tanstack/react-table";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Field,
  FieldGroup,
  FieldSet
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import SearchFilters from "@/components/search-filters";
import { useItemStore } from "@/stores/itemStore";
import ItemDialog from "@/components/dialog-item";
import UsageDialog from "@/components/dialog-usage";
import DeleteItemDialog from "@/components/dialog-item-delete";
import EditItemDialog from "@/components/dialog-item-edit";
import { AlertCircleIcon, List } from "lucide-react";
import { type CombinedItemData } from "@/types";

export const Route = createFileRoute("/fridge")({
  component: Fridge,
});

function Fridge() {
  const [currentView, setView] = useState("all");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isSmallMobile = useMediaQuery({ maxWidth: 345 });
  const { postItem, fetchCombinedItems, combinedItems, error, loading } =
    useItemStore();

  const menuButtons: Record<string, string> = {
    new: "Add New",
    all: "All Items",
  };
  const categories: Record<string, string> = {
    food: "Food",
    cleaning: "Cleaning Supplies",
    cosmetics: "Cosmetics",
    medicine: "Medicine",
    kitchen: "Kitchen / Cooking Essentials",
    hardware: "Hardware Tools",
  };

  const [page, setPage] = useState<number>(1);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
  });
  const [filters, setFilters] = useState({
    item: "",
    category: "",
    status: "",
  });

  const columns: ColumnDef<CombinedItemData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <div className="w-50 truncate" title={info.getValue() as string}>
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => (
        <div className="w-50 truncate" title={info.getValue() as string}>
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        // derive status from quantity
        const quantity = row.getValue("quantity") as number;
        const status = quantity > 0 ? "Available" : "Unavailable";
        return (
          <Button
            variant="outline"
            size="sm"
            className={`border p-2 ${status === "Available" ? "px-4" : ""} ${quantity > 0 ? "border-green-600 text-green-600 hover:text-green-600" : "border-red-600 text-red-600 hover:text-red-600"}`}
          >
            {status}
          </Button>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <div  className="flex border border-amber-500 bg-amber-500/20 rounded-md gap-0.5">
          <UsageDialog item={row.original} />
          <Link to="/fridge-entries/$itemId" params={{ itemId: row.original.id }} >
            <Button size="sm" title="View Entries" className="rounded-none hover:text-white bg-white text-amber-600/80 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500">
            <List />
            <span className="sr-only">View Entries</span>
            </Button>
          </Link>
          <EditItemDialog item={row.original} />
          <DeleteItemDialog item={row.original} />
          </div>
        </div>
      ),
    },
  ];

  const submitItem = async () => {
    const success = await postItem(newItem);
    if (success) {
      // reset form
      setNewItem({ name: "", category: "" });
      setView("all");
      toast.success("Item added!");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCombinedItems(page, filters);
    })();
  }, [page, filters]);

  // Reset states when switching views
  useEffect(() => {
    if (currentView === "new") {
        setNewItem({ name: "", category: "" });
    }

    if (currentView === "all") {
      requestAnimationFrame(() => {
        setFilters({ item: "", category: "", status: "" });
        setPage(1);

      })
    }
  }, [currentView]);

  return (
    <div
      className={`flex gap-10 justify-center mt-10 ${isMobile ? "mx-3 mb-6" : "mx-10"}`}
    >
      <div
        className={`bg-white border border-amber-500 p-10 transition-all duration-300 rounded-sm w-full ${currentView === "all" ? "h-full md:max-w-6xl" : "md:max-w-md"} `}
      >
        {/* menu buttons */}
        <div className="flex justify-center h-10">
          {Object.entries(menuButtons).flatMap(([key, label], index, arr) => [
            <Button
              key={key}
              size="lg"
              onClick={() => setView(key)}
              className={`bg-transparent hover:bg-transparent rounded-none font-bold text-gray-300 md:text-lg hover:text-amber-400 ${
                currentView === key ? "text-amber-600" : ""
              }`}
            >
              {label}
            </Button>,
            // Insert separator in between buttons
            index < arr.length - 1 ? (
              <Separator key={`sep-${key}`} orientation="vertical" />
            ) : null,
          ])}
        </div>

        {currentView === "new" && (
          <div className="flex flex-col justify-end">
            <FieldSet className="my-4">
              <FieldGroup className="gap-3">
                <Field>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Item Name"
                    className="h-10 text-sm md:text-base px-4"
                    onChange={(name) =>
                      setNewItem({ ...newItem, name: name.target.value })
                    }
                  />
                </Field>

                <Field>
                  <Select
                    value={newItem.category}
                    onValueChange={(category) =>
                      setNewItem({ ...newItem, category })
                    }
                  >
                    <SelectTrigger className="!h-10 md:text-base">
                      <span
                        className={`${isSmallMobile && newItem.category === "Kitchen / Cooking Essentials" ? "block" : "flex"} truncate overflow-hidden text-ellipsis whitespace-nowrap w-full min-w-0`}
                      >
                        <SelectValue placeholder="Category" />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="md:text-base">
                      {Object.entries(categories).map(([key, label]) => (
                        <SelectItem
                          key={key}
                          className="md:text-base"
                          value={label}
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* error alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={submitItem}
              className="md:h-10 mt-2 md:text-base bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500 active:mt-3"
            >
              {loading ? <Spinner /> : null}
              Submit
            </Button>
          </div>
        )}

        {currentView === "all" && (
          <div>
            {
              <SearchFilters
                isMobile={isMobile}
                filters={filters}
                setFilters={setFilters}
              />
            }
            {!isMobile && (
              <DataTable
                columns={columns}
                data={combinedItems.data}
                pageIndex={combinedItems.pagination.page}
                pageSize={combinedItems.pagination.total_pages}
                onPageChange={(newPage: number) => setPage(newPage)}
              />
            )}

            {isMobile && (
              <div className="flex flex-col max-h-[calc(100vh-22rem)] overflow-auto border border-amber-600/40 bg-amber-600/5 rounded-sm">
                {combinedItems.data.map((item, index) => (
                  <ItemDialog
                    key={index}
                    isLast={index == combinedItems.data.length - 1}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
