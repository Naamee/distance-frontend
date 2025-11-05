import axios from "axios";
import { da } from "date-fns/locale";
import { create } from "zustand";
import { combine } from "zustand/middleware";

interface MeetData {
  meet_date: string | null;
  remaining_days: number;
}

export const useMeetStore = create(
  combine(
    {
      data: { meet_date: null, remaining_days: 0 } as MeetData,
      loading: false,
      error: null as string | null,
    },
    (set) => ({
      resetError: () => set({ error: null }),
      fetchMeet: async () => {
        try {
          const response = await axios.get("/meet");
          set({ data: response.data });
          return response.data;
        } catch (error: any) {
          return null;
        }
      },
      updateMeet: async (date: string) => {
        set({ error: null, loading: true });

        const currentDate = new Date()
        if (new Date(date) < currentDate) {
          set({ error: "Meet date cannot be in the past." , loading: false});
          return false;
        }

        try {
          await axios.put("/meet", { date });
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "date update failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      deleteMeet: async () => {
        set({ error: null, loading: true });
        try {
          await axios.delete("/meet");
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "date delete failed"
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
