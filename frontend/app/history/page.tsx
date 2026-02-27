'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Dumbbell,
  Target,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [showJumpTo, setShowJumpTo] = useState(false);

  const [selYear, setSelYear] = useState(currentDate.getFullYear());
  const [selMonth, setSelMonth] = useState(currentDate.getMonth());

  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showJumpTo) {
      const timer = setTimeout(() => {
        const scrollToElement = (container: HTMLDivElement | null, index: number) => {
          if (!container) return;
          const items = container.querySelectorAll('button');
          const target = items[index] as HTMLElement | undefined;
          if (target) {
            container.scrollTo({
              top: target.offsetTop,
              behavior: 'smooth',
            });
          }
        };

        scrollToElement(yearScrollRef.current, selYear - 1950);
        scrollToElement(monthScrollRef.current, selMonth);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showJumpTo, selYear, selMonth]);

  if (!currentDate) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500 font-black animate-pulse uppercase tracking-[0.3em]">
          Loading Logbook...
        </div>
      </main>
    );
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const workoutDays = [2, 5, 8, 12, 15, 16];

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const jumpToMonth = () => {
    setCurrentDate(new Date(selYear, selMonth, 1));
    setShowJumpTo(false);
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const startYear = 1950;
  const endYear = 2100;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12 flex justify-center font-sans overflow-x-hidden">
      <div className="w-full max-w-6xl relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <Link
              href="/"
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-zinc-400" />
            </Link>
            <div className="flex items-center gap-2 sm:hidden">
              <CalendarIcon className="text-primary" size={20} />
              <h1 className="text-xl font-black uppercase tracking-tighter italic">Logbook</h1>
            </div>
          </div>

          <button
            onClick={() => {
              setSelYear(currentDate.getFullYear());
              setSelMonth(currentDate.getMonth());
              setShowJumpTo(true);
            }}
            className="group flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-primary transition-all shadow-lg active:scale-95 w-full sm:w-auto justify-center"
          >
            <Target size={16} className="text-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-200">
              Jump to Month
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <CalendarIcon className="text-primary" size={20} />
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Logbook</h1>
          </div>
        </div>

        {showJumpTo && (
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
              onClick={jumpToMonth}
            >
              Confirm Selection
            </Button>
          </div>
        )}

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-8 md:p-12 mb-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-widest text-white text-center sm:text-left">
              {monthName} <span className="text-primary">{year}</span>
            </h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-zinc-800 bg-black hover:bg-zinc-900"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-2xl border-zinc-800 bg-black hover:bg-zinc-900"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-[9px] md:text-[10px] font-black text-zinc-600 uppercase mb-2 md:mb-4 tracking-widest"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasWorkout = workoutDays.includes(day);
              const dateString = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              return (
                <Link
                  href={`/history/${dateString}`}
                  key={day}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-2xl border transition-all duration-300 relative group',
                    hasWorkout
                      ? 'bg-primary/10 border-primary/40 hover:bg-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]'
                      : 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm sm:text-lg md:text-xl font-black transition-colors',
                      hasWorkout ? 'text-primary italic' : 'text-zinc-600 group-hover:text-white'
                    )}
                  >
                    {day}
                  </span>
                  {hasWorkout && (
                    <Dumbbell
                      size={14}
                      className="text-primary mt-0.5 sm:mt-1 hidden sm:block animate-in fade-in zoom-in duration-500"
                    />
                  )}
                  {hasWorkout && <div className="sm:hidden w-1 h-1 bg-primary rounded-full mt-1" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 px-6 pb-10">
          <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <div className="h-4 w-4 rounded-lg bg-primary/20 border border-primary/40" />
            Session Logged
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <div className="h-4 w-4 rounded-lg bg-zinc-900 border border-zinc-800" />
            No Activity
          </div>
        </div>
      </div>
    </main>
  );
}
