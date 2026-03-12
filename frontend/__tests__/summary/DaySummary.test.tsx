import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DaySummaryPage from '@/app/history/[date]/page';
import * as actions from '@/app/history/[date]/actions';
import { useAuth } from '@clerk/nextjs';
import { WorkoutSetDTO } from '@/types';

vi.mock('react', async () => {
  const actual = await vi.importActual<any>('react');
  return {
    ...actual,
    use: (promise: any) => {
      if (promise && typeof promise.then === 'function') {
        return { date: '2026-03-12' };
      }
      return actual.use(promise);
    },
  };
});

vi.mock('@/app/history/[date]/actions', () => ({
  getSetsByDate: vi.fn(),
  updateWorkoutSet: vi.fn(),
  deleteWorkoutSet: vi.fn(),
}));

describe('DaySummaryPage', () => {
  const mockParams = Promise.resolve({ date: '2026-03-12' });

  const mockSets: WorkoutSetDTO[] = [
    {
      id: 1,
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 10,
      exerciseId: 101,
      date: '2026-03-12',
    },
    {
      id: 2,
      exerciseName: 'Bench Press',
      weight: 100,
      reps: 8,
      exerciseId: 101,
      date: '2026-03-12',
    },
    { id: 3, exerciseName: 'Squat', weight: 120, reps: 5, exerciseId: 102, date: '2026-03-12' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      isLoaded: true,
      getToken: () => Promise.resolve('test-token'),
    });
    (actions.getSetsByDate as any).mockResolvedValue(mockSets);
  });

  it('calculates and displays total volume and exercise count', async () => {
    render(<DaySummaryPage params={mockParams} />);

    const volumeValue = await screen.findByText(/2,400/i);
    expect(volumeValue).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders exercise cards grouped by name', async () => {
    render(<DaySummaryPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
      expect(screen.getByText(/Squat/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no sets exist', async () => {
    (actions.getSetsByDate as any).mockResolvedValue([]);
    render(<DaySummaryPage params={mockParams} />);

    const emptyMsg = await screen.findByText(/No data for this day/i);
    expect(emptyMsg).toBeInTheDocument();
  });
});
