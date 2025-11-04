import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertDialog({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      className={`flex items-center mr-4 gap-4 text-gray-500 font-bold ${isMobile ? "" : "text-2xl"}`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full text-8xl bg-gradient-to-b from-gray-200 to-gray-400 border-white hover:from-amber-200 hover:to-amber-500 hover:border-amber-600 active:from-amber-400 active:to-amber-600 active:border-amber-700 text-white hover:text-amber-600"
            size={isMobile ? "icon" : "icon-lg"}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <p>
        {formattedDate} <span className="text-amber-500">|</span> {currentTime}
      </p>
    </div>
  );
}
