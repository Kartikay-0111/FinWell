
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the code and state from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    
    // If we have a code, exchange it for a session
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error exchanging code for session:', error);
            setError('Authentication failed. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
          } else if (data.session) {
            console.log('Auth success, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            setError('No session data returned. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
          }
        });
    } else {
      setError('No authentication code found. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-finDarkBlue">
      {error ? (
        <div className="text-finOrange text-xl">{error}</div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-finOrange animate-spin mb-4" />
          <p className="text-finWhite text-xl">Authenticating...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
