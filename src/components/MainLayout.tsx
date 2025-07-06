import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  BookOpen, 
  HelpCircle, 
  History, 
  Clock, 
  CheckSquare, 
  FileText, 
  MessageCircle, 
  Award, 
  TrendingUp, 
  Target,
  User,
  Settings,
  LogOut,
  Bell,
  Brain,
  Wand2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedThemeToggle } from '@/components/EnhancedThemeToggle';
import { PWADownload } from '@/components/PWADownload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
}

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen, current: location.pathname === '/syllabus' },
    { name: 'Questions', href: '/questions', icon: HelpCircle, current: location.pathname === '/questions' },
    { name: 'Prompt Questions', href: '/prompt-questions', icon: Wand2, current: location.pathname === '/prompt-questions' },
    { name: 'History', href: '/history', icon: History, current: location.pathname === '/history' },
    { name: 'Timer', href: '/timer', icon: Clock, current: location.pathname === '/timer' },
    { name: 'To-Do', href: '/todo', icon: CheckSquare, current: location.pathname === '/todo' },
    { name: 'Notes', href: '/notes', icon: FileText, current: location.pathname === '/notes' },
    { name: 'AI Tutor', href: '/doubts', icon: MessageCircle, current: location.pathname === '/doubts' },
    { name: 'Badges', href: '/badges', icon: Award, current: location.pathname === '/badges' },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp, current: location.pathname === '/predictor' },
    { name: 'MCQ Quiz', href: '/mcq-quiz', icon: Target, current: location.pathname === '/mcq-quiz' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="bg-background border-b px-4 py-3 flex items-center justify-between lg:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-6 w-64">
            <div className="py-4 px-3">
              <Link to="/" className="flex items-center space-x-2 font-semibold">
                <Brain className="w-6 h-6 text-primary" />
                <span>Axiom Smart Track</span>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 space-x-2 hover:bg-secondary ${item.current ? 'text-primary font-semibold' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 p-3 space-y-3">
              <EnhancedThemeToggle />
              <PWADownload />
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center space-x-2 font-semibold">
          <Brain className="w-6 h-6 text-primary" />
          <span>Axiom Smart Track</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Link to="/profile">
              <User className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        ) : (
          <Link to="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-background border-r py-8">
        <div className="px-6">
          <Link to="/" className="flex items-center space-x-2 font-bold">
            <Brain className="w-7 h-7 text-primary" />
            <span>Axiom Smart Track</span>
          </Link>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigationItems.map((item: NavItem) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary ${item.current ? 'bg-secondary text-primary' : 'text-muted-foreground'
                }`}
            >
              <item.icon className={`shrink-0 h-4 w-4 ${item.current ? 'text-primary' : 'text-muted-foreground'
                }`} />
              <span className="truncate ml-2">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 space-y-3">
          <EnhancedThemeToggle />
          <PWADownload />
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};
