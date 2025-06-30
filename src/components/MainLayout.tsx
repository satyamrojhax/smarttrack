
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
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

  // Sidebar items with Dashboard included
  const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: Home },
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
      <Sidebar className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarHeader className="p-3 sm:p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-xs sm:text-sm text-foreground">Axiom Smart Track</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Study Assistant</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar-hide">
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
                        className={`flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                            : 'hover:bg-accent hover:text-accent-foreground hover:scale-102'
                        }`}
                        onClick={handleSidebarItemClick}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm sm:text-base font-medium">{item.name}</span>
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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          {/* Enhanced Header */}
          <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
            <div className="flex justify-between items-center h-14 sm:h-16 px-3 sm:px-4 md:px-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Axiom Smart Track
                    </h1>
                    <p className="text-xs text-muted-foreground hidden md:block">AI Study Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block font-medium">
                  Welcome, {profile?.name}! 👋
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-1.5 sm:p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content with optimized scrolling */}
          <main className={`flex-1 overflow-auto scrollbar-hide pb-20 lg:pb-6 ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="w-full min-h-full">
              {children}
            </div>
          </main>

          {/* Enhanced Bottom Navigation - Mobile Only */}
          <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="grid grid-cols-4 py-2 px-1">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-2 px-1 rounded-lg transition-all duration-200 touch-manipulation ${
                      isActive 
                        ? 'text-primary bg-primary/10 scale-105 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                    {isActive && <div className="w-1 h-1 bg-primary rounded-full"></div>}
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
