
import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SyllabusProvider } from "@/contexts/SyllabusContext";
import { TimerProvider } from "@/contexts/TimerContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "./components/MainLayout";
import SplashScreen from "./components/SplashScreen";

// Optimized lazy loading with preloading
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const EmailVerifying = lazy(() => import("./pages/EmailVerifying"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const PredictorPage = lazy(() => import("./pages/PredictorPage"));
const DoubtsPage = lazy(() => import("./pages/DoubtsPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const TimerPage = lazy(() => import("./pages/TimerPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const BadgesPage = lazy(() => import("./pages/BadgesPage"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const ThemePage = lazy(() => import("./pages/ThemePage"));
const ToDoPage = lazy(() => import("./pages/ToDoPage"));

// Enhanced QueryClient with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

const AppLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
    <LoadingSpinner message="Loading your smart study space..." size="lg" />
  </div>
);

const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner message="Loading page..." />
  </div>
);

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen on app start
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Performance optimization: prefetch critical routes
  useEffect(() => {
    if (user) {
      const prefetchRoutes = () => {
        import("./pages/DoubtsPage");
        import("./pages/QuestionsPage");
        import("./pages/SyllabusPage");
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(prefetchRoutes);
      } else {
        setTimeout(prefetchRoutes, 100);
      }
    }
  }, [user]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return <AppLoadingSpinner />;
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AppLoadingSpinner />}>
          <Routes>
            <Route path="/email-verifying" element={<EmailVerifying />} />
            <Route path="*" element={<Auth />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Show dashboard (main app) for authenticated users
  return (
    <ErrorBoundary>
      <SyllabusProvider>
        <TimerProvider>
          <MainLayout>
            <Suspense fallback={<PageLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/todo" element={<ToDoPage />} />
                <Route path="/syllabus" element={<SyllabusPage />} />
                <Route path="/questions" element={<QuestionsPage />} />
                <Route path="/doubts" element={<DoubtsPage />} />
                <Route path="/predictor" element={<PredictorPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/timer" element={<TimerPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/badges" element={<BadgesPage />} />
                <Route path="/export" element={<ExportPage />} />
                <Route path="/theme" element={<ThemePage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </TimerProvider>
      </SyllabusProvider>
    </ErrorBoundary>
  );
};

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;
