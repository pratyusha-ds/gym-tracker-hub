import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '@/components/exercises/Header';

describe('Header Component', () => {
  const mockProps = {
    exerciseName: 'Squats',
    onFinish: vi.fn(),
  };

  it('renders the exercise name correctly', () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText(/SQUATS/i)).toBeInTheDocument();
  });

  it('calls onFinish when Finish Workout button is clicked', () => {
    render(<Header {...mockProps} />);
    const finishBtn = screen.getByText(/FINISH WORKOUT/i);
    fireEvent.click(finishBtn);
    expect(mockProps.onFinish).toHaveBeenCalledTimes(1);
  });

  it('contains a link to the summary page', () => {
    render(<Header {...mockProps} />);
    const summaryBtn = screen.getByRole('link', { name: /VIEW SUMMARY/i });
    expect(summaryBtn).toHaveAttribute('href', expect.stringContaining('/history/'));
  });
});
