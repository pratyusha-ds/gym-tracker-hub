'use client';

import { useState } from 'react';
import { Exercise, ExerciseListProps } from '@/types';
import { Dumbbell, Trash2, ChevronRight, Pencil, Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/categories/DeleteConfirmModal';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ExtendedExerciseListProps extends ExerciseListProps {
  categoryName: string;
  historyDate?: string;
}

export default function ExerciseList({
  exercises,
  onDeleteExercise,
  onEditExercise,
  categoryName,
  historyDate,
}: ExtendedExerciseListProps) {
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const redTingeStyle = {
    background: '#09090b',
    color: '#ef4444',
    border: '1px solid #7f1d1d',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  };

  const handleConfirmDelete = async () => {
    if (!exerciseToDelete) return;
    setIsDeleting(true);
    try {
      const result = await onDeleteExercise(exerciseToDelete.id);
      if (result.success) {
        toast(`${exerciseToDelete.name} REMOVED`, { style: redTingeStyle });
        setExerciseToDelete(null);
      } else {
        toast.error(result.error || 'Failed to remove exercise');
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="p-8 text-center border-t border-zinc-900 flex flex-col items-center gap-3">
        <p className="text-zinc-500 italic text-sm">No exercises added yet.</p>
        <AddCategoryModal
          initialCategoryName={categoryName}
          trigger={
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-all py-1.5 px-5 border border-red-900/30 bg-red-950/20 rounded-full hover:border-red-500/50 hover:bg-red-950/40">
              <Plus size={12} className="stroke-[3px]" /> Add Exercise
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/50 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
      <ul className="divide-y divide-zinc-900">
        {exercises.map((ex) => (
          <li key={ex.id} className="group transition-colors hover:bg-zinc-900/50">
            <div className="p-4 flex items-center justify-between">
              <Link
                href={`/exercises/${ex.id}?name=${encodeURIComponent(ex.name)}${historyDate ? `&date=${historyDate}` : ''}`}
                className="flex items-center gap-3 flex-1"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) {
                    e.preventDefault();
                  }
                }}
              >
                <Dumbbell className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {ex.name}
                </p>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditExercise(ex)}
                  className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExerciseToDelete(ex)}
                  className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight
                  size={16}
                  className="text-zinc-700 group-hover:text-zinc-400 transition-colors ml-1"
                />
              </div>
            </div>
          </li>
        ))}

        <li className="p-3 bg-zinc-900/30 flex justify-center">
          <AddCategoryModal
            initialCategoryName={categoryName}
            trigger={
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-400 transition-all py-1.5 px-5 border border-red-900/30 bg-red-950/20 rounded-full hover:border-red-500/50 hover:bg-red-950/40">
                <Plus size={12} className="stroke-[3px]" /> Add Exercise
              </button>
            }
          />
        </li>
      </ul>

      <DeleteConfirmModal
        isOpen={!!exerciseToDelete}
        onClose={() => setExerciseToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={exerciseToDelete?.name || ''}
        loading={isDeleting}
      />
    </div>
  );
}
