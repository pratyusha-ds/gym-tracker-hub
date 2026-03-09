'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';

/**
 * The SyncUser component acts as a bridge between Clerk and the Spring Boot
 * backend by POSTing the authenticated user's email and name
 * to the sync endpoint whenever a login session is established.
 */
export default function SyncUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const sync = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const token = await getToken();

          await fetch(`${API_BASE_URL}/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName,
            }),
          });
        } catch (error) {
          console.error('Sync failed:', error);
        }
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user, getToken]);

  return null;
}
