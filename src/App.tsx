import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SyllabusProvider } from '@/contexts/SyllabusContext';
import { TimerProvider } from '@/contexts/TimerContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import MainLayout from '@/components/MainLayout';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import QuestionsPage from '@/pages/QuestionsPage';
import MCQQuizPage from '@/pages/MCQQuizPage';
import SyllabusPage from '@/pages/SyllabusPage';
import TimerPage from '@/pages/TimerPage';
import NotesPage from '@/pages/NotesPage';
import PredictorPage from '@/pages/PredictorPage';
import HistoryPage from '@/pages/HistoryPage';
import ExportPage from '@/pages/ExportPage';
import Profile from '@/pages/Profile';
import ThemePage from '@/pages/ThemePage';
import ToDoPage from '@/pages/ToDoPage';
import NotFound from '@/pages/NotFound';
import Onboarding from '@/pages/Onboarding';
import VerifyEmail from '@/pages/VerifyEmail';
import EmailVerification from '@/pages/EmailVerification';
import EmailVerifying from '@/pages/EmailVerifying';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ErrorBoundary>
        <SyllabusProvider>
          <AuthProvider>
            <TimerProvider>
              <ThemeProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/email-verifying" element={<EmailVerifying />} />
                    
                    <Route element={<MainLayout><div /></MainLayout>}>
                      <Route path="/" element={<Index />} />
                      <Route path="/questions" element={<QuestionsPage />} />
                      <Route path="/quiz" element={<MCQQuizPage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/syllabus" element={<SyllabusPage />} />
                      <Route path="/timer" element={<TimerPage />} />
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/predictor" element={<PredictorPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/export" element={<ExportPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/theme" element={<ThemePage />} />
                      <Route path="/todo" element={<ToDoPage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </BrowserRouter>
              </ThemeProvider>
            </TimerProvider>
          </AuthProvider>
        </SyllabusProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
