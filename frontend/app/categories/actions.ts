'use server';

import { revalidateTag } from 'next/cache';
import { CategoryTemplateValues } from '@/lib/schemas';
import { API_BASE_URL } from '@/lib/constants';
import { getAuthHeaders, handleResponse } from '@/lib/api-utils';

const invalidateCategoryCache = () => {
  //@ts-expect-error - Ignore the argument count error for the build
  revalidateTag('categories');
};

// CREATE CATEGORY
export async function createCategoryAction(data: CategoryTemplateValues) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await handleResponse(res, 'Failed to create category', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// UPDATE CATEGORY
export async function updateCategoryAction(id: number, newName: string) {
  if (!id || !newName.trim()) return { success: false, error: 'Invalid name' };
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ name: newName.trim() }),
    });
    const result = await handleResponse(res, 'Failed to update category', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// DELETE CATEGORY
export async function deleteCategoryAction(id: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers,
    });
    const result = await handleResponse(res, 'Failed to delete category', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// CREATE EXERCISE
export async function createExerciseAction(categoryId: number, name: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/exercises`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: name.trim(), categoryId }),
    });
    const result = await handleResponse(res, 'Failed to add exercise', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// UPDATE EXERCISE
export async function updateExerciseAction(id: number, name: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/exercises/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ name: name.trim() }),
    });
    const result = await handleResponse(res, 'Failed to update exercise', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// DELETE EXERCISE
export async function deleteExerciseAction(exerciseId: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`, {
      method: 'DELETE',
      headers,
    });
    const result = await handleResponse(res, 'Failed to delete exercise', '/categories');
    if (result.success) invalidateCategoryCache();
    return result;
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}

// SYNC USER
export async function syncUserAction(userData: { email: string; name: string }) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/users/sync`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.ok;
  } catch (error) {
    console.error('Sync Action Error:', error);
    return false;
  }
}
