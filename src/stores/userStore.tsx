import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useUserStore = create(
  combine({ loading: false, error: null as string | null }, (set) => ({
    userLogin: async (data: {
      username: string;
      password: string;
      remember: boolean;
    }): Promise<boolean> => {
      set({ loading: true, error: null });
      try {
        await axios.post("/login", data);
        set({ loading: false });
        return true;
      } catch (error: any) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Login failed"
          : "An unexpected error occurred";
        set({ loading: false, error: message });
        return false;
      }
    },
    userRegister: async (data: {
      username: string;
      password: string;
      confirmPassword: string;
    }): Promise<boolean> => {
      set({ loading: true, error: null });

      // simple client-side password confirmation check
      if (data.password !== data.confirmPassword) {
        set({ loading: false, error: "Passwords do not match" });
        return false;
      }

      try {
        await axios.post("/register", data);
        set({ loading: false });
        return true;
      } catch (error: any) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Registration failed"
          : "An unexpected error occurred";
        set({ loading: false, error: message });
        return false;
      }
    },
  }))
);
