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


export const useItemStore = create(
  combine(
    {
      combinedItems: [] as fetchCombinedData[],
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
      fetchCombinedItems: async () => {
        set({ error: null, loading: true });
        try {
          const response = await axios.get("/fridge");
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
