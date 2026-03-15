'use client';

import { useState } from 'react';
import { Dumbbell, Trash2, AlertTriangle, ArrowRight } from 'lucide-react';
import { WorkoutSetDTO } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ExerciseCardProps {
  exerciseName: string;
  sets: WorkoutSetDTO[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, weight: number, reps: number) => void;
  date: string;
}

export function ExerciseCard({ exerciseName, sets, onDelete, onUpdate, date }: ExerciseCardProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const exerciseId = sets[0]?.exerciseId;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-800/20">
        <Link
          href={`/exercises/${exerciseId}?date=${date}`}
          className="group flex items-center gap-3 hover:opacity-80 transition-all"
        >
          <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
            <Dumbbell
              className="text-primary group-hover:scale-110 transition-transform"
              size={20}
            />
            {exerciseName}
          </h3>
          <ArrowRight
            size={16}
            className="text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          />
        </Link>

        <span className="text-[10px] font-black bg-black px-3 py-1 rounded-full text-zinc-500">
          {sets.length} {sets.length === 1 ? 'SET' : 'SETS'}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 px-2">
          <span>Set</span>
          <span>Weight</span>
          <span className="text-center">Reps</span>
          <span className="text-right">Action</span>
        </div>

        <div className="space-y-2">
          {sets.map((set, i) => (
            <div
              key={set.id}
              className="grid grid-cols-4 p-3 bg-black/40 rounded-xl border border-zinc-800/50 items-center"
            >
              <span className="text-zinc-500 font-bold italic">#{i + 1}</span>
              <input
                type="number"
                defaultValue={set.weight}
                className="bg-transparent font-black text-zinc-200 outline-none w-20"
                onBlur={(e) => onUpdate(set.id, Number(e.target.value), set.reps)}
              />
              <input
                type="number"
                defaultValue={set.reps}
                className="bg-transparent font-black text-primary text-center outline-none w-full"
                onBlur={(e) => onUpdate(set.id, set.weight, Number(e.target.value))}
              />

              <button
                onClick={() => setDeletingId(set.id)}
                aria-label="delete-set"
                className="flex justify-end text-zinc-700 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-sm w-full">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertTriangle size={32} className="text-red-500" />
              <h4 className="text-xl font-black uppercase italic">Remove Set?</h4>
              <div className="flex gap-3 w-full mt-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 rounded-2xl"
                  onClick={() => {
                    onDelete(deletingId);
                    setDeletingId(null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
