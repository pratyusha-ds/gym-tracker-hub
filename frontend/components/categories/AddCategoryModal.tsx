'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2, Dumbbell } from 'lucide-react';
import { categoryTemplateSchema, type CategoryTemplateValues } from '@/lib/schemas';
import { createCategoryAction } from '@/app/categories/actions';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redTingeStyle = {
    background: '#09090b',
    color: '#ef4444',
    border: '1px solid #7f1d1d',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  };

  const form = useForm<CategoryTemplateValues>({
    resolver: zodResolver(categoryTemplateSchema),
    defaultValues: { name: '', exercises: [] },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const resetEverything = useCallback(() => {
    replace([]);
    form.reset({ name: '', exercises: [] });
  }, [replace, form]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => resetEverything(), 150);
      return () => clearTimeout(timer);
    }
  }, [open, resetEverything]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      resetEverything();
    }
    setOpen(newOpen);
  };

  async function onSubmit(data: CategoryTemplateValues) {
    setIsSubmitting(true);
    try {
      const result = await createCategoryAction(data);

      if (result && result.success) {
        setOpen(false);
        setTimeout(() => {
          toast('Successfully Added', { style: redTingeStyle });
          setIsSubmitting(false);
        }, 300);
      } else {
        toast.error(result?.error || 'Could not save', {
          style: { background: '#ef4444', color: '#fff', border: 'none' },
        });
        setIsSubmitting(false);
      }
    } catch {
      toast.error('Connection failed', { style: { background: '#ef4444', color: '#fff' } });
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-black shadow-xl"
          size="icon"
          disabled={isSubmitting}
        >
          <Plus className="h-8 w-8" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25 bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            Add <span className="text-primary">Exercises</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 uppercase text-xs font-bold">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. Chest"
                      className="bg-zinc-900 border-zinc-800 focus:border-primary h-12 disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Exercises
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isSubmitting}
                  onClick={() => append({ name: '' })}
                  className="h-8 w-8 bg-zinc-900 hover:bg-primary hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Exercise name..."
                            {...field}
                            disabled={isSubmitting}
                            className="h-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 disabled:opacity-50"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                    className="text-zinc-500 hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 font-black uppercase italic tracking-widest text-lg"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
