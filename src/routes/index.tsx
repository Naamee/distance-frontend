import { createFileRoute } from "@tanstack/react-router";
import DaysDialog from "@/components/days-dialog";
import { useMeetStore } from "@/stores/meetStore";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

interface MeetData {
  meet_date: string | null;
  remaining_days: number;
}

function Index() {
  const { fetchMeet } = useMeetStore();

  const [meetData, setMeetData] = useState<MeetData>({
    meet_date: null,
    remaining_days: 0,
  });

  useEffect(() => {
    fetchMeet().then((data) => {
      if (data) {
        setMeetData({
          meet_date: data.meet_date,
          remaining_days: data.remaining_days,
        });
      }
    });
  }, []);

  return (
    <div className="flex-1 h-screen text-5xl md:text-8xl text-amber-500 font-extrabold justify-items-center content-center">
      <div className="justify-items-center bg-white/90 border border-amber-500 p-10 md:w-170 rounded-sm">
        <h3>{meetData.remaining_days}</h3>
        <h3>Days Left</h3>
        <div>
          <DaysDialog />
        </div>
      </div>
    </div>
  );
}
