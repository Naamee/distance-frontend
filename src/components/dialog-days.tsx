import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { useMeetStore } from "@/stores/meetStore";

export default function DaysDialog() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const {
    fetchMeet,
    updateMeet,
    deleteMeet,
    resetError,
    data,
    error,
    loading,
  } = useMeetStore();

  // ensure error is cleared when dialog is closed
  const handleClose = () => {
    setDialogOpen(!dialogOpen);
    resetError();
  };

  const handleDelete = async () => {
    const success = await deleteMeet();
    fetchMeet(); // refresh data after delete
    if (success) setDialogOpen(false);
  };

  const submit = async () => {
    if (date) {
      const success = await updateMeet(date.toLocaleDateString("en-CA")); // format YYYY-MM-DD
      fetchMeet(); // refresh data after update
      if (success) setDialogOpen(false);
    }
  };

  useEffect(() => {
    if (data.meet_date) {
      setDate(new Date(data.meet_date));
    }
  }, [data.meet_date]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="mt-4 md:mt-0 w-50 md:w-100 font-bold text-2xl h-15 bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500 active:mt-5 active:md:mt-12"
        >
          UPDATE
        </Button>
      </DialogTrigger>

      <DialogContent className="w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl">Meeting Date</DialogTitle>
          <DialogDescription className="text-base">
            Select the date when we will be meeting next.
          </DialogDescription>
        </DialogHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-full justify-between font-normal md:text-base"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* error alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 md:text-base font-bold bg-rose-600/80 border border-rose-600 hover:bg-gradient-to-b hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500"
          >
            {loading ? <Spinner /> : null}
            Delete
          </Button>

          <Button
            onClick={submit}
            disabled={loading}
            className="flex-1 md:text-base font-bold bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500"
          >
            {loading ? <Spinner /> : null}
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
