
import React, { Suspense, lazy } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import { usePerformance } from '@/hooks/usePerformance';
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

// Lazy load components for better performance
const LoadingSpinner = lazy(() => import('@/components/LoadingSpinner'));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const location = useLocation();
  const { isStandalone } = useDeviceCapabilities();
  const { debounce } = usePerformance();

  const handleDownloadApp = debounce(async () => {
    try {
      toast({
        title: "Downloading App...",
        description: "Starting download of Axiom Smart Track APK",
      });

      // Updated APK URL from Supabase storage
      const apkUrl = 'https://zlmemsesjpwtpxaznikg.supabase.co/storage/v1/object/sign/axiom-smart-track.apk/smarttrack.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MmQ1NTBmOS04YjIxLTQ4ZGItYWRjNy1iMDY2OWJjNjY4M2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJheGlvbS1zbWFydC10cmFjay5hcGsvc21hcnR0cmFjay5hcGsiLCJpYXQiOjE3NTE3OTAxNTYsImV4cCI6MTc4MzMyNjE1Nn0.M_Y-6arMzf8NGHPd1sC4uoMdAn7z7dcUVtHPPBLxCrY';

      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'axiom-smart-track.apk';
      link.setAttribute('type', 'application/vnd.android.package-archive');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started! 📱",
        description: "APK file is downloading. Install and enjoy the app!",
      });

      setTimeout(() => {
        toast({
          title: "Installation Guide 📋",
          description: "1. Open downloaded APK\n2. Allow unknown sources\n3. Follow installation steps",
        });
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }, 1000);

  const bottomNavigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'text-blue-500' },
    { name: 'Questions', href: '/questions', icon: Brain, color: 'text-purple-500' },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle, color: 'text-orange-500' },
    { name: 'Profile', href: '/profile', icon: User, color: 'text-gray-500' },
  ];

  const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
    { name: 'ToDo Tasks', href: '/todo', icon: CheckSquare, color: 'text-green-600', gradient: 'from-green-500 to-green-600' },
    { name: 'AI Questions', href: '/questions', icon: Brain, color: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Ask Doubts', href: '/doubts', icon: HelpCircle, color: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen, color: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Predictor', href: '/predictor', icon: TrendingUp, color: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'History', href: '/history', icon: History, color: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
    { name: 'Study Timer', href: '/timer', icon: Timer, color: 'text-red-600', gradient: 'from-red-500 to-red-600' },
    { name: 'My Notes', href: '/notes', icon: FileText, color: 'text-cyan-600', gradient: 'from-cyan-500 to-cyan-600' },
    { name: 'Achievements', href: '/badges', icon: Trophy, color: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-600' },
    { name: 'Theme', href: '/theme', icon: Palette, color: 'text-pink-600', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Profile', href: '/profile', icon: User, color: 'text-gray-600', gradient: 'from-gray-500 to-gray-600' },
  ];

  const AppSidebar = React.memo(() => {
    const { setOpenMobile, isMobile } = useSidebar();

    const handleSidebarItemClick = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    return (
      <Sidebar className="w-64 border-r bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl">
        <SidebarHeader className="p-4 border-b bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Axiom Smart Track
              </h2>
              <p className="text-xs text-muted-foreground font-medium">AI Study Assistant</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="scrollbar-hide bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="p-3">
            <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Hello, {profile?.name?.split(' ')[0] || 'Student'}! 👋
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Ready to learn something new?</p>
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
                        className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 group hover:shadow-md ${
                          isActive 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105 border border-white/20` 
                            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:scale-102'
                        }`}
                        onClick={handleSidebarItemClick}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : item.color} transition-colors duration-300`} />
                        <span className="text-sm font-medium">{item.name}</span>
                        {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <Separator />
          
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Star className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">Active</p>
            </div>
            <div className="p-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Student</p>
            </div>
          </div>
          
          <div className="space-y-3 text-center">
            <div className="flex justify-center space-x-3">
              {[
                { icon: Instagram, href: "https://instagram.com/satyamrojhax", color: "text-pink-500" },
                { icon: Github, href: "https://github.com/satyamrojhax", color: "text-gray-600 dark:text-gray-400" },
                { icon: Linkedin, href: "https://linkedin.com/in/satyamrojhax", color: "text-blue-600" }
              ].map(({ icon: Icon, href, color }, index) => (
                <a 
                  key={index}
                  href={href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-accent rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </a>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-orange-600 flex items-center justify-center gap-1">
                🇮🇳 Made in India
              </p>
              <p className="font-medium">Designed & Developed By</p>
              <p className="font-semibold">Satyam Rojha</p>
              <p className="text-xs opacity-75 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
                v3.21.28 ✨
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className={`sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
            <div className="flex justify-between items-center h-16 px-4 md:px-6">
              <div className="flex items-center space-x-3">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg p-2 hover:shadow-md" />
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Axiom Smart Track
                    </h1>
                    <p className="text-xs text-muted-foreground hidden md:block font-medium">AI Study Assistant</p>
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
                  className="p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110 rounded-lg hover:shadow-md"
                  title="Download Mobile App"
                >
                  <Download className="w-5 h-5 text-green-600" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-110 rounded-lg hover:shadow-md"
                >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </header>

          <main className={`flex-1 overflow-auto scrollbar-hide pb-20 lg:pb-6 ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="w-full min-h-full">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </div>
          </main>

          <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-t shadow-lg ${isStandalone ? 'pb-safe-area-inset-bottom' : ''}`}>
            <div className="grid grid-cols-4 py-2 px-1">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all duration-300 touch-manipulation ${
                      isActive 
                        ? `${item.color} bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-800 dark:to-transparent scale-105 shadow-sm` 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                    {isActive && <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>}
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
