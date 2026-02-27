'use client';

import { CategoryCardProps } from '@/types';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CategoryCard({ category, isOpen, onDelete, onEdit }: CategoryCardProps) {
  return (
    <div
      className={cn(
        'flex justify-between items-center p-5 transition-all duration-300 border-b border-zinc-900',
        isOpen ? 'bg-zinc-800/40' : 'hover:bg-zinc-900/50'
      )}
    >
      <div className="flex items-center gap-4">
        <ChevronRight
          size={20}
          className={cn('text-primary transition-transform duration-300', isOpen && 'rotate-90')}
        />
        <h2
          className={cn(
            'text-lg font-black uppercase italic tracking-tighter transition-colors',
            isOpen ? 'text-primary' : 'text-white'
          )}
        >
          {category.name}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
          className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-full"
        >
          <Pencil size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category.id);
          }}
          className="h-9 w-9 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
