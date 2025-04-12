
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-finDarkBlue">
        <Loader2 className="h-8 w-8 text-finOrange animate-spin" />
      </div>
    );
  }

  return null;
};

export default Index;
