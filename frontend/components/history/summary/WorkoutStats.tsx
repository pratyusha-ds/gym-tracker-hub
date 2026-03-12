import { TrendingUp, Dumbbell } from 'lucide-react';

export function WorkoutStats({ volume, exerciseCount }: { volume: number; exerciseCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem]">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Dumbbell size={16} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Exercises</span>
        </div>
        <p className="text-2xl font-black italic">{exerciseCount}</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem]">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <TrendingUp size={16} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Total Volume</span>
        </div>
        <p className="text-2xl font-black italic">
          {volume.toLocaleString()} <span className="text-xs text-zinc-500">KG</span>
        </p>
      </div>
    </div>
  );
}
