
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
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
  const { isMobile, isStandalone } = useDeviceCapabilities();

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
      <Sidebar className="w-64 hardware-acceleration">
        <SidebarHeader className="p-3 sm:p-4 border-b">
          <Logo size="md" />
        </SidebarHeader>
        <SidebarContent className="scroll-container">
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
                        className="flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3 smooth-transition"
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
      <div className="min-h-screen flex w-full hardware-acceleration">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          {/* Enhanced sticky header with better performance */}
          <header className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 hardware-acceleration ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
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
                  className="p-1.5 sm:p-2 smooth-transition"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Optimized main content with smooth scrolling */}
          <main className={`flex-1 pb-16 sm:pb-20 lg:pb-6 w-full overflow-x-hidden scroll-container ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="w-full hardware-acceleration">
              {children}
            </div>
          </main>

          {/* Enhanced sticky bottom navigation */}
          <nav className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-white/20 dark:border-gray-700/50 lg:hidden z-50 hardware-acceleration ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="grid grid-cols-4 py-1 sm:py-2 px-2">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-2 px-1 smooth-transition touch-manipulation ${
                      isActive 
                        ? 'text-primary scale-105' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
