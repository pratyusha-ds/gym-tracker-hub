'use client';

import { useState } from 'react';
import { Category, Exercise, EditTarget } from '@/types';
import {
  deleteCategoryAction,
  deleteExerciseAction,
  updateCategoryAction,
  updateExerciseAction,
} from '@/app/categories/actions';
import CategoryCard from '@/components/categories/CategoryCard';
import ExerciseList from '@/components/categories/ExerciseList';
import EditNameModal from '@/components/categories/EditNameModal';
import DeleteConfirmModal from '@/components/categories/DeleteConfirmModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CategoryItem({
  category,
  historyDate,
}: {
  category: Category;
  historyDate?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  const redTingeStyle = {
    background: '#09090b',
    color: '#ef4444',
    border: '1px solid #7f1d1d',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setIsDeleteModalOpen(false);

    const result = await deleteCategoryAction(category.id);

    if (result.success) {
      toast(`${category.name} REMOVED`, { style: redTingeStyle });
    } else {
      toast.error(result.error || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const handleEditCategory = (c: Category) => {
    setEditTarget({ id: c.id, name: c.name, type: 'category' });
    setIsEditModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditTarget({ id: exercise.id, name: exercise.name, type: 'exercise' });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (newName: string) => {
    if (!editTarget) return;

    const result = await (editTarget.type === 'category'
      ? updateCategoryAction(editTarget.id, newName)
      : updateExerciseAction(editTarget.id, newName));

    if (result.success) {
      toast(`${editTarget.type.toUpperCase()} UPDATED`, { style: redTingeStyle });
      setIsEditModalOpen(false);
    } else {
      toast.error(result.error || 'Update failed');
    }
  };

  return (
    <div
      className={cn(
        'group border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 transition-all duration-300',
        isOpen ? 'border-zinc-700 ring-1 ring-zinc-800' : 'hover:border-zinc-700',
        isDeleting && 'opacity-30 scale-95 pointer-events-none grayscale'
      )}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="active:bg-zinc-900 transition-colors cursor-pointer"
      >
        <CategoryCard
          category={category}
          isOpen={isOpen}
          onDelete={() => setIsDeleteModalOpen(true)}
          onEdit={() => handleEditCategory(category)}
        />
      </div>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden border-t border-zinc-900 bg-zinc-900/20">
          <ExerciseList
            exercises={category.exercises}
            onDeleteExercise={deleteExerciseAction}
            onEditExercise={handleEditExercise}
            historyDate={historyDate}
          />
        </div>
      </div>

      <EditNameModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialName={editTarget?.name || ''}
        title={`Rename ${editTarget?.type || 'Item'}`}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={category.name}
        loading={isDeleting}
      />
    </div>
  );
}
