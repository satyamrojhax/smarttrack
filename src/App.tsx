
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

// Optimized lazy loading
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
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

// Enhanced QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
  const [showSplash, setShowSplash] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Check if this is the first time opening the app
  useEffect(() => {
    const hasVisited = localStorage.getItem('axiom-visited');
    if (!hasVisited) {
      setIsFirstTime(true);
      localStorage.setItem('axiom-visited', 'true');
    }
  }, []);

  // Show splash screen for first-time users or when entering dashboard
  useEffect(() => {
    if (user && isFirstTime) {
      setShowSplash(true);
      setIsFirstTime(false);
    }
  }, [user, isFirstTime]);

  // Enhanced security features
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const handlePrint = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const events = [
      ['contextmenu', handleContextMenu, { passive: false }],
      ['selectstart', handleSelectStart, { passive: false }],
      ['dragstart', handleDragStart, { passive: false }],
      ['keydown', handleKeyDown, { passive: false }],
      ['copy', handleCopy, { passive: false }],
      ['beforeprint', handlePrint, { passive: false }]
    ] as const;

    events.forEach(([event, handler, options]) => {
      document.addEventListener(event, handler as EventListener, options);
    });

    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    bodyStyle.mozUserSelect = 'none';
    bodyStyle.msUserSelect = 'none';

    return () => {
      events.forEach(([event, handler]) => {
        document.removeEventListener(event, handler as EventListener);
      });
      
      const bodyStyle = document.body.style as any;
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      bodyStyle.mozUserSelect = '';
      bodyStyle.msUserSelect = '';
    };
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

  if (isLoading) {
    return <AppLoadingSpinner />;
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AppLoadingSpinner />}>
          <Auth />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
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
