
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe()
  }, [navigate, toast])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error }
      }
      
      navigate('/dashboard')
      return { error: null }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error }
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return { error }
      }
      
      toast({
        title: "Signup successful",
        description: "Please check your email for verification.",
      });
      
      return { error: null }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return { error }
      }
      
      navigate('/login')
      return { error: null }
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return { error }
    }
  }

  // Function to update user's salary
  const updateSalary = async (salary: number) => {
    if (!user) return { error: new Error('User not authenticated') };
    
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError) {
        toast({
          title: "Error checking user profile",
          description: fetchError.message,
          variant: "destructive",
        });
        return { error: fetchError };
      }
      
      // If user exists, update. Otherwise, insert.
      let operation;
      if (existingUser) {
        operation = supabase
          .from('users')
          .update({ income: salary })
          .eq('id', user.id);
      } else {
        operation = supabase
          .from('users')
          .insert([{ id: user.id, income: salary }]);
      }
      
      const { error: updateError } = await operation;
      
      if (updateError) {
        toast({
          title: "Failed to update salary",
          description: updateError.message,
          variant: "destructive",
        });
        return { error: updateError };
      }
      
      toast({
        title: "Salary updated",
        description: "Your salary information has been saved.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Failed to update salary",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateSalary
  }
}
