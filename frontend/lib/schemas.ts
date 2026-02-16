import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.coerce.number().min(1, "Must have at least 1 set").max(99),
  reps: z.coerce.number().min(1, "Must have at least 1 rep").max(999),
  weight: z.coerce.number().optional(),
});

export const categorySchema = z.object({
  name: z.string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Name too long"),
  exercises: z.array(exerciseSchema).default([]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type ExerciseFormValues = z.infer<typeof exerciseSchema>;