'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { History, Calendar, Loader2 } from 'lucide-react';
import { LogEntry, WorkoutSessionDTO, WorkoutSetDTO } from '@/types';
import { fetchAllSessions } from '@/app/exercises/[exerciseId]/actions';

export default function TrainingLog({ exerciseId }: { exerciseId: string }) {
  const { getToken } = useAuth();
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        const sessions: WorkoutSessionDTO[] = await fetchAllSessions(token);

        const filteredLog: LogEntry[] = sessions
          .map((session: WorkoutSessionDTO) => {
            const exerciseSets = session.sets.filter(
              (set: WorkoutSetDTO) => set.exerciseId === parseInt(exerciseId)
            );

            return {
              date: new Date(session.date).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }),
              sets: exerciseSets.map((set: WorkoutSetDTO) => ({
                weight: set.weight,
                reps: set.reps,
              })),
              totalVolume: exerciseSets.reduce(
                (acc: number, set: WorkoutSetDTO) => acc + set.weight * set.reps,
                0
              ),
            };
          })
          .filter((entry: LogEntry) => entry.sets.length > 0);

        setHistory(filteredLog);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    if (exerciseId) fetchHistory();
  }, [exerciseId, getToken]);

  if (loading)
    return (
      <div className="flex justify-center p-10 mt-12">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );

  return (
    <div className="mt-12 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tight">Full Training Log</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {history.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-[2rem]">
            <p className="text-zinc-500 italic">No previous history found for this exercise.</p>
          </div>
        ) : (
          history.map((session, idx) => (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={14} />{' '}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {session.date}
                  </span>
                </div>
                <span className="text-[10px] font-black bg-zinc-800 text-primary px-3 py-1 rounded-full italic border border-primary/20">
                  {session.totalVolume.toLocaleString()}kg VOL
                </span>
              </div>
              <div className="space-y-2">
                {session.sets.map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-zinc-800/50"
                  >
                    <span className="text-[10px] font-black text-zinc-600 italic">
                      Set {sIdx + 1}
                    </span>
                    <span className="font-bold text-zinc-200">
                      {set.weight}kg × {set.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
