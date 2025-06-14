
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
import BookmarksPage from "./pages/BookmarksPage";
import DoubtsPage from "./pages/DoubtsPage";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    console.log('AppContent - Auth state:', { user, profile, isLoading });
    
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
  }, [user, profile, isLoading]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showLanding) {
    return <Landing onGetStarted={handleLandingComplete} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // If user exists but no profile, still show the main app (profile will be created/fetched)
  if (!user) {
    return <Auth onBack={handleBackToLanding} />;
  }

  return (
    <SyllabusProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/doubts" element={<DoubtsPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
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
