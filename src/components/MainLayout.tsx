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
  useSidebar,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Home, Brain, HelpCircle, User, BookOpen, TrendingUp, History, Timer, FileText, Trophy, Palette, CheckSquare, Instagram, Github, Linkedin, Users, Settings, Star, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();
  const { isStandalone } = useDeviceCapabilities();

  const handleDownloadApp = async () => {
    try {
      toast({
        title: "Downloading App...",
        description: "Starting download of Axiom Smart Track APK",
      });

      // Direct APK URL from Supabase storage
      const apkUrl = 'https://zlmemsesjpwtpxaznikg.supabase.co/storage/v1/object/sign/axiom-smart-track.apk/apkfiles.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MmQ1NTBmOS04YjIxLTQ4ZGItYWRjNy1iMDY2OWJjNjY4M2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJheGlvbS1zbWFydC10cmFjay5hcGsvYXBrZmlsZXMuYXBrIiwiaWF0IjoxNzUxNzg5NzQxLCJleHAiOjE3ODMzMjU3NDF9.UYi3skqI2hkG17-88nNWRKFtoWT2uiRZX7UMKvSeHZo';

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'axiom-smart-track.apk';
      link.setAttribute('type', 'application/vnd.android.package-archive');
      
      // Add to DOM temporarily
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);

      toast({
        title: "Download Started!",
        description: "APK file is downloading. Check your downloads folder and install the app.",
      });

      // Show installation instructions
      setTimeout(() => {
        toast({
          title: "Installation Instructions",
          description: "1. Open the downloaded APK file\n2. Allow installation from unknown sources if prompted\n3. Follow the installation wizard",
        });
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred during download. Please try again.",
        variant: "destructive",
      });
    }
  };

  const bottomNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Questions', href: '/questions', icon: Brain },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'text-blue-600' },
    { name: 'ToDo Tasks', href: '/todo', icon: CheckSquare, color: 'text-green-600' },
    { name: 'AI Questions', href: '/questions', icon: Brain, color: 'text-purple-600' },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle, color: 'text-orange-600' },
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen, color: 'text-indigo-600' },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp, color: 'text-emerald-600' },
    { name: 'History', href: '/history', icon: History, color: 'text-amber-600' },
    { name: 'Study Timer', href: '/timer', icon: Timer, color: 'text-red-600' },
    { name: 'My Notes', href: '/notes', icon: FileText, color: 'text-cyan-600' },
    { name: 'Achievements', href: '/badges', icon: Trophy, color: 'text-yellow-600' },
    { name: 'Theme', href: '/theme', icon: Palette, color: 'text-pink-600' },
    { name: 'Profile', href: '/profile', icon: User, color: 'text-gray-600' },
  ];

  // Memoized Sidebar Component for better performance
  const AppSidebar = React.memo(() => {
    const { setOpenMobile, isMobile } = useSidebar();

    const handleSidebarItemClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    return (
      <Sidebar className="w-64 border-r bg-white dark:bg-gray-900 shadow-xl">
        <SidebarHeader className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Axiom Smart Track
              </h2>
              <p className="text-xs text-muted-foreground">AI Study Assistant</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="scrollbar-hide bg-white dark:bg-gray-900">
          <div className="p-3">
            {/* User Welcome Section */}
            <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Hello, {profile?.name?.split(' ')[0] || 'Student'}! 👋
                  </p>
                  <p className="text-xs text-muted-foreground">Ready to study?</p>
                </div>
              </div>
            </div>

            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link 
                        to={item.href} 
                        className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-105 border border-primary/20' 
                            : 'hover:bg-accent hover:text-accent-foreground hover:scale-102 hover:shadow-md'
                        }`}
                        onClick={handleSidebarItemClick}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : item.color} transition-colors duration-200`} />
                        <span className="text-sm font-medium">{item.name}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t space-y-4 bg-white dark:bg-gray-900">
          <Separator />
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <Star className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">Active</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
              <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Student</p>
            </div>
          </div>
          
          <div className="space-y-3 text-center">
            <div className="flex justify-center space-x-3">
              <a 
                href="https://instagram.com/satyamrojhax" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors hover:scale-110"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
              </a>
              <a 
                href="https://github.com/satyamrojhax" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors hover:scale-110"
              >
                <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              <a 
                href="https://linkedin.com/in/satyamrojhax" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors hover:scale-110"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
              </a>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-orange-600 flex items-center justify-center gap-1">
                🇮🇳 Made in India
              </p>
              <p>Designed & Developed By</p>
              <p className="font-medium">Satyam Rojha</p>
              <p className="text-xs opacity-75 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                v3.21.28
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
            <div className="flex justify-between items-center h-16 px-4 md:px-6">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg p-2" />
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Axiom Smart Track
                    </h1>
                    <p className="text-xs text-muted-foreground hidden md:block">AI Study Assistant</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden lg:block font-medium">
                  Welcome, {profile?.name}! 👋
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadApp}
                  className="p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110 rounded-lg"
                  title="Download Mobile App"
                >
                  <Download className="w-5 h-5 text-green-600" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110 rounded-lg"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </header>

          <main className={`flex-1 overflow-auto scrollbar-hide pb-20 lg:pb-6 ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="w-full min-h-full">
              {children}
            </div>
          </main>

          <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="grid grid-cols-4 py-2 px-1">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all duration-200 touch-manipulation ${
                      isActive 
                        ? 'text-primary bg-primary/10 scale-105 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                    {isActive && <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>}
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
