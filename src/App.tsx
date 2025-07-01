
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
import MainLayout from "./components/MainLayout";

// Lazy load pages for better performance
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AppLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <LoadingSpinner message="Initializing your study space..." size="lg" />
  </div>
);

const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner message="Loading page..." />
  </div>
);

const AppContent = () => {
  const { user, isLoading } = useAuth();

  console.log('AppContent - Auth state:', { user: !!user, isLoading });

  // Disable right-click context menu, text selection, and dev tools
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
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.shiftKey && e.key === 'K')
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

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('beforeprint', handlePrint);

    // Disable text selection via CSS - properly typed
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    bodyStyle.mozUserSelect = 'none';
    bodyStyle.msUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('beforeprint', handlePrint);
      
      // Reset text selection - properly typed
      const bodyStyle = document.body.style as any;
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      bodyStyle.mozUserSelect = '';
      bodyStyle.msUserSelect = '';
    };
  }, []);

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
