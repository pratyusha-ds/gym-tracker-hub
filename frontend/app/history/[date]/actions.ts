'use client';

import { WorkoutSetDTO } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

export async function getSetsByDate(date: string, token: string): Promise<WorkoutSetDTO[]> {
  const response = await fetch(`${API_BASE_URL}/workout-sets/date/${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) return [];
  return response.json();
}

export async function updateWorkoutSet(
  setId: number,
  weight: number,
  reps: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/workout-sets/${setId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ weight, reps }),
  });

  if (!response.ok) throw new Error('Update failed');
}

export async function deleteWorkoutSet(setId: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/workout-sets/${setId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Delete failed');
}
