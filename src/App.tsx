
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
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && !user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <SyllabusProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/doubts" element={<DoubtsPage />} />
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
