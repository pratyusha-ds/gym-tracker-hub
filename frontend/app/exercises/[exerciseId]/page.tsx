'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Calendar, LayoutDashboard } from 'lucide-react';
import Header from '@/components/exercises/Header';
import ActiveWorkout from '@/components/exercises/ActiveWorkout';
import SidebarStats from '@/components/exercises/SidebarStats';
import TrainingLog from '@/components/exercises/TrainingLog';
import SaveAnywayModal from '@/components/exercises/SaveAnywayModal';
import { Button } from '@/components/ui/button';
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
  const [shakingSetId, setShakingSetId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);

  const saveTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

  const setsRef = useRef<WorkoutSet[]>([]);
  useEffect(() => {
    setsRef.current = sets;
  }, [sets]);

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

  const saveSetToDatabase = (id: number) => {
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);

    saveTimers.current[id] = setTimeout(async () => {
      const setToSave = setsRef.current.find((s) => s.id === id);

      if (!setToSave || !setToSave.weight.trim() || !setToSave.reps.trim()) return;

      try {
        const token = await getToken();
        const payload = {
          id: setToSave.isNew ? null : id,
          weight: parseFloat(setToSave.weight) || 0,
          reps: parseInt(setToSave.reps, 10) || 0,
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
    }, 500);
  };

  const deleteSet = async (id: number) => {
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    const setToDelete = sets.find((s) => s.id === id);
    setSets((prev) => prev.filter((s) => s.id !== id));
    if (setToDelete && !setToDelete.isNew) {
      const token = await getToken();
      await deleteSetAction(id, token);
    }
  };

  const validateAndNavigate = (destination: string) => {
    const hasAnyDirtySet = sets.some((s) => s.weight.trim() !== '' || s.reps.trim() !== '');
    const incompleteSet = sets.find((s) => !s.weight.trim() || !s.reps.trim());

    if (!hasAnyDirtySet) {
      router.push(destination);
      return;
    }

    if (incompleteSet) {
      setShakingSetId(incompleteSet.id);
      setPendingDestination(destination);
      setIsModalOpen(true);
      setTimeout(() => setShakingSetId(null), 800);
      return;
    }

    router.push(destination);
  };

  const handleConfirmSaveAnyway = async () => {
    if (!pendingDestination) return;
    const token = await getToken();
    await Promise.all(
      sets.map(async (s) => {
        if (!s.weight.trim() || !s.reps.trim()) {
          const payload = {
            id: s.isNew ? null : s.id,
            weight: parseFloat(s.weight) || 0,
            reps: parseInt(s.reps, 10) || 0,
            exerciseId: parseInt(exerciseId),
            date: historyDate || new Date().toISOString().split('T')[0],
          };
          await saveSetAction(token, payload, !!s.isNew);
        }
      })
    );
    setIsModalOpen(false);
    router.push(pendingDestination);
  };

  const handleDiscardAndExit = async () => {
    if (!pendingDestination) return;
    const token = await getToken();
    const incompleteSavedSets = sets.filter(
      (s) => !s.isNew && (!s.weight.trim() || !s.reps.trim())
    );
    await Promise.all(incompleteSavedSets.map((s) => deleteSetAction(s.id, token)));

    setIsModalOpen(false);
    router.push(pendingDestination);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <Header
          exerciseName={exerciseName || '...'}
          onFinish={() =>
            validateAndNavigate(historyDate ? `/history/${historyDate}` : '/categories')
          }
          onViewSummary={() =>
            validateAndNavigate(`/history/${new Date().toISOString().split('T')[0]}`)
          }
          badge={
            historyDate && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <Calendar size={12} />
                LOGGING: {historyDate}
              </div>
            )
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ActiveWorkout
              sets={sets}
              onAddSet={addSet}
              onUpdateSet={updateSet}
              onSaveSet={saveSetToDatabase}
              onDeleteSet={deleteSet}
              shakingSetId={shakingSetId}
            />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <SidebarStats exerciseId={exerciseId} currentSets={sets} />

            <div className="flex flex-col gap-4 md:hidden">
              <Button
                variant="outline"
                onClick={() =>
                  validateAndNavigate(`/history/${new Date().toISOString().split('T')[0]}`)
                }
                className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 font-bold py-8 rounded-2xl transition-all active:scale-95"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" /> VIEW SUMMARY
              </Button>

              <Button
                onClick={() =>
                  validateAndNavigate(historyDate ? `/history/${historyDate}` : '/categories')
                }
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-8 text-lg rounded-2xl shadow-lg uppercase italic tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                FINISH WORKOUT
              </Button>
            </div>
          </div>
        </div>

        <SaveAnywayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSaveAnyway}
          onDiscard={handleDiscardAndExit}
        />

        <TrainingLog exerciseId={exerciseId} onNavigate={validateAndNavigate} />
      </div>
    </main>
  );
}
