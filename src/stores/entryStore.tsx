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
      resetError: () => set({ error: null }),
      fetchItemEntries: async (itemId: number, page: number, per_page: null | number) => {
        set({ error: null, loading: true });
        try {
          const response = await axios.get(`/fridge/${itemId}/entries`, {
            params: { page, per_page },
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
      updateEntry: async (id: number, entryData: Partial<FridgeEntryData>): Promise<void | string> => {
        try {
          await axios.put(`/fridge_entry/${id}`, entryData);
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to update entry"
            : "An unexpected error occurred";
          return message;
        }
      },
      deleteEntry: async (id: number): Promise<Boolean> => {
        set({ error: null, loading: true });
        try {
          await axios.delete(`/fridge_entry/${id}`);
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to delete entry"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set({ loading: false });
        }
      },
    })
  )
);
