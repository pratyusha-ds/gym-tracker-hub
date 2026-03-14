'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActiveWorkoutProps } from '@/types';
import { cn } from '@/lib/utils';

interface ExtendedProps extends ActiveWorkoutProps {
  shakingSetId?: number | null;
}

export default function ActiveWorkout({
  sets,
  onAddSet,
  onUpdateSet,
  onSaveSet,
  onDeleteSet,
  shakingSetId,
}: ExtendedProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2rem] p-4 md:p-8 backdrop-blur-sm">
      <div className="grid grid-cols-4 mb-4 px-2 md:px-4 text-[9px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest md:tracking-[0.2em]">
        <span className="flex items-center justify-center">Set</span>
        <span className="flex items-center justify-center text-center">Weight</span>
        <span className="flex items-center justify-center text-center">Reps</span>
        <span className="text-right flex items-center justify-end pr-2 md:pr-4">Action</span>
      </div>

      <div className="space-y-3 md:y-4">
        {sets.map((set, index) => {
          const isError = shakingSetId === set.id;
          const isWeightEmpty = !set.weight.toString().trim();
          const isRepsEmpty = !set.reps.toString().trim();

          return (
            <div
              key={set.id}
              className={cn(
                'grid grid-cols-4 items-center p-2 md:p-4 rounded-2xl border transition-all duration-300 bg-zinc-900 shadow-xl gap-2',
                isError
                  ? 'border-red-500 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-zinc-800 hover:border-zinc-700'
              )}
            >
              <div className="flex justify-center">
                <span
                  className={cn(
                    'font-black text-xl md:text-2xl italic transition-colors',
                    isError ? 'text-red-500' : 'text-zinc-700'
                  )}
                >
                  {index + 1}
                </span>
              </div>

              <Input
                type="number"
                inputMode="decimal"
                value={set.weight}
                placeholder="0"
                onChange={(e) => {
                  onUpdateSet(set.id, 'weight', e.target.value);
                  onSaveSet(set.id);
                }}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'w-full bg-zinc-800/40 border-none font-black text-lg md:text-xl text-center px-1 md:px-3 h-10 md:h-12 transition-colors focus-visible:ring-1 focus-visible:ring-red-500/50',
                  isError && isWeightEmpty
                    ? 'text-red-500 placeholder:text-red-800'
                    : 'text-red-500'
                )}
              />

              <Input
                type="number"
                inputMode="numeric"
                value={set.reps}
                placeholder="0"
                onChange={(e) => {
                  onUpdateSet(set.id, 'reps', e.target.value);
                  onSaveSet(set.id);
                }}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'w-full bg-zinc-800/40 border-none font-black text-lg md:text-xl text-center px-1 md:px-3 h-10 md:h-12 transition-colors focus-visible:ring-1 focus-visible:ring-red-500/50',
                  isError && isRepsEmpty ? 'text-red-500 placeholder:text-red-800' : 'text-red-500'
                )}
              />

              <div className="flex justify-end pr-1 md:pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete set"
                  onClick={() => onDeleteSet(set.id)}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={onAddSet}
        variant="ghost"
        className="w-full mt-6 text-zinc-500 hover:text-red-500 py-8 md:py-10 border-2 border-dashed border-zinc-800 rounded-[1.5rem] group"
      >
        <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-sm md:text-base tracking-widest uppercase">
          Add New Set
        </span>
      </Button>
    </div>
  );
}
