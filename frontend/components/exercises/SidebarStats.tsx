'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Timer, TrendingUp, Loader2 } from 'lucide-react';
import { SidebarStatsProps, WorkoutSessionDTO, WorkoutSetDTO } from '@/types';
import { fetchAllSessions } from '@/app/exercises/[exerciseId]/actions';

export default function SidebarStats({ exerciseId, currentSets }: SidebarStatsProps) {
  const { getToken } = useAuth();
  const [historicalPb, setHistoricalPb] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalPB = async () => {
      try {
        const token = await getToken();
        const sessions: WorkoutSessionDTO[] = await fetchAllSessions(token);

        const allSetsForThisExercise = sessions.flatMap((session: WorkoutSessionDTO) =>
          session.sets.filter((set: WorkoutSetDTO) => set.exerciseId === parseInt(exerciseId))
        );

        if (allSetsForThisExercise.length > 0) {
          const maxWeight = Math.max(
            ...allSetsForThisExercise.map((s: WorkoutSetDTO) => s.weight || 0)
          );
          setHistoricalPb(maxWeight);
        }
      } catch (error) {
        console.error('Failed to fetch PB:', error);
      } finally {
        setLoading(false);
      }
    };
    if (exerciseId) fetchHistoricalPB();
  }, [exerciseId, getToken]);

  const currentSessionMax = Math.max(...currentSets.map((s) => parseFloat(s.weight) || 0), 0);
  const displayPb = Math.max(historicalPb, currentSessionMax);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
        <Timer className="absolute -right-4 -top-4 h-24 w-24 text-zinc-800/30 group-hover:text-primary/10 transition-colors" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Rest Timer
        </p>
        <p className="text-4xl font-black text-primary italic">01:30</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
        <TrendingUp className="absolute -right-4 -top-4 h-24 w-24 text-zinc-800/30 group-hover:text-primary/10 transition-colors" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
          Personal Best
        </p>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
          ) : (
            <>
              <p className="text-4xl font-black text-white italic">
                {displayPb > 0 ? displayPb : '--'}
              </p>
              <span className="text-sm font-bold text-zinc-600 uppercase">KG</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
