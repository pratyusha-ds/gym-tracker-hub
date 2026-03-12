import { vi, type Mock } from 'vitest';

vi.mock('@/lib/constants', () => ({
  API_BASE_URL: 'http://localhost:5000',
}));

vi.mock('@/lib/api-utils', () => ({
  getAuthHeaders: vi.fn(() => Promise.resolve({ Authorization: 'Bearer test-token' })),
}));

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CategoryList from '@/app/categories/CategoryList';

global.fetch = vi.fn();
const mockedFetch = fetch as Mock;

describe('CategoryList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';
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

  it('renders category items when data is returned', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, name: 'Legs', exercises: [] }],
    });

    const result = await CategoryList({ query: '' });
    render(result);

    const item = await screen.findByText(/Legs/i);
    expect(item).toBeInTheDocument();
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
});
