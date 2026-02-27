import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ActiveWorkoutProps } from '@/types';

export default function ActiveWorkout({ sets, onAddSet, onToggleSet }: ActiveWorkoutProps) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-[2rem] p-6 md:p-8 backdrop-blur-sm">
      <div className="grid grid-cols-4 mb-6 px-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
        <span>Set</span>
        <span>Weight (kg)</span>
        <span>Reps</span>
        <span className="text-right px-2">Complete</span>
      </div>
      <div className="space-y-4">
        {sets.map((set, index) => (
          <div
            key={set.id}
            className={cn(
              'grid grid-cols-4 items-center p-4 rounded-2xl border transition-all duration-300',
              set.completed
                ? 'bg-green-500/5 border-green-500/40 opacity-80'
                : 'bg-zinc-900 border-zinc-800 shadow-xl'
            )}
          >
            <span className="font-black text-2xl text-zinc-700 ml-2 italic">{index + 1}</span>
            <Input
              type="number"
              placeholder="0"
              className="w-24 md:w-32 bg-zinc-800/40 border-none text-primary font-black text-xl"
            />
            <Input
              type="number"
              placeholder="0"
              className="w-24 md:w-32 bg-zinc-800/40 border-none text-primary font-black text-xl"
            />
            <div className="flex justify-end">
              <Button
                size="icon"
                onClick={() => onToggleSet(set.id)}
                className={cn(
                  'h-14 w-14 rounded-2xl transition-all',
                  set.completed
                    ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'bg-zinc-800 text-zinc-500'
                )}
              >
                <Check className="h-7 w-7 stroke-[4px]" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onAddSet}
        variant="ghost"
        className="w-full mt-6 text-zinc-500 hover:text-primary py-10 border-2 border-dashed border-zinc-800 rounded-[1.5rem] group"
      >
        <Plus className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold tracking-widest">ADD NEW SET</span>
      </Button>
    </div>
  );
}
