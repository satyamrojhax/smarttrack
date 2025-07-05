
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Home, 
  Brain, 
  BookOpen, 
  Clock, 
  Trophy, 
  User, 
  CheckSquare, 
  FileText, 
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  Award,
  TrendingUp,
  Download,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedThemeToggle from '@/components/EnhancedThemeToggle';
import PWADownload from '@/components/PWADownload';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/questions', icon: Brain, label: 'AI Questions' },
    { path: '/mcq-quiz', icon: Trophy, label: 'MCQ Quiz' },
    { path: '/notes', icon: BookOpen, label: 'Smart Notes' },
    { path: '/syllabus', icon: FileText, label: 'Syllabus Tracker' },
    { path: '/timer', icon: Clock, label: 'Study Timer' },
    { path: '/doubts', icon: HelpCircle, label: 'AI Doubts' },
    { path: '/todo', icon: CheckSquare, label: 'To-Do List' },
    { path: '/predictor', icon: TrendingUp, label: 'Marks Predictor' },
    { path: '/badges', icon: Award, label: 'Achievements' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/export', icon: Download, label: 'Export Progress' },
  ];

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">BoardsTrack</h1>
                  <p className="text-xs text-muted-foreground">v3.18.22</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={closeSidebar}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <div className="flex items-center justify-between">
              <EnhancedThemeToggle />
              <PWADownload />
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Link 
                to="/profile"
                onClick={closeSidebar}
                className="flex items-center space-x-2 flex-1 p-2 rounded hover:bg-accent"
              >
                <User className="w-4 h-4" />
                <span className="truncate">{profile?.name || 'Profile'}</span>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">BoardsTrack</span>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
