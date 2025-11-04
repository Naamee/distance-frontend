
import { useState } from "react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { useMeetStore } from "@/stores/meetStore";


export default function DaysDialog() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { updateMeet, deleteMeet, error, loading } = useMeetStore();

  const submit = async () => {
    if (date) {
      const success = await updateMeet(date.toISOString().split("T")[0])
      if (success) setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="mt-4 md:mt-0 w-50 md:w-100 font-bold text-2xl h-15 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-5 active:md:mt-12"
        >
          UPDATE
        </Button>
      </DialogTrigger>

      <DialogContent className="w-60">
        <DialogHeader>
          <DialogTitle>Meeting Date</DialogTitle>
          <DialogDescription>
            Select the date when we will be meeting next.
          </DialogDescription>
        </DialogHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
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
            <p>{ error }</p>
          </AlertDescription>
        </Alert>
        )}

        <Button
          onClick={submit}
          disabled={loading}
          className="mt-4 md:mt-0 font-bold bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-1"
        >
          {loading ? <Spinner /> : null}
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
