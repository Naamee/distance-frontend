import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";

interface FridgeEntryData {
  id: number;
  type: string;
  quantity: number;
  date: string;
}

interface FridgeEntryResponse {
  name: string;
  data: FridgeEntryData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export const useEntryStore = create(
  combine(
    {
      entries: {
        name: "",
        data: [],
        pagination: {
          page: 1,
          per_page: 10,
          total_items: 0,
          total_pages: 0,
        },
      } as FridgeEntryResponse,
      loading: false,
      error: null as string | null,
    },
    (set) => ({
      fetchItemEntries: async (itemId: number, page: number) => {
        try {
          const response = await axios.get(`/fridge/${itemId}/entries`, {
            params: { page },
          });
          return response.data;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch entries"
            : "An unexpected error occurred";
          set({ error: message });
        }
      },
    })
  )
);
