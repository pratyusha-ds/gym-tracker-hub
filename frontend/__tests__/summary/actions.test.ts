import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { getSetsByDate, updateWorkoutSet, deleteWorkoutSet } from '@/app/history/[date]/actions';

describe('Summary Actions', () => {
  const mockToken = 'test-token';

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('getSetsByDate returns data on success', async () => {
    const mockData = [{ id: 1, exerciseName: 'Bench Press', weight: 100, reps: 10 }];
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getSetsByDate('2026-03-12', mockToken);
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/workout-sets/date/2026-03-12'),
      expect.any(Object)
    );
  });

  it('updateWorkoutSet sends PUT request with correct body', async () => {
    (global.fetch as Mock).mockResolvedValue({ ok: true });

    await updateWorkoutSet(1, 100, 10, mockToken);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/workout-sets/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ weight: 100, reps: 10 }),
      })
    );
  });

  it('deleteWorkoutSet sends DELETE request', async () => {
    (global.fetch as Mock).mockResolvedValue({ ok: true });

    await deleteWorkoutSet(1, mockToken);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/workout-sets/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
