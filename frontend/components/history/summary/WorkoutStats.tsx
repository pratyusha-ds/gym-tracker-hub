import { Clock, TrendingUp } from 'lucide-react';

export function WorkoutStats() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem]">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Clock size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
        </div>
        <p className="text-2xl font-black italic">45 MIN</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem]">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <TrendingUp size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Volume</span>
        </div>
        <p className="text-2xl font-black italic">3,540 KG</p>
      </div>
    </div>
  );
}
