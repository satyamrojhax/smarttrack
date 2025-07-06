
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SyllabusProvider } from '@/contexts/SyllabusContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TimerProvider } from '@/contexts/TimerContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import VerifyEmail from '@/pages/VerifyEmail';
import EmailVerification from '@/pages/EmailVerification';
import EmailVerifying from '@/pages/EmailVerifying';
import Profile from '@/pages/Profile';
import SyllabusPage from '@/pages/SyllabusPage';
import QuestionsPage from '@/pages/QuestionsPage';
import PromptQuestionPage from '@/pages/PromptQuestionPage';
import HistoryPage from '@/pages/HistoryPage';
import TimerPage from '@/pages/TimerPage';
import ToDoPage from '@/pages/ToDoPage';
import NotesPage from '@/pages/NotesPage';
import DoubtsPage from '@/pages/DoubtsPage';
import BadgesPage from '@/pages/BadgesPage';
import PredictorPage from '@/pages/PredictorPage';
import MCQQuizPage from '@/pages/MCQQuizPage';
import ThemePage from '@/pages/ThemePage';
import ExportPage from '@/pages/ExportPage';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    // Check if the app is running in a browser environment
    if (typeof document !== 'undefined') {
      // Get all elements with the "lovable" class or data attribute and hide them
      const lovableElements = document.querySelectorAll('[class*="lovable"], [data-lovable]');
      lovableElements.forEach(element => {
        (element as HTMLElement).style.display = 'none';
      });

      // Get all iframes with "lovable" in the src and hide them
      const lovableIframes = document.querySelectorAll('iframe[src*="lovable"]');
      lovableIframes.forEach(iframe => {
        (iframe as HTMLIFrameElement).style.display = 'none';
      });

      // Get all divs that contain an anchor tag with "lovable" in the href and hide them
      const lovableDivsWithAnchor = document.querySelectorAll('div:has(> a[href*="lovable"])');
      lovableDivsWithAnchor.forEach(div => {
        (div as HTMLDivElement).style.display = 'none';
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <TimerProvider>
              <AuthProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/onboarding" element={<Onboarding onComplete={() => {}} />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/email-verifying" element={<EmailVerifying />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/syllabus" element={<SyllabusPage />} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/prompt-questions" element={<PromptQuestionPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/timer" element={<TimerPage />} />
                    <Route path="/todo" element={<ToDoPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/doubts" element={<DoubtsPage />} />
                    <Route path="/badges" element={<BadgesPage />} />
                    <Route path="/predictor" element={<PredictorPage />} />
                    <Route path="/mcq-quiz" element={<MCQQuizPage />} />
                    <Route path="/theme" element={<ThemePage />} />
                    <Route path="/export" element={<ExportPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </TimerProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
