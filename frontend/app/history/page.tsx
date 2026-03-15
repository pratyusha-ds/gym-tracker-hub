'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Target,
  Dumbbell,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { JumpToOverlay } from '@/components/history/calendar/JumpToOverlay';
import { getWorkoutSessions } from './actions';
import { WorkoutSessionDTO } from '@/types';

export default function CalendarPage() {
  const { getToken, isLoaded } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [showJumpTo, setShowJumpTo] = useState(false);

  const [selYear, setSelYear] = useState(currentDate.getFullYear());
  const [selMonth, setSelMonth] = useState(currentDate.getMonth());

  const [sessions, setSessions] = useState<WorkoutSessionDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  useEffect(() => {
    async function loadData() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        if (token) {
          const data = await getWorkoutSessions(token);
          setSessions(data);
        }
      } catch {
        setError('Failed to load history.');
      }
    }
    loadData();
  }, [getToken, isLoaded]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const workoutDays = sessions
    .filter((s) => {
      const [sYear, sMonth] = s.date.split('-').map(Number);
      return sYear === currentDate.getFullYear() && sMonth - 1 === currentDate.getMonth();
    })
    .map((s) => Number(s.date.split('-')[2]));

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelMonth(newDate.getMonth());
    setSelYear(newDate.getFullYear());
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12 flex justify-center font-sans">
      <div className="w-full max-w-6xl relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <Link
            href="/"
            className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-800 transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-zinc-400" />
          </Link>

          <Button
            onClick={() => setShowJumpTo(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-full hover:border-primary px-6"
          >
            <Target size={16} className="text-primary mr-2" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Jump to Month</span>
          </Button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary" size={20} />
            <h1 className="text-xl font-black uppercase tracking-tighter italic">Logbook</h1>
          </div>
        </div>

        <JumpToOverlay
          showJumpTo={showJumpTo}
          setShowJumpTo={setShowJumpTo}
          selMonth={selMonth}
          setSelMonth={setSelMonth}
          selYear={selYear}
          setSelYear={setSelYear}
          onConfirm={() => {
            setCurrentDate(new Date(selYear, selMonth, 1));
            setShowJumpTo(false);
          }}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-4 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-4 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-widest text-white">
              {monthName} <span className="text-primary">{year}</span>
            </h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-2xl bg-black border-zinc-800 hover:border-zinc-600 transition-colors"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl bg-black border-zinc-800 hover:border-zinc-600 transition-colors"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasWorkout = workoutDays.includes(day);

              const isToday =
                day === todayDate &&
                currentDate.getMonth() === todayMonth &&
                currentDate.getFullYear() === todayYear;

              const dateString = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              return (
                <Link
                  href={`/history/${dateString}`}
                  key={day}
                  className={cn(
                    'aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 relative group',

                    'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:text-white hover:bg-zinc-800',

                    hasWorkout &&
                      'bg-primary/10 border-primary/40 text-primary italic shadow-[0_0_20px_rgba(var(--primary),0.05)]',

                    isToday &&
                      'border-primary bg-primary/5 ring-1 ring-primary/50 shadow-[0_0_25px_-5px_rgba(var(--primary),0.4)]'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm sm:text-lg md:text-xl font-black transition-colors',
                      isToday
                        ? 'text-white'
                        : hasWorkout
                          ? 'text-primary'
                          : 'text-zinc-600 group-hover:text-white'
                    )}
                  >
                    {day}
                  </span>

                  {isToday && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}

                  {hasWorkout && (
                    <>
                      <Dumbbell
                        size={14}
                        className="text-primary mt-0.5 sm:mt-1 hidden sm:block animate-in fade-in zoom-in"
                      />
                      <div className="sm:hidden w-1 h-1 bg-primary rounded-full mt-1" />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
