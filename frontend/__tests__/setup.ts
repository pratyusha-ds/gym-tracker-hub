import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'test_user_id' })),
  currentUser: vi.fn(() =>
    Promise.resolve({
      id: 'test_user_id',
      fullName: 'Test User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    })
  ),
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({
    isSignedIn: true,
    user: { id: 'test_user_id', fullName: 'Test User' },
  })),
  useAuth: vi.fn(() => ({ isLoaded: true, userId: 'test_user_id' })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';

global.fetch = vi.fn();
