import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'test_user' })),
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(() => ({ isSignedIn: true, user: { id: 'test_user' } })),
  useAuth: vi.fn(() => ({ isLoaded: true, userId: 'test_user' })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000';

global.fetch = vi.fn();
