import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalendarPage from '@/app/history/page';
import * as actions from '@/app/history/actions';
import { useAuth } from '@clerk/nextjs';

vi.mock('@/app/history/actions', () => ({
  getWorkoutSessions: vi.fn(),
  deleteWorkoutSession: vi.fn(),
}));

describe('CalendarPage Component', () => {
  const mockSessions = [
    { id: 1, date: '2026-03-12', sets: [] },
    { id: 2, date: '2026-03-15', sets: [] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as any).mockReturnValue({
      isLoaded: true,
      getToken: () => Promise.resolve('test-token'),
      userId: 'test_user',
    });

    (actions.getWorkoutSessions as any).mockResolvedValue(mockSessions);
  });

  it('renders the logbook header and current month', () => {
    render(<CalendarPage />);
    expect(screen.getByText(/Logbook/i)).toBeInTheDocument();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    expect(screen.getByText(new RegExp(currentMonth, 'i'))).toBeInTheDocument();
  });

  it('fetches sessions and highlights workout days', async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(actions.getWorkoutSessions).toHaveBeenCalled();
    });

    const dayTwelve = screen.getByText('12');
    expect(dayTwelve.closest('a')).toHaveAttribute('href', '/history/2026-03-12');
  });

  it('navigates to the next month when clicking the right arrow', async () => {
    render(<CalendarPage />);

    const navButtons = screen.getAllByRole('button');
    const nextButton = navButtons.find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-chevron-right')
    );

    if (nextButton) {
      fireEvent.click(nextButton);
      const nextMonthDate = new Date();
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const nextMonthName = nextMonthDate.toLocaleString('default', { month: 'long' });
      expect(screen.getByText(new RegExp(nextMonthName, 'i'))).toBeInTheDocument();
    }
  });

  it('shows the Jump To overlay when clicking Target button', () => {
    render(<CalendarPage />);
    const targetBtn = screen.getByRole('button', { name: /Jump to Month/i });
    fireEvent.click(targetBtn);

    expect(screen.getByText(/Quick Navigation/i)).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    (actions.getWorkoutSessions as any).mockRejectedValue(new Error('Fetch failed'));

    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load history/i)).toBeInTheDocument();
    });
  });
});
