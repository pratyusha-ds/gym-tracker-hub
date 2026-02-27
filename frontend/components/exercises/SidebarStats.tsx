import { Timer, TrendingUp } from 'lucide-react';

export default function SidebarStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
        <Timer className="absolute -right-4 -top-4 h-24 w-24 text-zinc-800/30 group-hover:text-primary/10 transition-colors" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Rest Timer
        </p>
        <p className="text-4xl font-black text-primary italic">01:30</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
        <TrendingUp className="absolute -right-4 -top-4 h-24 w-24 text-zinc-800/30 group-hover:text-primary/10 transition-colors" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Personal Best
        </p>
        <p className="text-4xl font-black text-white italic">
          120 <span className="text-sm text-zinc-600">KG</span>
        </p>
      </div>
    </div>
  );
}
