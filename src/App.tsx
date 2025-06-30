
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SyllabusProvider } from '@/contexts/SyllabusContext';
import { TimerProvider } from '@/contexts/TimerContext';
import MainLayout from '@/components/MainLayout';
import ExitPopup from '@/components/ExitPopup';
import QuickLoader from '@/components/QuickLoader';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import './App.css';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'));
const DoubtsPage = lazy(() => import('@/pages/DoubtsPage'));
const Profile = lazy(() => import('@/pages/Profile'));
const SyllabusPage = lazy(() => import('@/pages/SyllabusPage'));
const PredictorPage = lazy(() => import('@/pages/PredictorPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const TimerPage = lazy(() => import('@/pages/TimerPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const BadgesPage = lazy(() => import('@/pages/BadgesPage'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const ThemePage = lazy(() => import('@/pages/ThemePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Optimized QueryClient with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(!user);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem('onboarding_completed')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QuickLoader size="lg" text="Loading Axiom Smart Track..." />
      </div>
    );
  }

  if (showLanding) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (!user) {
    return <Auth />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <MainLayout>
      <ExitPopup />
      <Suspense fallback={<QuickLoader className="p-4" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/doubts" element={<DoubtsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/theme" element={<ThemePage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <SyllabusProvider>
              <TimerProvider>
                <Router>
                  <AppContent />
                  <Toaster />
                </Router>
              </TimerProvider>
            </SyllabusProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
