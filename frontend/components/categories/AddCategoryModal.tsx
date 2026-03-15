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

interface AddCategoryModalProps {
  initialCategoryName?: string;
  trigger?: React.ReactNode;
}

export default function AddCategoryModal({
  initialCategoryName = '',
  trigger,
}: AddCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const redTingeStyle = {
    background: '#09090b',
    color: '#ef4444',
    border: '1px solid #7f1d1d',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
  };

  const form = useForm<CategoryTemplateValues>({
    resolver: zodResolver(categoryTemplateSchema),
    defaultValues: {
      name: initialCategoryName,
      exercises: [{ name: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const resetEverything = useCallback(() => {
    form.reset({
      name: initialCategoryName,
      exercises: [{ name: '' }],
    });
  }, [form, initialCategoryName]);

  useEffect(() => {
    if (open) {
      form.setValue('name', initialCategoryName);
      if (fields.length === 0) replace([{ name: '' }]);

      setTimeout(() => {
        if (!initialCategoryName) {
          form.setFocus('name');
        } else {
          form.setFocus('exercises.0.name');
        }
      }, 150);
    }
  }, [open, initialCategoryName, form, replace, fields.length]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(() => resetEverything(), 150);
    }
    setOpen(newOpen);
  };

  async function onSubmit(data: CategoryTemplateValues) {
    setIsSubmitting(true);
    try {
      const result = await createCategoryAction(data);
      if (result && result.success) {
        setOpen(false);
        toast.success(`${data.name.toUpperCase()} UPDATED`, { style: redTingeStyle });
        resetEverything();
      } else {
        toast.error(result?.error || 'Could not save');
      }
    } catch {
      toast.error('Connection failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-black shadow-xl z-50"
            size="icon"
            disabled={isSubmitting}
          >
            <Plus className="h-8 w-8" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25 bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
            {initialCategoryName ? 'Add' : 'Create'} <span className="text-primary">Exercises</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 uppercase text-xs font-bold tracking-widest">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting || !!initialCategoryName}
                      placeholder="e.g. Chest"
                      className="bg-zinc-900 border-zinc-800 focus:border-primary h-12 disabled:opacity-70 font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
                  <Dumbbell className="w-4 h-4" /> Exercises
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => append({ name: '' })}
                  className="h-8 w-8 bg-zinc-900 hover:bg-primary hover:text-black transition-colors"
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
                            className="h-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 font-black uppercase italic tracking-widest text-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
