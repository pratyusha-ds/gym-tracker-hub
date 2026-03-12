import { API_BASE_URL } from '@/lib/constants';

export async function fetchExerciseData(exerciseId: string, token: string | null) {
  const res = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch exercise');
  return res.json();
}

export async function fetchSetsByDate(date: string, token: string | null) {
  const res = await fetch(`${API_BASE_URL}/workout-sets/date/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch sets');
  return res.json();
}

export async function saveSetAction(
  token: string | null,
  payload: {
    id: number | null;
    weight: number;
    reps: number;
    exerciseId: number;
    date: string;
  },
  isNew: boolean
) {
  const url = isNew ? `${API_BASE_URL}/workout-sets` : `${API_BASE_URL}/workout-sets/${payload.id}`;
  const res = await fetch(url, {
    method: isNew ? 'POST' : 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save set');
  return res.json();
}

export async function deleteSetAction(id: number, token: string | null) {
  const res = await fetch(`${API_BASE_URL}/workout-sets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete set');
  return true;
}

export async function fetchAllSessions(token: string | null) {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch session history');
  return res.json();
}
