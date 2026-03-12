import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WorkoutSessionPage from '@/app/exercises/[exerciseId]/page';
import React from 'react';

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    use: (promise: unknown) => {
      if (promise && typeof (promise as Promise<unknown>).then === 'function') {
        return { exerciseId: '1' };
      }

      const originalUse = actual.use as (p: unknown) => unknown;
      return originalUse(promise);
    },
  };
});

vi.mock('@/app/exercises/[exerciseId]/actions', () => ({
  fetchExerciseData: vi.fn().mockResolvedValue({ id: 1, name: 'Bench Press' }),
  fetchSetsByDate: vi.fn().mockResolvedValue([{ id: 101, weight: 80, reps: 10, exerciseId: 1 }]),
  fetchAllSessions: vi.fn().mockResolvedValue([]),
  saveSetAction: vi.fn(),
  deleteSetAction: vi.fn(),
}));

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isLoaded: true,
    userId: 'test_user',
    getToken: vi.fn().mockResolvedValue('mock-token'),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

describe('WorkoutSessionPage', () => {
  it('should render exercise data and initial sets', async () => {
    const paramsPromise = Promise.resolve({ exerciseId: '1' });

    render(<WorkoutSessionPage params={paramsPromise} />);

    const weightInput = await screen.findByDisplayValue('80', {}, { timeout: 5000 });

    expect(weightInput).toBeInTheDocument();
    expect(screen.getByText(/BENCH PRESS/i)).toBeInTheDocument();
  });
});
