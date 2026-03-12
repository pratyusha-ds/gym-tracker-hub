'use client';

import { WorkoutSessionDTO } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

export async function getWorkoutSessions(token: string): Promise<WorkoutSessionDTO[]> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

export async function deleteWorkoutSession(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete workout session');
  }
}
