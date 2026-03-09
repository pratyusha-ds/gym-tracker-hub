import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
  useAuth: vi.fn(),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

global.fetch = vi.fn();
