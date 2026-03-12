'use client';

import { useState } from 'react';
import { EditNameModalProps } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditNameModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  title,
}: EditNameModalProps) {
  const [currentValue, setCurrentValue] = useState(initialName);

  const handleUpdate = () => {
    if (!currentValue.trim()) return;
    onSave(currentValue.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        key={`${isOpen}-${initialName}`}
        className="bg-zinc-950 border-zinc-800 text-white"
      >
        <DialogHeader>
          <DialogTitle className="uppercase italic font-black tracking-tighter text-xl">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="bg-zinc-900 border-zinc-800 focus:border-primary"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-zinc-400" type="button">
            Cancel
          </Button>
          <Button onClick={handleUpdate} className="bg-primary text-black font-bold">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
