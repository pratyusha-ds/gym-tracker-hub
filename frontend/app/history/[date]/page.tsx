'use client';

import { use, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SummaryHeader } from '@/components/history/summary/SummaryHeader';
import { WorkoutStats } from '@/components/history/summary/WorkoutStats';
import { ExerciseCard } from '@/components/history/summary/ExerciseCard';

type Params = Promise<{ date: string }>;

export default function DaySummaryPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-zinc-500 animate-pulse font-black uppercase tracking-widest">
            Loading Summary...
          </div>
        </main>
      }
    >
      <SummaryContent params={params} />
    </Suspense>
  );
}

function SummaryContent({ params }: { params: Params }) {
  const { date } = use(params);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dailyWorkout = [
    {
      id: 1,
      name: 'Bench Press',
      sets: [
        { kg: 100, reps: 10 },
        { kg: 100, reps: 8 },
        { kg: 95, reps: 12 },
      ],
    },
    {
      id: 2,
      name: 'Incline Dumbbell Fly',
      sets: [
        { kg: 20, reps: 15 },
        { kg: 20, reps: 15 },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 flex justify-center">
      <div className="w-full max-w-3xl">
        <SummaryHeader formattedDate={formattedDate} />

        <WorkoutStats />

        <div className="space-y-6">
          {dailyWorkout.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        <Link href="/history">
          <Button
            variant="ghost"
            className="w-full mt-10 py-8 text-zinc-500 hover:text-white border border-dashed border-zinc-800 rounded-3xl transition-all"
          >
            Return to Calendar
          </Button>
        </Link>
      </div>
    </main>
  );
}
