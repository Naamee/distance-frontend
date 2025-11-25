import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { type FridgeData, type ItemData, type Filters } from "@/types";

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
        if (item.name === "" || item.category === "") {
          return set({
            error: "Ensure all fields are complete",
            loading: false,
          });
        }
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
      fetchCombinedItems: async (page: number, filters: Filters) => {
        set({ error: null, loading: true });
        try {
          const response = await axios.get("/fridge", {
            params: {
              page,
              item: filters.item,
              category: filters.category,
              status: filters.status,
            },
          });
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
      updateQuantity: async ({
        id,
        type,
        quantity,
      }: {
        id: number;
        type: string;
        quantity: number;
      }): Promise<void | string> => {
        try {
          await axios.post("/fridge_item", { id, type, quantity });
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Item update failed"
            : "An unexpected error occurred";
          return message;
        }
      },
      updateItemDetails: async ({
        id,
        name,
        category,
      }: {
        id: number;
        name: string;
        category: string;
      }): Promise<void | string> => {
        try {
          await axios.put(`/fridge/${id}`, { name, category });
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Item update failed"
            : "An unexpected error occurred";
          return message;
        }
      },
      deleteItem: async (id: number): Promise<Boolean> => {
        set ({ loading: true, error: null });
        try {
          await axios.delete(`/fridge/${id}`);
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Item deletion failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set ({ loading: false });
        }
      }
    })
  )
);
