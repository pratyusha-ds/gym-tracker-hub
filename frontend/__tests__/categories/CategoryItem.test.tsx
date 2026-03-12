import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryItem from '@/app/categories/CategoryItem';

const mockCategory = {
  id: 1,
  name: 'Strength',
  exercises: [{ id: 1, name: 'Deadlift' }],
};

describe('CategoryItem Component', () => {
  it('toggles the exercise list when clicked', () => {
    render(<CategoryItem category={mockCategory} />);
    const card = screen.getByText('Strength');
    fireEvent.click(card);
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  it('opens delete confirmation modal when the delete icon is clicked', () => {
    render(<CategoryItem category={mockCategory} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(screen.getByRole('heading', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /DELETE/ })).toBeInTheDocument();
  });
});
