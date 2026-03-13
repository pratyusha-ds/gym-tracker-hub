import { vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CategoryList from '@/app/categories/CategoryList';
import { syncUserAction } from '@/app/categories/actions';

vi.mock('@/app/categories/actions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/categories/actions')>();
  return {
    ...actual,
    syncUserAction: vi.fn(() => Promise.resolve(true)),
  };
});

vi.mock('@/lib/constants', () => ({
  API_BASE_URL: 'http://localhost:8080/api',
}));

vi.mock('@/lib/api-utils', () => ({
  getAuthHeaders: vi.fn(() => Promise.resolve({ Authorization: 'Bearer test-token' })),
}));

global.fetch = vi.fn();
const mockedFetch = fetch as Mock;

describe('CategoryList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';
    (syncUserAction as Mock).mockResolvedValue(true);
  });

  it('renders category items and calls syncUserAction with data', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, name: 'Legs', exercises: [] }],
    });

    const result = await CategoryList({ query: '' });
    render(result);

    const item = await screen.findByText(/Legs/i);
    expect(item).toBeInTheDocument();

    expect(syncUserAction).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('shows empty state when no categories exist', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [],
    });

    const result = await CategoryList({ query: '' });
    render(result);

    expect(screen.getByText(/Your library is empty/i)).toBeInTheDocument();
  });

  it('shows "System Offline" box when fetch fails', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await CategoryList({ query: '' });
    render(result);

    expect(screen.getByText(/System Offline/i)).toBeInTheDocument();
  });
});
