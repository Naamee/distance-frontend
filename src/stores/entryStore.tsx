import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { type FridgeEntryResponse, type FridgeEntryData } from "@/types";

export const useEntryStore = create(
  combine(
    {
      entries: {
        name: "",
        category: "",
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
        set({ error: null, loading: true });
        try {
          const response = await axios.get(`/fridge/${itemId}/entries`, {
            params: { page },
          });
          set({ entries: response.data});
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch entries"
            : "An unexpected error occurred";
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },
    })
  )
);
