
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileQuestion, 
  BookOpen, 
  Timer, 
  StickyNote, 
  TrendingUp, 
  History, 
  Download, 
  User, 
  Palette,
  CheckSquare,
  Users,
  Target
} from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user && mounted) {
      navigate('/landing');
    }
  }, [user, navigate, mounted]);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/', color: 'text-blue-600' },
    { icon: FileQuestion, label: 'Questions', path: '/questions', color: 'text-purple-600' },
    { icon: Target, label: 'Quiz', path: '/quiz', color: 'text-green-600' },
    { icon: Users, label: 'Community', path: '/community', color: 'text-orange-600' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus', color: 'text-emerald-600' },
  ];

  const secondaryItems = [
    { icon: Timer, label: 'Timer', path: '/timer' },
    { icon: StickyNote, label: 'Notes', path: '/notes' },
    { icon: TrendingUp, label: 'Predictor', path: '/predictor' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Download, label: 'Export', path: '/export' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Palette, label: 'Theme', path: '/theme' },
    { icon: CheckSquare, label: 'To-Do', path: '/todo' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
          <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ST</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Smart Track</span>
              </div>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11 px-4",
                      isActive(item.path) && "bg-primary/10 text-primary border-r-2 border-primary"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={cn("mr-3 h-5 w-5", isActive(item.path) ? "text-primary" : item.color)} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    More
                  </p>
                  <div className="mt-2 space-y-1">
                    {secondaryItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={isActive(item.path) ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 px-4 text-sm",
                          isActive(item.path) && "bg-primary/10 text-primary"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
          <main className="flex-1 pb-16 md:pb-0">
            {children}
            <Outlet />
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
          <div className="flex justify-around items-center py-2 px-4">
            {navigationItems.slice(0, 5).map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-col h-14 w-14 p-1",
                  isActive(item.path) && "text-primary"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn("h-5 w-5 mb-1", isActive(item.path) ? "text-primary" : item.color)} />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
