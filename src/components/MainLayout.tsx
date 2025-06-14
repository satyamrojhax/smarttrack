
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Home, BookOpen, Brain, TrendingUp, Bookmark, User, MessageCircleQuestion } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  // Sidebar navigation for desktop
  const sidebarNavigation = [
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  ];

  // Bottom navigation for mobile
  const bottomNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Questions', href: '/questions', icon: Brain },
    { name: 'Ask Doubt', href: '/ask-doubt', icon: MessageCircleQuestion },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 hardware-acceleration">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Axiom Smart Track</h1>
                <p className="text-xs text-muted-foreground">AI Study Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.name}!
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 smooth-transition"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with optimized scrolling */}
      <main className="flex-1 pb-20 lg:pb-6 lg:pl-64 scroll-smooth">
        <div className="hardware-acceleration">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/50 lg:hidden z-40 hardware-acceleration">
        <div className="grid grid-cols-4 py-2 px-2">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center space-y-1 py-3 px-2 smooth-transition rounded-lg ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation - Desktop Only */}
      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 z-40">
        <div className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/50 hardware-acceleration">
          <div className="p-6 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            {sidebarNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg smooth-transition ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
