import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  createExerciseAction,
  updateExerciseAction,
  deleteExerciseAction,
} from '@/app/categories/actions';

vi.mock('@/lib/constants', () => ({
  API_BASE_URL: 'http://localhost:5000',
}));

vi.mock('@/lib/api-utils', () => ({
  getAuthHeaders: vi.fn(() => Promise.resolve({ Authorization: 'Bearer test-token' })),
  handleResponse: vi.fn(async (res, defaultError) => {
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || defaultError };
    }
    return { success: true, data };
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

global.fetch = vi.fn();
const mockedFetch = fetch as Mock;

describe('Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Category Actions', () => {
    it('should return success if create API call works', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'Chest' }),
      });
      const result = await createCategoryAction({ name: 'Chest', exercises: [] });
      expect(result.success).toBe(true);
    });

    it('should return error if category name is empty', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Category name is required' }),
      });
      const result = await createCategoryAction({ name: '', exercises: [] });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Category name is required');
    });

    it('should return success if delete API call works', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Deleted' }),
      });
      const result = await deleteCategoryAction(1);
      expect(result.success).toBe(true);
    });

    it('should return error if update name is empty', async () => {
      const result = await updateCategoryAction(1, '  ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid name');
    });

    it('should return error if delete is called without an ID', async () => {
      // @ts-expect-error - testing invalid input
      const result = await deleteCategoryAction(undefined);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Server connection failed');
    });
  });

  describe('Exercise Actions', () => {
    it('should return success if exercise creation works', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 101, name: 'Pushups' }),
      });
      const result = await createExerciseAction(1, 'Pushups');
      expect(result.success).toBe(true);
    });

    it('should return success if exercise update works', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 10, name: 'Bench Press' }),
      });
      const result = await updateExerciseAction(10, 'Incline Press');
      expect(result.success).toBe(true);
    });

    it('should return success if exercise deletion works', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Exercise Deleted' }),
      });
      const result = await deleteExerciseAction(10);
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle API 500 errors', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Database Error' }),
      });
      const result = await createCategoryAction({ name: 'Back', exercises: [] });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database Error');
    });
  });
});
