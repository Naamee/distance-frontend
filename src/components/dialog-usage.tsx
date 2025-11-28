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
import { ClipboardMinus, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useItemStore } from "@/stores/itemStore";
import { type CombinedItemData } from "@/types";
import { useMediaQuery } from "react-responsive";

export default function UsageDialog({ item }: { item: CombinedItemData }) {
  const isMobile = useMediaQuery({ maxWidth: 425 }) ? null : 8
  const [open, setOpen] = useState(false);
  const [usage, setUsage] = useState({
    type: "add",
    quantity: "" as number | string,
  });

  const usageTypes: Record<string, string> = {
    add: "Add Stock",
    used: "Deduct From Stock",
  };
  const { fetchCombinedItems, updateQuantity } = useItemStore();

  // set locally to prevent unintended re-renders
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
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
    toast.success(`Item ${usage.type === "add" ? "added to" : "deducted from"} stock!`);
  };

  // reset state on close
  useEffect(() => {
    if (!open) {
      setUsage({ type: "add", quantity: "" });
      setLocalError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          title="Record usage"
          className="rounded-e-none  hover:text-white bg-white text-amber-600/80 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
        >
          <ClipboardMinus />
          <span className="sr-only">Record usage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">Record Usage</DialogTitle>
          <DialogDescription className="text-base">
            Update the stock usage for this item.
          </DialogDescription>
        </DialogHeader>

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
