import { Loader2 } from 'lucide-react';

export default function DayLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">
        Loading Workout Summary...
      </p>
    </div>
  );
}
