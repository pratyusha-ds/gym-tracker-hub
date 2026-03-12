'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActiveWorkoutProps } from '@/types';

export default function ActiveWorkout({
  sets,
  onAddSet,
  onUpdateSet,
  onSaveSet,
  onDeleteSet,
}: ActiveWorkoutProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
      <div className="grid grid-cols-4 mb-6 px-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
        <span>Set</span>
        <span>Weight (kg)</span>
        <span>Reps</span>
        <span className="text-right px-2">Action</span>
      </div>
      <div className="space-y-4">
        {sets.map((set, index) => (
          <div
            key={set.id}
            className="grid grid-cols-4 items-center p-4 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl hover:border-zinc-700 transition-all"
          >
            <span className="font-black text-2xl text-zinc-700 ml-2 italic">{index + 1}</span>
            <Input
              type="number"
              value={set.weight}
              onChange={(e) => onUpdateSet(set.id, 'weight', e.target.value)}
              onBlur={() => onSaveSet(set.id)}
              onFocus={(e) => e.target.select()}
              className="w-20 md:w-32 bg-zinc-800/40 border-none text-red-500 font-black text-xl"
            />
            <Input
              type="number"
              value={set.reps}
              onChange={(e) => onUpdateSet(set.id, 'reps', e.target.value)}
              onBlur={() => onSaveSet(set.id)}
              onFocus={(e) => e.target.select()}
              className="w-20 md:w-32 bg-zinc-800/40 border-none text-red-500 font-black text-xl"
            />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete set"
                onClick={() => onDeleteSet(set.id)}
                className="h-12 w-12 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onAddSet}
        variant="ghost"
        className="w-full mt-6 text-zinc-500 hover:text-red-500 py-10 border-2 border-dashed border-zinc-800 rounded-[1.5rem] group"
      >
        <Plus className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold tracking-widest uppercase">Add New Set</span>
      </Button>
    </div>
  );
}
