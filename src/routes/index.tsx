import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button'
import DaysDialog from '@/components/days-dialog';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex-1 h-screen text-5xl md:text-8xl text-amber-500 font-extrabold justify-items-center content-center">
      <div className="justify-items-center bg-white/90 border border-amber-500 p-10 md:w-170 rounded-sm">
      <h3>300</h3>
      <h3>Days Left</h3>
      <div>
        <DaysDialog />        
      </div>
      </div>
    </div>
  );
}
