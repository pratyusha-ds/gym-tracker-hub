'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/exercises/Header';
import ActiveWorkout from '@/components/exercises/ActiveWorkout';
import SidebarStats from '@/components/exercises/SidebarStats';
import TrainingLog from '@/components/exercises/TrainingLog';
import { WorkoutSet } from '@/types';

type Params = Promise<{ exerciseId: string }>;

export default function WorkoutSessionPage({ params: paramsPromise }: { params: Params }) {
  const params = use(paramsPromise);
  const exerciseId = params.exerciseId;
  const router = useRouter();

  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: 1, weight: '', reps: '', completed: false },
  ]);

  const addSet = () =>
    setSets([...sets, { id: sets.length + 1, weight: '', reps: '', completed: false }]);

  const toggleSet = (id: number) => {
    setSets(sets.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const handleFinish = () => router.push('/categories');

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header exerciseId={exerciseId} onFinish={handleFinish} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ActiveWorkout sets={sets} onAddSet={addSet} onToggleSet={toggleSet} />
          </div>
          <div className="lg:col-span-4">
            <SidebarStats />
          </div>
        </div>
        <TrainingLog />
      </div>
    </main>
  );
}
