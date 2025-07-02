
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
import ExitPopup from "@/components/ExitPopup";
import SplashScreen from "@/components/SplashScreen";
import MainLayout from "./components/MainLayout";

// Optimized lazy loading with prefetching for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Signup = lazy(() => import("./pages/Signup"));
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

// Optimized QueryClient with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: 1,
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

  console.log('AppContent - Auth state:', { user: !!user, isLoading });

  // Optimized security features
  useEffect(() => {
    const securityHandlers = {
      contextmenu: (e: Event) => e.preventDefault(),
      selectstart: (e: Event) => e.preventDefault(),
      dragstart: (e: Event) => e.preventDefault(),
      keydown: (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key)) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      },
      copy: (e: Event) => e.preventDefault(),
      beforeprint: (e: Event) => e.preventDefault()
    };

    // Add event listeners with optimized options
    Object.entries(securityHandlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler, { passive: false });
    });

    // Disable text selection
    const style = document.body.style as any;
    style.userSelect = 'none';
    style.webkitUserSelect = 'none';
    style.mozUserSelect = 'none';
    style.msUserSelect = 'none';

    return () => {
      Object.entries(securityHandlers).forEach(([event, handler]) => {
        document.removeEventListener(event, handler);
      });
      
      // Reset text selection
      const style = document.body.style as any;
      style.userSelect = '';
      style.webkitUserSelect = '';
      style.mozUserSelect = '';
      style.msUserSelect = '';
    };
  }, []);

  // Optimized route prefetching
  useEffect(() => {
    if (user) {
      const prefetchRoutes = () => {
        import("./pages/DoubtsPage");
        import("./pages/QuestionsPage");
        import("./pages/Profile");
      };
      
      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(prefetchRoutes, { timeout: 2000 });
      } else {
        setTimeout(prefetchRoutes, 1000);
      }
    }
  }, [user]);

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return <AppLoadingSpinner />;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AppLoadingSpinner />}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Auth />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

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
          <ExitPopup />
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
