import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Field } from "@/components/ui/field";
import { type ItemDialogProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useItemStore } from "@/stores/itemStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OperationTypes = "usage" | "entries" | "edit" | "delete" | "menu";
type OperationItems = "label" | "description";

export default function ItemDialog({ isLast, item }: ItemDialogProps) {
  const isMobile = useMediaQuery({ maxWidth: 425 }) ? null : 8;
  const isSmallMobile = useMediaQuery({ maxWidth: 345 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] =
    useState<OperationTypes>("menu");
  const { fetchCombinedItems, updateQuantity, updateItemDetails, deleteItem } =
    useItemStore();

  const operations: Record<
    Exclude<OperationTypes, "menu">,
    Record<OperationItems, string>
  > = {
    usage: {
      label: "Record Usage",
      description: "Update the stock usage for this item.",
    },
    entries: {
      label: "View Entries",
      description: "View all stock entries for this item.",
    }, // dummy data for entries => actually handled by Link
    edit: {
      label: "Edit Item",
      description: "Update the item details.",
    },
    delete: {
      label: "Delete Item",
      description: "This action cannot be undone.",
    },
  };
  const usageTypes: Record<string, string> = {
    add: "Add Stock",
    used: "Deduct From Stock",
  };
  const categories: Record<string, string> = {
    food: "Food",
    cleaning: "Cleaning Supplies",
    cosmetics: "Cosmetics",
    medicine: "Medicine",
    kitchen: "Kitchen / Cooking Essentials",
    hardware: "Hardware Tools",
  };

  const [usage, setUsage] = useState({
    type: "add",
    quantity: "" as number | string,
  });
  const [details, setDetails] = useState({
    name: "",
    category: "",
  });

  const getColors = (operation: string) => {
    switch (operation) {
      case "delete":
        return "bg-rose-600/80 border-rose-600 hover:bg-gradient-to-b hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500";
      default:
        return "bg-amber-600/80 border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500";
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setCurrentOperation("menu");
  };

  const submit = (operation: OperationTypes) => async () => {
    setLoading(true);
    if (operation === "usage") {
      const message = await updateQuantity({
        id: item.id,
        type: usage.type,
        quantity: Number(usage.quantity),
      });

      if (message) setLocalError(message);
      if (!message) {
        setOpen(false);
        setLocalError(null);
        fetchCombinedItems(1, isMobile, { item: "", category: "", status: "" });
      }
      setLoading(false);
      toast.success(
        `Item ${usage.type === "add" ? "added to" : "deducted from"} stock!`
      );
    }

    if (operation === "edit") {
      const message = await updateItemDetails({
        id: item.id,
        name: details.name,
        category: details.category,
      });

      if (message) setLocalError(message);
      if (!message) {
        setOpen(false);
        setLocalError(null);
        fetchCombinedItems(1, isMobile, { item: "", category: "", status: "" });
      }
      setLoading(false);
      toast.success("Item updated!");
    }

    if (operation === "delete") {
      const success = await deleteItem(item.id);
      if (success) {
        setOpen(false);
        toast.success("Item deleted!");
        fetchCombinedItems(1, isMobile, { item: "", category: "", status: "" });
      }
    }
  };

  useEffect(() => {
    if (currentOperation === "edit") {
      setDetails({ name: item.name, category: item.category });
    }
  }, [currentOperation]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Item
          className={`relative bg-white hover:bg-white/30 active:bg-white/40 rounded-none
                    ${isLast ? "" : "border-amber-600/10"} `}
        >
          <ItemContent>
            <ItemTitle className="text-md">{item.name}</ItemTitle>
            <ItemDescription>
              <span>{item.category}</span>
              <span></span>
            </ItemDescription>
          </ItemContent>
          <ItemActions />
          <ItemFooter className="text-sm">
            <span>Qty: {item.quantity}</span>
            <span
              className={`border px-2 py-1 rounded-sm ${item.quantity > 0 ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}`}
            >
              {item.quantity > 0 ? "Available" : "Unavailable"}
            </span>
          </ItemFooter>
        </Item>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={currentOperation === "menu" ? "w-60" : "w-80"}
      >
        <DialogHeader>
          <DialogTitle className={currentOperation === "menu" ? "sr-only" : ""}>
            {currentOperation !== "menu" ? (
              <div className="relative flex items-center">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentOperation("menu")}
                  className="absolute left-0 text-amber-500 active:bg-amber-600/20 h-6 ml-3"
                >
                  <ArrowLeft />
                  Back
                </Button>

                <span className="mx-auto text-center">
                  {operations[currentOperation].label}
                </span>
              </div>
            ) : (
              "Actions"
            )}
          </DialogTitle>
          <DialogDescription className="mt-2">
            {currentOperation === "menu"
              ? "Choose an action to perform on the item."
              : operations[currentOperation].description}
          </DialogDescription>
        </DialogHeader>
        {currentOperation === "menu" && (
          <>
            {Object.entries(operations).map(([key, type]) =>
              key == "entries" ? (
                <Link key={key} to="/fridge-entries/$itemId" params={{ itemId: item.id }}>
                  <Button
                    className={`font-bold border w-full ${getColors(key)}`}
                  >
                    {type.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={key}
                  onClick={() => setCurrentOperation(key as OperationTypes)}
                  className={`font-bold border ${getColors(key)}`}
                >
                  {type.label}
                </Button>
              )
            )}
          </>
        )}

        {currentOperation == "usage" && (
          <>
            <Field>
              <Select
                value={usage.type}
                onValueChange={(type) => setUsage({ ...usage, type })}
              >
                <SelectTrigger className="!h-10 md:text-base px-4 flex items-center">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(usageTypes).map(([key, label]) => (
                    <SelectItem key={key} className="md:text-base" value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Input
                id="quantity"
                type="number"
                autoComplete="off"
                placeholder="Quantity"
                className="h-10 text-sm md:text-base px-4"
                value={usage.quantity}
                onChange={(quantity) =>
                  setUsage({ ...usage, quantity: quantity.target.value })
                }
              />
            </Field>

            <Button
              onClick={submit("usage")}
              disabled={loading}
              className="flex-1 md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
            >
              {loading ? <Spinner /> : null}
              Update
            </Button>
          </>
        )}

        {currentOperation === "edit" && (
          <>
            <Field>
              <Input
                id="name"
                autoComplete="off"
                placeholder="Item Name"
                className="h-10 text-sm md:text-base px-4"
                value={details.name}
                onChange={(name) =>
                  setDetails({ ...details, name: name.target.value })
                }
              />
            </Field>

            <Field>
              <Select
                value={details.category}
                onValueChange={(category) =>
                  setDetails({ ...details, category })
                }
              >
                <SelectTrigger className="!h-10 md:text-base">
                  <span
                    className={`${isSmallMobile && details.category === "Kitchen / Cooking Essentials" ? "block" : "flex"} truncate overflow-hidden text-ellipsis whitespace-nowrap w-full min-w-0`}
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

            <Button
              onClick={submit("edit")}
              disabled={loading}
              className="flex-1 md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
            >
              {loading ? <Spinner /> : null}
              Update
            </Button>
          </>
        )}

        {currentOperation === "delete" && (
          <>
            <Button
              onClick={submit("delete")}
              className="w-full md:text-base font-bold border hover:bg-gradient-to-b bg-rose-600/80 border-rose-600 hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500"
              variant="destructive"
            >
              {loading ? <Spinner /> : null}
              Delete Item
            </Button>
          </>
        )}

        {/* error alert */}
        {localError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{localError}</p>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
