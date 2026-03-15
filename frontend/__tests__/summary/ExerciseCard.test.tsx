import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExerciseCard } from '@/components/history/summary/ExerciseCard';
import { WorkoutSetDTO } from '@/types';

describe('ExerciseCard Component', () => {
  const mockSets: WorkoutSetDTO[] = [
    {
      id: 1,
      exerciseName: 'Deadlift',
      weight: 140,
      reps: 5,
      exerciseId: 101,
      date: '2026-03-12',
    },
  ];

  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockDate = '2026-03-12';

  it('shows the delete confirmation modal when trash is clicked', () => {
    render(
      <ExerciseCard
        exerciseName="Deadlift"
        sets={mockSets}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        date={mockDate}
      />
    );

    const trashBtn = screen.getByLabelText('delete-set');
    fireEvent.click(trashBtn);

    expect(screen.getByText(/Remove Set\?/i)).toBeInTheDocument();
  });

  it('calls onDelete when confirm delete is clicked', () => {
    render(
      <ExerciseCard
        exerciseName="Deadlift"
        sets={mockSets}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        date={mockDate}
      />
    );

    fireEvent.click(screen.getByLabelText('delete-set'));

    const confirmBtn = screen.getByRole('button', { name: /^Delete$/ });
    fireEvent.click(confirmBtn);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('calls onUpdate when input loses focus (onBlur)', () => {
    render(
      <ExerciseCard
        exerciseName="Deadlift"
        sets={mockSets}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        date={mockDate}
      />
    );

    const weightInput = screen.getByDisplayValue('140');
    fireEvent.change(weightInput, { target: { value: '150' } });
    fireEvent.blur(weightInput);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, 150, 5);
  });
});
