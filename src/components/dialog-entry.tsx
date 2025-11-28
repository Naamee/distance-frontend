import { toast } from "sonner";
import { useState } from "react";
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
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsUp,
  ChevronsDown,
  ArrowLeft,
  AlertCircleIcon,
} from "lucide-react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "react-responsive";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { type EntryDialogProps } from "@/types";
import { useEntryStore } from "@/stores/entryStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OperationTypes = "menu" | "delete" | "edit";
type OperationItems = "label" | "description";

export default function EntryDialog({ itemId, isLast, entry }: EntryDialogProps) {
  const isMobile = useMediaQuery({ maxWidth: 425 }) ? null : 10
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [details, setDetails] = useState({
    type: entry.type,
    quantity: entry.quantity,
  });
  const [currentOperation, setCurrentOperation] =
    useState<OperationTypes>("menu");
  const { deleteEntry, updateEntry, fetchItemEntries } = useEntryStore();

  const operations: Record<
    Exclude<OperationTypes, "menu">,
    Record<OperationItems, string>
  > = {
    edit: {
      label: "Edit Entry",
      description: "Update the entry details.",
    },
    delete: {
      label: "Delete Entry",
      description: "This action cannot be undone.",
    },
  };
  const usageTypes: Record<string, string> = {
    add: "Add Stock",
    used: "Deduct From Stock",
  };

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
    if (!open) {
      setCurrentOperation("menu");
      setLocalError(null);
    }
  };

  const submit = (operation: OperationTypes) => async () => {
    setLoading(true);
    if (operation === "delete") {
      const success = await deleteEntry(entry.id);
      if (success) {
        setOpen(false);
        toast.success("Entry deleted!");
      }
    }
    if (operation === "edit") {
      const message = await updateEntry(entry.id, details);
      if (message) setLocalError(message);
      if (!message) {
        setOpen(false);
        setLocalError(null);
        toast.success("Item updated!");
      }
    }
    fetchItemEntries(itemId, 1, isMobile);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Item
          className={`relative bg-white hover:bg-white/30 active:bg-white/40 rounded-none
                    ${isLast ? "" : "border-amber-600/10"} `}
        >
          <ItemContent>
            <ItemDescription className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                {entry.type === "add" ? (
                  <ChevronsUp className="text-green-600" />
                ) : (
                  <ChevronsDown className="text-rose-600" />
                )}
                <span>Qty: {entry.quantity}</span>
              </div>
              {new Date(entry.date).toLocaleDateString("en-GB")}
            </ItemDescription>
          </ItemContent>
          <ItemActions />
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
            {Object.entries(operations).map(([key, type]) => (
              <Button
                key={key}
                onClick={() => setCurrentOperation(key as OperationTypes)}
                className={`font-bold border ${getColors(key)}`}
              >
                {type.label}
              </Button>
            ))}
          </>
        )}

        {currentOperation === "edit" && (
          <>
            <Field>
              <Select
                value={details.type}
                onValueChange={(type) => setDetails({ ...details, type })}
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
                value={details.quantity}
                onChange={(quantity) =>
                  setDetails({
                    ...details,
                    quantity: Number(quantity.target.value),
                  })
                }
              />
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
          <Button
            onClick={submit("delete")}
            className="w-full md:text-base font-bold border hover:bg-gradient-to-b bg-rose-600/80 border-rose-600 hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500"
            variant="destructive"
          >
            {loading ? <Spinner /> : null}
            Delete Entry
          </Button>
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
