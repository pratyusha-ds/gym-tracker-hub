import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { getWorkoutSessions } from '@/app/history/actions';

describe('History Actions', () => {
  const mockToken = 'test-token';

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('getWorkoutSessions returns data on success', async () => {
    const mockData = [{ id: 1, date: '2026-01-01', sets: [] }];

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getWorkoutSessions(mockToken);

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sessions'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      })
    );
  });

  it('getWorkoutSessions throws error on server failure', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getWorkoutSessions(mockToken)).rejects.toThrow('Server error: 500');
  });
});
