import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { type MovieData } from "@/types";
import { useMovieStore } from "@/stores/movieStore";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import MovieDialog from "@/components/dialog-movie";
import DeleteMovieDialog from "@/components/dialog-movie-delete";
import SearchFilters from "@/components/search-filters-movies";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { TicketCheck, TicketX } from "lucide-react";

export const Route = createFileRoute("/movies")({
  component: Movies,
});

function Movies() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const perPage = useMediaQuery({ maxWidth: 425 }) ? null : 8;
  const [page, setPage] = useState<number>(1);
  const [newMovie, setNewMovie] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    status: "",
  });
  const { loading, movies, fetchMovies, postMovie, markMovie } =
    useMovieStore();

  const columns: ColumnDef<MovieData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <div className="w-50 truncate" title={info.getValue() as string}>
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Added Date",
      cell: ({ row }) => (
        <div>{new Date(row.original.date).toLocaleDateString("en-GB")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        return (
          <Button
            variant="outline"
            size="sm"
            className={`border p-2 ${info.getValue() === "Watched" ? "px-4" : ""} ${info.getValue() === "Watched" ? "border-green-600 text-green-600 hover:text-green-600" : "border-red-600 text-red-600 hover:text-red-600"}`}
          >
            {info.getValue() as string}
          </Button>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <div className="flex border border-amber-500 bg-amber-500/20 rounded-md gap-0.5">
            <Button
              size="sm"
              onClick={() => handleMark(row.original.id, row.original.status)}
              title={
                row.original.status === "Watched"
                  ? "Mark as Unwatched"
                  : "Mark as Watched"
              }
              className="rounded-e-none hover:text-white bg-white text-amber-600/80 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
            >
              {row.original.status === "Watched" ? (
                <TicketX />
              ) : (
                <TicketCheck />
              )}
              <span className="sr-only">
                {row.original.status === "Watched"
                  ? "Mark as Unwatched"
                  : "Mark as Watched"}
              </span>
            </Button>
            <DeleteMovieDialog item={row.original} />
          </div>
        </div>
      ),
    },
  ];

  const handleMark = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Watched" ? "Unwatched" : "Watched";
    const success = await markMovie(id, newStatus);
    if (success) {
      toast.success(`Marked as ${newStatus}!`);
      fetchMovies(page, perPage, filters);
    }
  };

  const submitMovie = async () => {
    const success = await postMovie(newMovie);
    if (success) {
      // reset form
      toast.success("Movie added!");
      fetchMovies(1, perPage, filters);
    }
    setNewMovie("");
  };

  useEffect(() => {
    (async () => {
      await fetchMovies(page, perPage, filters);
    })();
  }, [page, filters]);

  return (
    <div
      className={`flex gap-10 justify-center ${isMobile ? "mt-3 mx-5 mb-6" : "mt-10 mx-10"}`}
    >
      <div className="bg-white border border-amber-500 p-10 transition-all duration-300 rounded-sm w-full h-full md:max-w-6xl">
        {/* Add New Movie */}
        {!isMobile && (
          <div className="bg-amber-500/20 py-3 px-10 rounded-sm">
            <FieldSet className="my-4">
              <FieldGroup>
                <div className="grid grid-cols-12 gap-4">
                  <Field className="md:col-span-9 lg:col-span-10">
                    <Input
                      className="bg-white"
                      id="movie"
                      autoComplete="off"
                      placeholder="New Movie"
                      value={newMovie}
                      onChange={(movie) => setNewMovie(movie.target.value)}
                    />
                  </Field>
                  <Button
                    onClick={submitMovie}
                    disabled={loading}
                    className="md:col-span-3 lg:col-span-2 md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
                  >
                    {loading ? <Spinner /> : ""}
                    Add Movie
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </div>
        )}

        {isMobile && (
          <div className="bg-amber-500/20 py-2 px-4 rounded-sm">
            <FieldSet className="my-4">
              <FieldGroup>
                <div className="grid grid-cols-12 gap-4">
                  <Field className="col-span-12">
                    <Input
                      className="bg-white"
                      id="movie"
                      autoComplete="off"
                      placeholder="New Movie"
                      value={newMovie}
                      onChange={(movie) => setNewMovie(movie.target.value)}
                    />
                  </Field>
                  <AnimatePresence>
                    {newMovie.trim() !== "" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="col-span-12"
                      >
                        <Button
                          onClick={submitMovie}
                          disabled={loading}
                          className="w-full md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
                        >
                          {loading ? <Spinner /> : "Add Movie"}
                          <span className="sr-only">Add Movie</span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FieldGroup>
            </FieldSet>
          </div>
        )}

        {/* Search Filters */}
        <div>
          <SearchFilters
            isMobile={isMobile}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {!isMobile && (
          <DataTable
            columns={columns}
            data={movies.data}
            pageIndex={movies.pagination.page}
            pageSize={movies.pagination.total_pages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )}

        {isMobile && (
          <div className="flex flex-col max-h-[calc(100vh-22rem)] overflow-auto border border-amber-600/40 bg-amber-600/5 rounded-sm">
            {movies.data.map((item, index) => (
              <MovieDialog
                key={index}
                isLast={index == movies.data.length - 1}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
