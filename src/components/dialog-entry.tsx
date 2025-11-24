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
import { ChevronsUp, ChevronsDown } from "lucide-react";

interface FridgeEntryData {
  id: number;
  type: string;
  quantity: number;
  date: string;
}

interface ItemDialogProps {
  isLast: boolean;
  item: FridgeEntryData;
}

export default function EntryDialog({ isLast, item }: ItemDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Item
          className={`relative bg-white hover:bg-white/30 active:bg-white/40 rounded-none
                    ${isLast ? "" : "border-amber-600/10"} `}
        >
          <ItemContent>
            <ItemDescription className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                {item.type === "add" ? (
                  <ChevronsUp className="text-green-600" />
                ) : (
                  <ChevronsDown className="text-rose-600" />
                )}
                <span>Qty: {item.quantity}</span>
              </div>
              {new Date(item.date).toLocaleDateString("en-GB")}
            </ItemDescription>
          </ItemContent>
          <ItemActions />
        </Item>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
