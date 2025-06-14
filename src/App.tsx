
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SyllabusProvider } from '@/contexts/SyllabusContext';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import Index from '@/pages/Index';
import SyllabusPage from '@/pages/SyllabusPage';
import DoubtsPage from '@/pages/DoubtsPage';
import HistoryPage from '@/pages/HistoryPage';
import PredictorPage from '@/pages/PredictorPage';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SyllabusProvider>
            <TooltipProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/syllabus" element={<SyllabusPage />} />
                    <Route path="/doubts" element={<DoubtsPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/predictor" element={<PredictorPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </TooltipProvider>
          </SyllabusProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
