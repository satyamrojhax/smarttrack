import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
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
import { Sun, Moon, Home, Brain, HelpCircle, User, BookOpen, TrendingUp } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();

  // Bottom navigation items (mobile)
  const bottomNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Questions', href: '/questions', icon: Brain },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Sidebar items (removed History)
  const sidebarItems = [
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp },
  ];

  const AppSidebar = () => {
    const { setOpenMobile, isMobile } = useSidebar();

    const handleSidebarItemClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    return (
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Study Tools</h2>
              <p className="text-xs text-muted-foreground">Track your progress</p>
            </div>
          </div>
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
                        className="flex items-center space-x-3 w-full"
                        onClick={handleSidebarItemClick}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
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
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
            <div className="flex justify-between items-center h-16 px-4">
              <div className="flex items-center space-x-3">
                <SidebarTrigger />
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Axiom Smart Track
                    </h1>
                    <p className="text-xs text-muted-foreground">AI Study Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Welcome, {profile?.name}!
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 pb-20 lg:pb-6">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>

          {/* Bottom Navigation - Mobile Only */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/50 lg:hidden z-40">
            <div className="grid grid-cols-4 py-2">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-2 px-1 transition-colors ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
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
    </SidebarProvider>
  );
};

export default MainLayout;
