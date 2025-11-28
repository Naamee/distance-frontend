import { type ColumnDef } from "@tanstack/react-table";

export interface MeetData {
  meet_date: string | null;
  remaining_days: number;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export interface NavigationBtns {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  onClick: () => void;
  disabled: boolean;
}

export interface Filters {
  item: string;
  category: string;
  status: string;
}

export interface Actions {
  label: string;
  class: string;
  action: () => Promise<void>;
}

export interface CombinedItemData {
  id: number;
  name: string;
  category: string;
  quantity: number;
}

export interface FridgeData {
  data: CombinedItemData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface FridgeEntryData {
  id: number;
  type: string;
  quantity: number;
  date: string;
}

export interface FridgeEntryResponse {
  name: string;
  category: string;
  data: FridgeEntryData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface EntryDialogProps {
  itemId: number;
  isLast: boolean;
  entry: FridgeEntryData;
}

export interface ItemDialogProps {
  isLast: boolean;
  item: CombinedItemData;
}

export interface ItemData {
  name: string;
  category: string;
}
