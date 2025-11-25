import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pencil, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEntryStore } from "@/stores/entryStore";
import { type FridgeEntryData } from "@/types";

export default function EditEntryDialog({ itemId, entry }: { itemId: number; entry: FridgeEntryData }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({
    type: entry.type,
    quantity: entry.quantity,
  });

  const { updateEntry, fetchItemEntries } = useEntryStore();
  const usageTypes: Record<string, string> = {
    add: "Add Stock",
    used: "Deduct From Stock",
  };


  // set locally to prevent unintended re-renders
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    const message = await updateEntry(entry.id, details);

    if (message) setLocalError(message);
    if (!message) {
      setOpen(false);
      setLocalError(null);
      fetchItemEntries(itemId, 1);
    }
    setLoading(false);
    toast.success("Item updated successfully!");
  };

  // reset state on close
  useEffect(() => {
    if (!open) {
      setDetails({ type: entry.type, quantity: entry.quantity });
      setLocalError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
            size="sm"
            title="Edit item"
            className="rounded-e-none rounded-s-sm hover:text-white text-amber-600/80 bg-white hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
          >
            <Pencil />
            <span className="sr-only">Edit Item</span>
          </Button>
      </DialogTrigger>
      <DialogContent className="w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Item</DialogTitle>
          <DialogDescription className="text-base">
            Update the item details.
          </DialogDescription>
        </DialogHeader>

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
              setDetails({ ...details, quantity: Number(quantity.target.value) })
            }
          />
        </Field>

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

        <Button
          onClick={submit}
          disabled={loading}
          className="flex-1 md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
        >
          {loading ? <Spinner /> : null}
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}
