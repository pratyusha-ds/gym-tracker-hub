'use server';

import { CategoryTemplateValues } from '@/lib/schemas';
import { API_BASE_URL } from '@/lib/constants';
import { getAuthHeaders, handleResponse } from '@/lib/api-utils';

// CREATE CATEGORY
export async function createCategoryAction(data: CategoryTemplateValues) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return await handleResponse(res, 'Failed to create category', '/categories');
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
    return await handleResponse(res, 'Failed to update category', '/categories');
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
    return await handleResponse(res, 'Failed to delete category', '/categories');
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
    return await handleResponse(res, 'Failed to add exercise', '/categories');
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
    return await handleResponse(res, 'Failed to update exercise', '/categories');
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
    return await handleResponse(res, 'Failed to delete exercise', '/categories');
  } catch {
    return { success: false, error: 'Server connection failed' };
  }
}
