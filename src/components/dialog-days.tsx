import { act, useEffect, useState } from "react";
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
import { type Actions } from "@/types";

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


  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetError();
  };

  const handleDelete = async (): Promise<void> => {
    const success = await deleteMeet();
    fetchMeet(); // refresh data after delete
    if (success) setDialogOpen(false);
  };

  const submit = async (): Promise<void> => {
    if (date) {
      const success = await updateMeet(date.toLocaleDateString("en-CA")); // format YYYY-MM-DD
      fetchMeet(); // refresh data after update
      if (success) setDialogOpen(false);
    }
  };

  const actions: Actions[] = [
    {
      label: "Delete",
      class: "bg-rose-600/80 border-rose-600 hover:from-rose-400 hover:to-rose-600 active:from-rose-400 active:to-rose-500",
      action: handleDelete,
    },
    {
      label: "Submit",
      class: "bg-amber-600/80 border-amber-600 hover:from-amber-400 hover:to-amber-600 active:from-amber-400 active:to-amber-500",
      action: submit,
    },
  ];

  useEffect(() => {
    if (data.meet_date) {
      setDate(new Date(data.meet_date));
    }
  }, [data.meet_date]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="mt-4 md:mt-0 w-50 md:w-100 font-bold text-2xl h-15 bg-amber-600/80 border border-amber-600 hover:bg-gradient-to-b hover:from-amber-400 hover:to-amber-600
          active:from-amber-400 active:to-amber-500 active:mt-5 active:md:mt-12"
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

        {/* action buttons */}
        <div className="flex flex-col md:flex-row gap-2 w-full">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              disabled={loading}
              className={`flex-1 md:text-base font-bold border hover:bg-gradient-to-b ${action.class}`}
            >
              {loading ? <Spinner /> : null}
              {action.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
