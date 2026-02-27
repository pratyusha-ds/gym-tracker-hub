import { Dumbbell } from 'lucide-react';

interface Set {
  kg: number;
  reps: number;
}

interface Exercise {
  id: number;
  name: string;
  sets: Set[];
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-xl">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-800/20">
        <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3">
          <Dumbbell className="text-primary" size={20} />
          {exercise.name}
        </h3>
        <span className="text-[10px] font-black bg-black px-3 py-1 rounded-full text-zinc-500">
          {exercise.sets.length} SETS
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 px-2">
          <span>Set</span>
          <span>Weight</span>
          <span className="text-right">Reps</span>
        </div>
        <div className="space-y-2">
          {exercise.sets.map((set, i) => (
            <div
              key={i}
              className="grid grid-cols-3 p-3 bg-black/40 rounded-xl border border-zinc-800/50"
            >
              <span className="text-zinc-500 font-bold italic">#{i + 1}</span>
              <span className="font-black text-zinc-200">{set.kg} KG</span>
              <span className="text-right font-black text-primary">{set.reps}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
