import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";

interface ItemData {
  name: string;
  category: string;
  quantity: number;
}

interface fetchCombinedData {
  name: string;
  type: string;
  category: string;
  quantity: number;
}

interface FridgeData {
  data: fetchCombinedData[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  }
}


export const useItemStore = create(
  combine(
    {
      combinedItems: {
        data: [],
        pagination: {
          page: 1,
          per_page: 10,
          total_items: 0,
          total_pages: 0,
        },
      } as FridgeData,
      loading: false,
      error: null as string | null,
    },
    (set) => ({
      resetError: () => set({ error: null }),
      postItem: async (item: ItemData) => {
        set({ error: null, loading: true });
        try {
            await axios.post("/fridge", item);
            return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Item submission failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set({ loading: false });
        }
        },
      fetchCombinedItems: async (page: number) => {
        set({ error: null, loading: true });
        try {
          const response = await axios.get("/fridge", { params: { page } });
          set({ combinedItems: response.data });
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch items"
            : "An unexpected error occurred";
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },
      deleteItem: async (itemId: string) => {
        set({ error: null, loading: true });
        try {
          await axios.delete(`/fridge/${itemId}`);
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Item deletion failed"
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
