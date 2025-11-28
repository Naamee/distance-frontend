import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useItemStore } from "@/stores/itemStore";
import { useMediaQuery } from "react-responsive";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type CombinedItemData } from "@/types";


export default function DeleteItemDialog( { item } : { item: CombinedItemData } ) {
  const isMobile = useMediaQuery({ maxWidth: 425 }) ? null : 8
  const [dialogOpen, setDialogOpen] = useState(false);

  const { fetchCombinedItems, deleteItem, resetError, error, loading } = useItemStore();

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetError();
  };

  const handleDelete = async (): Promise<void> => {
    const success = await deleteItem(item.id);
    if (success) {
      setDialogOpen(false);
      toast.success("Item deleted!");
      fetchCombinedItems(1, isMobile, { item: "", category: "", status: "" });
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          title="Delete Item"
          className="rounded-s-none hover:text-white bg-white text-amber-600/80 hover:bg-gradient-to-b hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500"
        >
          <Trash2 />
          <span className="sr-only">Delete Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            The item <strong>"{item.name}"</strong> will be deleted from your fridge.
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button onClick={handleDelete} className="w-full md:text-base font-bold border hover:bg-gradient-to-b bg-rose-600/80 border-rose-600 hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500" variant="destructive">
          {loading ? <Spinner /> : null}
          Delete Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
