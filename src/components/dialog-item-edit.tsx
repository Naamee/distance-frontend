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
import { useMediaQuery } from "react-responsive";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pencil, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useItemStore } from "@/stores/itemStore";

interface CombinedItemData {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

export default function EditItemDialog({ item }: { item: CombinedItemData }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    category: "",
  });

  const { updateItemDetails, fetchCombinedItems } = useItemStore();
  const isSmallMobile = useMediaQuery({ maxWidth: 345 });
  const categories: Record<string, string> = {
    food: "Food",
    cleaning: "Cleaning Supplies",
    cosmetics: "Cosmetics",
    medicine: "Medicine",
    kitchen: "Kitchen / Cooking Essentials",
    hardware: "Hardware Tools",
  };


  // set locally to prevent unintended re-renders
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    const message = await updateItemDetails({
      id: item.id,
      name: details.name,
      category: details.category,
    });

    if (message) setLocalError(message);
    if (!message) {
      setOpen(false);
      setLocalError(null);
      fetchCombinedItems(1, { item: "", category: "", status: "" });
    }
    setLoading(false);
    toast.success("Item updated successfully!");
  };

  // reset state on close
  useEffect(() => {
    if (!open) {
      setDetails({ name: item.name, category: item.category });
      setLocalError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button size="sm" title="Edit item" className="rounded-none hover:text-white bg-white text-amber-600/80 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500">
            <Pencil/>
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
