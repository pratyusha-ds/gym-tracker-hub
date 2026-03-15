import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import * as actions from '@/app/categories/actions';

vi.mock('@/app/categories/actions', () => ({
  createCategoryAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe('AddCategoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a new exercise input field when the plus button is clicked', async () => {
    render(<AddCategoryModal />);

    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);

    let inputs = await screen.findAllByPlaceholderText(/Exercise name.../i);
    expect(inputs.length).toBe(1);

    const addBtn = screen
      .getByRole('button', { name: '' })
      .parentElement?.querySelector('button[type="button"]');
    if (!addBtn) throw new Error('Add Exercise button not found');

    fireEvent.click(addBtn);

    inputs = await screen.findAllByPlaceholderText(/Exercise name.../i);
    expect(inputs.length).toBe(2);
  });

  it('shows a validation error if the category name is missing on submit', async () => {
    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button'));

    const submitBtn = screen.getByRole('button', { name: /confirm save/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Category name is required/i)).toBeInTheDocument();
    });
  });

  it('calls createCategoryAction with correct data when submitted', async () => {
    render(<AddCategoryModal />);
    fireEvent.click(screen.getByRole('button'));

    const nameInput = screen.getByPlaceholderText(/e.g. Chest/i);
    fireEvent.change(nameInput, { target: { value: 'Back' } });

    const exerciseInputs = screen.getAllByPlaceholderText(/Exercise name.../i);
    fireEvent.change(exerciseInputs[0], { target: { value: 'Pullups' } });

    const submitBtn = screen.getByRole('button', { name: /confirm save/i });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(actions.createCategoryAction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Back',
          exercises: expect.arrayContaining([expect.objectContaining({ name: 'Pullups' })]),
        })
      );
    });
  });
});
