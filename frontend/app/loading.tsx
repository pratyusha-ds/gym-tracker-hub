import { Dumbbell } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute h-20 w-20 rounded-full border-2 border-primary/20 animate-ping" />

        <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />

        <div className="absolute">
          <Dumbbell className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
          Stark <span className="text-primary">Rep</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 animate-pulse">
          Loading...
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900 overflow-hidden">
        <div
          className="h-full bg-primary w-1/3 animate-[loading_2s_infinite_ease-in-out]"
          style={{
            boxShadow: '0 0 15px rgba(var(--primary), 0.5)',
          }}
        />
      </div>
    </div>
  );
}
