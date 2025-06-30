
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import ExitPopup from '@/components/ExitPopup';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from '@/components/ui/sidebar';
import { Sun, Moon, Home, Brain, HelpCircle, User, BookOpen, TrendingUp, History, Timer, FileText, Trophy, Download, Palette } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isStandalone } = useDeviceCapabilities();
  const [showExitPopup, setShowExitPopup] = useState(false);

  // Handle browser back button and exit
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (window.history.length <= 2) {
        event.preventDefault();
        setShowExitPopup(true);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleExitConfirm = () => {
    window.history.back();
    setShowExitPopup(false);
  };

  const handleExitCancel = () => {
    setShowExitPopup(false);
  };

  // Bottom navigation items (mobile)
  const bottomNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Questions', href: '/questions', icon: Brain },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Sidebar items
  const sidebarItems = [
    { name: 'Questions', href: '/questions', icon: Brain },
    { name: 'Doubts', href: '/doubts', icon: HelpCircle },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp },
    { name: 'History', href: '/history', icon: History },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Badges', href: '/badges', icon: Trophy },
    { name: 'Export', href: '/export', icon: Download },
    { name: 'Theme', href: '/theme', icon: Palette },
  ];

  const AppSidebar = () => {
    const { setOpenMobile, isMobile } = useSidebar();

    const handleSidebarItemClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    return (
      <Sidebar className="w-64">
        <SidebarHeader className="p-3 sm:p-4 border-b">
          <Logo size="md" />
        </SidebarHeader>
        <SidebarContent>
          <div className="p-2">
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link 
                        to={item.href} 
                        className="flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3"
                        onClick={handleSidebarItemClick}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          {/* Sticky Header */}
          <header className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-40 ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
            <div className="flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 md:px-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <SidebarTrigger />
                <Logo size="md" />
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block">
                  Welcome, {profile?.name}!
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content with optimized scrolling */}
          <main className={`flex-1 pb-20 sm:pb-24 lg:pb-6 w-full overflow-x-hidden scroll-smooth ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="w-full">
              {children}
            </div>
          </main>

          {/* Sticky Bottom Navigation - Mobile Only */}
          <nav className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-white/20 dark:border-gray-700/50 lg:hidden z-40 ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="grid grid-cols-4 py-2 px-2">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-2 px-1 transition-all duration-200 touch-manipulation ${
                      isActive 
                        ? 'text-primary transform scale-105' 
                        : 'text-muted-foreground hover:text-foreground active:scale-95'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </SidebarInset>
      </div>

      <ExitPopup
        isOpen={showExitPopup}
        onClose={handleExitCancel}
        onConfirm={handleExitConfirm}
      />
    </SidebarProvider>
  );
};

export default MainLayout;
