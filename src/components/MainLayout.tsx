import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Brain, MessageCircle, History, Settings, User, Moon, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  key: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/', key: 'home' },
    { icon: BookOpen, label: 'Questions', path: '/questions', key: 'questions' },
    { icon: Brain, label: 'Quiz', path: '/quiz', key: 'quiz' },
    { icon: MessageCircle, label: 'Community', path: '/community', key: 'community' },
    { icon: History, label: 'History', path: '/history', key: 'history' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t z-50 md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 text-sm ${location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar (Hidden on Mobile) */}
      <aside className="w-64 bg-background border-r hidden md:flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">LearnVerse</h1>
        </div>
        <nav className="flex-1 px-2 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md w-full hover:bg-secondary ${location.pathname === item.path ? 'bg-secondary text-primary' : 'text-muted-foreground'
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="p-4">
                  <h1 className="text-2xl font-bold">LearnVerse</h1>
                </div>
                <nav className="flex-1 px-2 py-4">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md w-full hover:bg-secondary ${location.pathname === item.path ? 'bg-secondary text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.full_name as string} />
                    <AvatarFallback>{(user?.user_metadata?.full_name as string)?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4">{children}</div>
      </main>
    </div>
  );
};

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

export default MainLayout;
