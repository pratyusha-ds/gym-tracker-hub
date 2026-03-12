import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActiveWorkout from '@/components/exercises/ActiveWorkout';

describe('ActiveWorkout UI logic', () => {
  const mockSets = [{ id: 1, weight: '50', reps: '12', completed: false }];
  const mockHandlers = {
    onAddSet: vi.fn(),
    onUpdateSet: vi.fn(),
    onSaveSet: vi.fn(),
    onDeleteSet: vi.fn(),
  };

  it('triggers onUpdateSet when weight changes', () => {
    render(<ActiveWorkout sets={mockSets} {...mockHandlers} />);
    const weightInput = screen.getByDisplayValue('50');
    fireEvent.change(weightInput, { target: { value: '60' } });
    expect(mockHandlers.onUpdateSet).toHaveBeenCalledWith(1, 'weight', '60');
  });

  it('triggers onSaveSet when input loses focus (blur)', () => {
    render(<ActiveWorkout sets={mockSets} {...mockHandlers} />);
    const repsInput = screen.getByDisplayValue('12');
    fireEvent.blur(repsInput);
    expect(mockHandlers.onSaveSet).toHaveBeenCalledWith(1);
  });

  it('triggers onDeleteSet when the trash button is clicked', () => {
    render(<ActiveWorkout sets={mockSets} {...mockHandlers} />);

    const deleteBtn = screen.getByRole('button', { name: /delete set/i });

    fireEvent.click(deleteBtn);
    expect(mockHandlers.onDeleteSet).toHaveBeenCalledWith(1);
  });

  it('triggers onAddSet when clicking Add New Set', () => {
    render(<ActiveWorkout sets={mockSets} {...mockHandlers} />);
    const addBtn = screen.getByText(/ADD NEW SET/i);
    fireEvent.click(addBtn);
    expect(mockHandlers.onAddSet).toHaveBeenCalled();
  });
});
