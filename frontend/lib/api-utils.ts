import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getAuthHeaders() {
  const { getToken } = await auth();
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function handleResponse(
  res: Response,
  errorMessage: string,
  path: string = '/categories'
) {
  if (res.ok) {
    revalidatePath(path);
    return { success: true };
  }

  if (res.status === 401 || res.status === 403) {
    return { success: false, error: 'Unauthorized: Please log in again.' };
  }

  try {
    const errorData = await res.json();
    return { success: false, error: errorData.message || errorMessage };
  } catch {
    return { success: false, error: errorMessage };
  }
}
