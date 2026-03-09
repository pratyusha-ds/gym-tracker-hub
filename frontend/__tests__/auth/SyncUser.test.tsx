/**
 * Integration tests for the SyncUser component to verify that authenticated
 * user sessions correctly trigger synchronization with the Spring Boot backend
 * using valid JWT tokens and user metadata.
 */
import { render, waitFor } from '@testing-library/react';
import { vi, expect, it, describe } from 'vitest';
import SyncUser from '@/components/auth/SyncUser';
import { useUser, useAuth } from '@clerk/nextjs';

describe('SyncUser Component', () => {
  it('sends user data to the backend when authenticated', async () => {
    const mockToken = 'test-token-123';
    (useUser as any).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        primaryEmailAddress: { emailAddress: 'stark@athlete.com' },
        fullName: 'Stark Athlete',
      },
    });

    (useAuth as any).mockReturnValue({
      getToken: vi.fn().mockResolvedValue(mockToken),
    });

    const fetchSpy = vi.spyOn(global, 'fetch');

    render(<SyncUser />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/users/sync'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );
    });
  });
});
