'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Header from '@/components/exercises/Header';
import ActiveWorkout from '@/components/exercises/ActiveWorkout';
import SidebarStats from '@/components/exercises/SidebarStats';
import TrainingLog from '@/components/exercises/TrainingLog';
import { WorkoutSet, WorkoutSetDTO } from '@/types';
import { fetchExerciseData, fetchSetsByDate, saveSetAction, deleteSetAction } from './actions';

const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

export default function WorkoutSessionPage({
  params: paramsPromise,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const params = use(paramsPromise);
  const exerciseId = params.exerciseId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken, isLoaded } = useAuth();

  const historyDate = searchParams.get('date');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([]);

  useEffect(() => {
    const initPage = async () => {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        const exData = await fetchExerciseData(exerciseId, token);
        setExerciseName(exData.name);

        const targetDate = historyDate || new Date().toISOString().split('T')[0];
        const allSets: WorkoutSetDTO[] = await fetchSetsByDate(targetDate, token);

        const filteredSets = allSets
          .filter((s: WorkoutSetDTO) => s.exerciseId === parseInt(exerciseId))
          .map((s: WorkoutSetDTO) => ({
            id: s.id,
            weight: s.weight.toString(),
            reps: s.reps.toString(),
            completed: false,
            isNew: false,
          }));

        setSets(
          filteredSets.length > 0
            ? filteredSets
            : [{ id: generateUniqueId(), weight: '', reps: '', completed: false, isNew: true }]
        );
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initPage();
  }, [exerciseId, getToken, isLoaded, historyDate]);

  const addSet = useCallback(() => {
    setSets((prev) => [
      ...prev,
      { id: generateUniqueId(), weight: '', reps: '', completed: false, isNew: true },
    ]);
  }, []);

  const updateSet = (id: number, field: 'weight' | 'reps', value: string) => {
    setSets((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSetToDatabase = async (id: number) => {
    const setToSave = sets.find((s) => s.id === id);
    if (!setToSave || !setToSave.weight.trim() || !setToSave.reps.trim()) return;

    try {
      const token = await getToken();
      const payload = {
        id: setToSave.isNew ? null : id,
        weight: parseFloat(setToSave.weight),
        reps: parseInt(setToSave.reps, 10),
        exerciseId: parseInt(exerciseId),
        date: historyDate || new Date().toISOString().split('T')[0],
      };

      const savedData = await saveSetAction(token, payload, !!setToSave.isNew);

      setSets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, id: savedData.id, isNew: false } : s))
      );
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const deleteSet = async (id: number) => {
    const setToDelete = sets.find((s) => s.id === id);
    setSets((prev) => prev.filter((s) => s.id !== id));
    if (setToDelete && !setToDelete.isNew) {
      const token = await getToken();
      await deleteSetAction(id, token);
    }
  };

  const handleFinish = () => {
    router.push(historyDate ? `/history/${historyDate}` : '/categories');
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header
          exerciseName={exerciseName ? `${exerciseName}${historyDate ? ' (Backlog)' : ''}` : '...'}
          onFinish={handleFinish}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ActiveWorkout
              sets={sets}
              onAddSet={addSet}
              onUpdateSet={updateSet}
              onSaveSet={saveSetToDatabase}
              onDeleteSet={deleteSet}
            />
          </div>
          <div className="lg:col-span-4">
            <SidebarStats exerciseId={exerciseId} currentSets={sets} />
          </div>
        </div>
        <TrainingLog exerciseId={exerciseId} />
      </div>
    </main>
  );
}
