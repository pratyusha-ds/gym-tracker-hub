'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { SummaryHeader } from '@/components/history/summary/SummaryHeader';
import { WorkoutStats } from '@/components/history/summary/WorkoutStats';
import { ExerciseCard } from '@/components/history/summary/ExerciseCard';
import { WorkoutSetDTO } from '@/types';
import { getSetsByDate, updateWorkoutSet, deleteWorkoutSet } from './actions';

type Params = Promise<{ date: string }>;

export default function DaySummaryPage({ params }: { params: Params }) {
  const { date } = use(params);
  const { getToken, isLoaded } = useAuth();
  const [sets, setSets] = useState<WorkoutSetDTO[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        if (token) {
          const data = await getSetsByDate(date, token);
          setSets(data);
        }
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [date, isLoaded, getToken]);

  const grouped = useMemo(() => {
    return sets.reduce((acc: Record<string, WorkoutSetDTO[]>, set) => {
      const name = set.exerciseName || 'Unknown Exercise';
      if (!acc[name]) acc[name] = [];
      acc[name].push(set);
      return acc;
    }, {});
  }, [sets]);

  const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  const totalExercises = Object.keys(grouped).length;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleUpdate = async (id: number, w: number, r: number) => {
    const token = await getToken();
    if (!token) return;
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, weight: w, reps: r } : s)));
    await updateWorkoutSet(id, w, r, token);
  };

  const handleDelete = async (id: number) => {
    const token = await getToken();
    if (!token) return;
    setSets((prev) => prev.filter((s) => s.id !== id));
    await deleteWorkoutSet(id, token);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12 flex justify-center">
      <div className="w-full max-w-3xl">
        <SummaryHeader formattedDate={formattedDate} />
        <WorkoutStats volume={totalVolume} exerciseCount={totalExercises} />

        <div className="space-y-6">
          {Object.entries(grouped).map(([name, exerciseSets]) => (
            <ExerciseCard
              key={name}
              exerciseName={name}
              sets={exerciseSets}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}

          {!fetching && sets.length === 0 && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[2.5rem]">
              <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">
                No data for this day
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Link href={`/categories?date=${date}`}>
            <Button className="w-full py-8 bg-primary hover:bg-primary/90 text-black font-black uppercase italic rounded-3xl transition-all">
              + Add Exercise
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant="ghost"
              className="w-full py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl uppercase text-xs font-bold"
            >
              Return to Calendar
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
