'use client';

import { Dumbbell, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CategorySyncLoader() {
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 600);
    const timer2 = setTimeout(() => setProgress(78), 1800);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? prev : prev + 1));
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center animate-in fade-in duration-1000">
      <div className="relative flex items-center justify-center mb-10">
        <div className="absolute h-24 w-24 rounded-full border border-red-600/10 animate-ping" />
        <div className="relative bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
          <Dumbbell className="h-10 w-10 text-red-600 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center justify-center gap-2">
          Syncing Stark Library <Sparkles className="h-5 w-5 text-red-600" />
        </h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">
          {progress > 85 ? 'Finalizing Studio setup' : 'Calibrating Weights'}
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="h-2 w-2 rounded-full bg-red-600 animate-bounce animation-duration-[0.8s] [animation-delay:-0.3s]" />
        <div className="h-2 w-2 rounded-full bg-red-600 animate-bounce animation-duration-[0.8s] [animation-delay:-0.15s]" />
        <div className="h-2 w-2 rounded-full bg-red-600 animate-bounce animation-duration-[0.8s]" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl font-black italic tracking-tighter text-white tabular-nums">
          {progress}
          <span className="text-red-600 text-lg ml-0.5">%</span>
        </span>
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">
          Initialization
        </span>
      </div>
    </div>
  );
}
