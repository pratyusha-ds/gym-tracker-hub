'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefObject } from 'react';

interface JumpToOverlayProps {
  showJumpTo: boolean;
  setShowJumpTo: (show: boolean) => void;
  selMonth: number;
  setSelMonth: (m: number) => void;
  selYear: number;
  setSelYear: (y: number) => void;
  months: string[];
  years: number[];
  monthScrollRef: RefObject<HTMLDivElement | null>;
  yearScrollRef: RefObject<HTMLDivElement | null>;
  onConfirm: () => void;
}

export function JumpToOverlay({
  showJumpTo,
  setShowJumpTo,
  selMonth,
  setSelMonth,
  selYear,
  setSelYear,
  months,
  years,
  monthScrollRef,
  yearScrollRef,
  onConfirm,
}: JumpToOverlayProps) {
  if (!showJumpTo) return null;

  return (
    <div className="absolute inset-x-0 top-0 z-50 bg-black/95 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
          Select Period
        </h3>
        <button
          onClick={() => setShowJumpTo(false)}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={20} className="text-zinc-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8 h-70 items-stretch overflow-hidden">
        <div className="flex flex-col min-h-0 border-r border-zinc-800/50 pr-4 md:pr-8">
          <span className="text-[9px] font-bold text-zinc-600 uppercase mb-3 px-2 flex-none">
            Month
          </span>
          <div
            ref={monthScrollRef}
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1 relative"
          >
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => setSelMonth(i)}
                className={cn(
                  'py-3 px-4 rounded-xl font-black text-sm transition-all text-left shrink-0',
                  selMonth === i
                    ? 'bg-primary text-black italic shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                )}
              >
                {m}
              </button>
            ))}
            <div className="h-60 shrink-0" />
          </div>
        </div>

        <div className="flex flex-col min-h-0 pl-2 md:pl-4">
          <span className="text-[9px] font-bold text-zinc-600 uppercase mb-3 px-2 flex-none">
            Year
          </span>
          <div
            ref={yearScrollRef}
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1 relative"
          >
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelYear(y)}
                className={cn(
                  'py-3 px-2 rounded-xl font-black text-sm transition-all text-center shrink-0',
                  selYear === y
                    ? 'bg-primary text-black italic shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                )}
              >
                {y}
              </button>
            ))}
            <div className="h-60 shrink-0" />
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-6 bg-primary text-black font-black uppercase italic rounded-2xl py-6 hover:opacity-90 transition-all shadow-[0_10px_20px_rgba(var(--primary),0.2)]"
        onClick={onConfirm}
      >
        Confirm Selection
      </Button>
    </div>
  );
}
