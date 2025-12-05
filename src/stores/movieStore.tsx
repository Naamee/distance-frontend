import axios from "axios";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { type MovieData, type MovieResponse, type MovieFilters } from "@/types";

export const useMovieStore = create(
  combine(
    {
      movies: {
        data: [],
        pagination: {
          page: 1,
          per_page: 10,
          total_items: 0,
          total_pages: 0,
        },
      } as MovieResponse,
      loading: false,
      error: null as string | null,
    },
    (set) => ({
      resetError: () => set({ error: null }),
      postMovie: async (movie: string) => {
        set({ error: null, loading: true });
        if (movie === "") {
          return set({
            error: "Ensure all fields are complete",
            loading: false,
          });
        }
        try {
          await axios.post("/movies", { name: movie });
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Movie submission failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set({ loading: false });
        }
      },
      fetchMovies: async (page: number, per_page: null | number, filters: MovieFilters) => {
        set({ error: null, loading: true });
        try {
          const response = await axios.get("/movies", {
            params: {
              page,
              per_page,
              name: filters.name,
              status: filters.status,
            },
          });
          set({ movies: response.data });
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to fetch movies"
            : "An unexpected error occurred";
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },
      deleteMovie: async (id: number): Promise<Boolean> => {
        set ({ loading: true, error: null });
        try {
          await axios.delete(`/movies/${id}`);
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Movie deletion failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set ({ loading: false });
        }
      },
      markMovie: async (id: number, status: string): Promise<Boolean> => {
        set ({ loading: true, error: null });
        try {
          await axios.patch(`/movies/${id}`, { status });
          return true;
        } catch (error: any) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || "Movie update failed"
            : "An unexpected error occurred";
          set({ error: message });
          return false;
        } finally {
          set ({ loading: false });
        }
      },
    })
  )
);
