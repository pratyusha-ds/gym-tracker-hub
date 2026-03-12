import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import * as actions from '@/app/categories/actions';

vi.mock('@/app/categories/actions', () => ({
  createCategoryAction: vi.fn(() => Promise.resolve({ success: true })),
}));

describe('AddCategoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a new exercise input field when the plus button is clicked', async () => {
    render(<AddCategoryModal />);

    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    const exercisesHeader = screen.getByRole('heading', { name: /^exercises$/i });
    const exercisesSection = exercisesHeader.closest('div');
    const addBtn = exercisesSection?.querySelector('button');

    if (!addBtn) throw new Error('Add Exercise button not found');

    fireEvent.click(addBtn);

    const inputs = screen.getAllByPlaceholderText(/Exercise name.../i);
    expect(inputs.length).toBe(1);
  });

  it('shows a validation error if the category name is missing on submit', async () => {
    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button'));

    const submitBtn = screen.getByRole('button', { name: /confirm save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const errorMsg =
        screen.queryByText(/String must contain at least/i) ||
        screen.queryByText(/Required/i) ||
        screen.queryByText(/Category name is required/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  it('calls createCategoryAction with correct data when submitted', async () => {
    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button'));

    const nameInput = screen.getByPlaceholderText(/e.g. Chest/i);
    fireEvent.change(nameInput, { target: { value: 'Back' } });

    const submitBtn = screen.getByRole('button', { name: /confirm save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.createCategoryAction).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Back' })
      );
    });
  });
});
