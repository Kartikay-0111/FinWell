
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCurrentUserReturn {
  userId: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        // Set the user ID if session exists
        if (session?.user) {
          setUserId(session.user.id);
        }
        
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch current user'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { userId, isLoading, error };
}
