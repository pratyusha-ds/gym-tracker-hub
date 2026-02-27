import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddCategoryModal from '@/components/categories/AddCategoryModal';

vi.mock('@/app/categories/actions', () => ({
  createCategoryAction: vi.fn(() => Promise.resolve({ success: true })),
}));

describe('AddCategoryModal', () => {
  it('adds a new exercise input field when the plus button is clicked', async () => {
    render(<AddCategoryModal />);

    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    const exercisesHeader = screen.getByRole('heading', { name: /^exercises$/i });

    const exercisesSection = exercisesHeader.closest('div');
    const addBtn = exercisesSection?.querySelector('button');

    if (!addBtn) throw new Error('Add Exercise button not found in section');

    fireEvent.click(addBtn);

    const inputs = screen.getAllByPlaceholderText(/Exercise name.../i);
    expect(inputs.length).toBe(1);
  });

  it('shows a validation error if the category name is missing on submit', async () => {
    render(<AddCategoryModal />);

    fireEvent.click(screen.getByRole('button'));

    const submitBtn = screen.getByText(/Confirm Save/i);
    fireEvent.click(submitBtn);
    await waitFor(() => {
      const errorMsg =
        screen.queryByText(/required/i) || screen.queryByText(/String must contain at least/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });
});
