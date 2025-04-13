
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import SalaryForm from "./components/SalaryForm";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Challenges from "./pages/Challenges";
import ChatBot from "./components/ChatBot";
import InsightsPage from "./pages/insightspage";
import DashboardInsight from "./pages/Insights";
import EnhancedLandingPage from "./pages/landing";

// Other Pages
import NotFound from "./pages/NotFound";

// Layout Components
import DashboardLayout from "./components/layouts/DashboardLayout";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Wrapper component for protected routes that need authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);

      if (data.session) {
        // Check if user has provided profile info
        const { data: userData, error } = await supabase
          .from('users')
          .select('name, income')
          .eq('id', data.session.user.id)
          .maybeSingle();

        if (!error && userData && userData.name && userData.income) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-finDarkBlue">
      <span className="text-finWhite">Loading...</span>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && hasProfile === false) {
    return <SalaryForm />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="landing" element={<EnhancedLandingPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="goals" element={<Goals />} />
              <Route path="reports" element={<Reports />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="gemini" element={<InsightsPage />} />
              <Route path="insights" element={<DashboardInsight />} />
              
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global floating chat bot button - only show for authenticated users */}
          <ChatBotWrapper />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Only render ChatBot if user is authenticated
const ChatBotWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isAuthenticated) return null;
  
  return <ChatBot />;
};

export default App;
