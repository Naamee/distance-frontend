import { createFileRoute } from "@tanstack/react-router";
import DaysDialog from "@/components/dialog-days";
import { useMeetStore } from "@/stores/meetStore";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { fetchMeet, data } = useMeetStore();
  const isSmallMobile = useMediaQuery({ maxWidth: 335 });

  useEffect(() => {
    fetchMeet()
  }, []);

  return (
    <div className="flex-1 mx-2 h-screen text-5xl md:text-8xl text-amber-500 font-extrabold justify-items-center content-center">
      <div className={`justify-items-center bg-white/90 border border-amber-500 md:w-170 rounded-sm ${isSmallMobile ? "p-7" : "p-10"}`}>
        <h3>{data.remaining_days}</h3>
        <h3>Days Left</h3>
        <div>
          <DaysDialog />
        </div>
      </div>
    </div>
  );
}
