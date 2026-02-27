'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-100 bg-zinc-950 border-red-900/50 text-white">
        <DialogHeader className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-center">
            Delete <span className="text-red-500">{itemName}</span>?
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center text-sm">
            This action cannot be undone. All exercises within this category will be removed from
            your library.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
          >
            CANCEL
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {loading ? 'DELETING...' : 'DELETE'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
