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

interface FetchCombinedData {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

interface ItemDialogProps {
  isLast: boolean;
  item: FetchCombinedData
}


export default function ItemDialog({isLast, item}: ItemDialogProps) {
  return (
      <Dialog>
        <DialogTrigger asChild>
                  <Item
                    className={`relative bg-white hover:bg-white/30 active:bg-white/40 rounded-none
                    ${isLast ? "" : "border-amber-600/10"} `}
                  >
                    <ItemContent>
                      <ItemTitle>{item.name}</ItemTitle>
                      <ItemDescription>{item.category}</ItemDescription>
                    </ItemContent>
                    <ItemActions />
                    <ItemFooter>
                      <span>Qty: {item.quantity}</span>
                      <span
                        className={`${item.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.quantity > 0 ? "Available" : "Unavailable"}
                      </span>
                    </ItemFooter>
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
