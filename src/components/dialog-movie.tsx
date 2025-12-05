import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { toast } from "sonner";
import { type MovieDialogProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useMovieStore } from "@/stores/movieStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OperationTypes = "mark" | "delete" | "menu";
type OperationItems = "label" | "description";

export default function MovieDialog({ isLast, item }: MovieDialogProps) {
  const isMobile = useMediaQuery({ maxWidth: 425 }) ? null : 8;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] =
    useState<OperationTypes>("menu");
  const { fetchMovies, deleteMovie, markMovie, error } = useMovieStore();

  const operations: Record<
    Exclude<OperationTypes, "menu">,
    Record<OperationItems, string>
  > = {
    mark: {
      label: `Mark as ${item.status === "Watched" ? "Unwatched" : "Watched"}`,
      description: "Update the movie details.",
    },
    delete: {
      label: "Delete Movie",
      description: "This action cannot be undone.",
    },
  };

  const getColors = (operation: string) => {
    switch (operation) {
      case "delete":
        return "bg-rose-600/80 border-rose-600 hover:bg-gradient-to-b hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500";
      default:
        return "bg-amber-600/80 border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500";
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setCurrentOperation("menu");
  };

  const submit = (operation: OperationTypes) => async () => {
    setLoading(true);
    setLocalError(null);

    if (operation === "mark") {
      const newStatus = item.status === "Watched" ? "Unwatched" : "Watched";
      const success = await markMovie(item.id, newStatus);
      if (success) {
        setOpen(false);
        toast.success(`Marked as ${newStatus}!`);
        fetchMovies(1, isMobile, { name: "", status: "" });
      }
    }


    if (operation === "delete") {
      const success = await deleteMovie(item.id);
      if (success) {
        setOpen(false);
        toast.success("Movie deleted!");
        fetchMovies(1, isMobile, { name: "", status: "" });
      }
    }

    if (error) { setLocalError(error); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Item
          className={`relative bg-white hover:bg-white/30 active:bg-white/40 rounded-none
                    ${isLast ? "" : "border-amber-600/10"} `}
        >
          <ItemContent>
            <ItemTitle className="text-md">{item.name}</ItemTitle>
            <ItemDescription className="flex justify-between content-center">
              <span>{new Date(item.date).toLocaleDateString("en-GB")}</span>
              <span className={`border content-center text-sm px-2 rounded-sm pb-0 ${item.status === "Watched" ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}`}>
                {item.status}
              </span>

            </ItemDescription>
          </ItemContent>
        </Item>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={currentOperation === "menu" ? "w-60" : "w-80"}
      >
        <DialogHeader>
          <DialogTitle className={currentOperation === "menu" ? "sr-only" : ""}>
            {currentOperation !== "menu" ? (
              <div className="relative flex items-center">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setCurrentOperation("menu")}
                  className="absolute left-0 text-amber-500 active:bg-amber-600/20 h-6 ml-3"
                >
                  <ArrowLeft />
                  Back
                </Button>

                <span className="mx-auto text-center">
                  {operations[currentOperation].label}
                </span>
              </div>
            ) : (
              "Actions"
            )}
          </DialogTitle>
          <DialogDescription className="mt-2">
            {currentOperation === "menu"
              ? "Choose an action to perform on the item."
              : operations[currentOperation].description}
          </DialogDescription>
        </DialogHeader>
        {currentOperation === "menu" && (
          <>
            {Object.entries(operations).map(([key, type]) =>
              key == "mark" ? (
                  <Button
                    key={key}
                    onClick={submit("mark")}
                    className={`font-bold border w-full ${getColors(key)}`}
                  >
                    {type.label}
                  </Button>
              ) : (
                <Button
                  key={key}
                  onClick={() => setCurrentOperation(key as OperationTypes)}
                  className={`font-bold border ${getColors(key)}`}
                >
                  {type.label}
                </Button>
              )
            )}
          </>
        )}

        {currentOperation === "delete" && (
          <>
            <Button
              onClick={submit("delete")}
              className="w-full md:text-base font-bold border hover:bg-gradient-to-b bg-rose-600/80 border-rose-600 hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500"
              variant="destructive"
            >
              {loading ? <Spinner /> : null}
              Delete Movie
            </Button>
          </>
        )}

        {/* error alert */}
        {localError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{localError}</p>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
