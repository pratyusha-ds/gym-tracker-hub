'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface JumpToOverlayProps {
  showJumpTo: boolean;
  setShowJumpTo: (show: boolean) => void;
  selMonth: number;
  setSelMonth: (m: number) => void;
  selYear: number;
  setSelYear: (y: number) => void;
  onConfirm: () => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i);

export function JumpToOverlay({
  showJumpTo,
  setShowJumpTo,
  selMonth,
  setSelMonth,
  selYear,
  setSelYear,
  onConfirm,
}: JumpToOverlayProps) {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsYearOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!showJumpTo) return null;

  return (
    <div className="absolute inset-x-0 top-0 z-50 bg-black/98 border border-zinc-800 rounded-[2.5rem] p-6 animate-in fade-in zoom-in-95">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
          Quick Navigation
        </h3>
        <button
          onClick={() => setShowJumpTo(false)}
          className="p-2 bg-zinc-900 rounded-xl border border-zinc-800"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5">
          <Button variant="ghost" onClick={() => setSelYear(selYear - 1)}>
            <ChevronLeft />
          </Button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="flex items-center gap-2 font-black italic text-white"
            >
              {selYear} <ChevronDown size={16} className={cn(isYearOpen && 'rotate-180')} />
            </button>
            {isYearOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 max-h-48 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-xl z-50">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelYear(y);
                      setIsYearOpen(false);
                    }}
                    className={cn(
                      'w-full py-2 text-sm font-black',
                      selYear === y ? 'bg-primary text-black' : 'text-zinc-400'
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" onClick={() => setSelYear(selYear + 1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        {MONTHS.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelMonth(i)}
            className={cn(
              'py-3 rounded-xl font-black text-[10px] uppercase border',
              selMonth === i
                ? 'bg-primary border-primary text-black italic'
                : 'bg-zinc-900/30 border-zinc-800 text-zinc-500'
            )}
          >
            {m.substring(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1 bg-primary text-black font-black uppercase italic rounded-2xl h-14"
          onClick={onConfirm}
        >
          View Calendar
        </Button>
        <Button
          variant="ghost"
          className="flex-1 border border-zinc-800"
          onClick={() => setShowJumpTo(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
