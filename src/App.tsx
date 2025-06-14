import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SyllabusProvider } from "@/contexts/SyllabusContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import SyllabusPage from "./pages/SyllabusPage";
import QuestionsPage from "./pages/QuestionsPage";
import PredictorPage from "./pages/PredictorPage";
import DoubtsPage from "./pages/DoubtsPage";
import HistoryPage from "./pages/HistoryPage";
import MainLayout from "./components/MainLayout";

// Optimize query client for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground animate-pulse">Loading your study space...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    console.log('AppContent - Auth state:', { user: !!user, isLoading });
    
    if (isLoading) return;
    
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const hasSeenLanding = localStorage.getItem('hasSeenLanding');
    
    if (!user) {
      if (!hasSeenLanding) {
        setShowLanding(true);
      } else if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } else {
      // User is authenticated, clear any onboarding/landing flags
      setShowLanding(false);
      setShowOnboarding(false);
    }
  }, [user, isLoading]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleLandingComplete = () => {
    localStorage.setItem('hasSeenLanding', 'true');
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setShowOnboarding(false);
  };

  // Show loading spinner with better UX
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show landing page
  if (showLanding) {
    return <Landing onGetStarted={handleLandingComplete} />;
  }

  // Show onboarding
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show auth page if no user
  if (!user) {
    return <Auth onBack={handleBackToLanding} />;
  }

  // Show main app - user is authenticated
  return (
    <SyllabusProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/doubts" element={<DoubtsPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </SyllabusProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
