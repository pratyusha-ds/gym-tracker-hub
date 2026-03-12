import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchExerciseData, saveSetAction } from '@/app/exercises/[exerciseId]/actions';

const fetchSpy = vi.spyOn(global, 'fetch');

describe('Exercise Actions', () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it('fetchExerciseData calls the correct endpoint', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'Bench Press' }),
    } as Response);

    const data = await fetchExerciseData('1', 'mock-token');

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/exercises/1'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer mock-token' },
      })
    );
    expect(data.name).toBe('Bench Press');
  });

  it('saveSetAction uses POST for new sets', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 500 }),
    } as Response);

    const payload = {
      id: null,
      weight: 100,
      reps: 5,
      exerciseId: 1,
      date: '2026-03-12',
    };

    await saveSetAction('token', payload, true);

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\/workout-sets$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('throws an error when the fetch fails', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchExerciseData('1', 'token')).rejects.toThrow('Failed to fetch exercise');
  });
});
