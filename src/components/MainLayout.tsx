import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Brain,
  Settings,
  BookOpen,
  ListChecks,
  LayoutDashboard,
  TrendingUp,
  AlarmClock,
  Note,
  Award,
  Import,
  Brush,
  LogOut,
  HelpCircle,
  Github,
  Instagram,
  Linkedin,
  QuestionMark,
  LucideIcon
} from "lucide-react"

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`group flex items-center space-x-3 py-2 px-4 rounded-md transition-colors duration-200 hover:bg-secondary ${isActive ? 'bg-secondary font-semibold' : ''}`}>
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
      <span className="text-sm font-medium text-foreground group-hover:text-foreground">{label}</span>
    </Link>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false)

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background antialiased">
      {/* Mobile Navigation Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden h-10 w-10 p-0">
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Open main menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-64">
          <SheetHeader className="space-y-2.5">
            <SheetTitle>Axiom Smart Track</SheetTitle>
            <SheetDescription>
              Your AI-powered study companion
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="my-4">
            <div className="py-4">
              <div className="px-3 py-2">
                <div className="mb-2 px-6">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "https://avatars.dicebear.com/api/open-peeps/:seed.svg"} alt="Avatar" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 text-sm font-semibold">{user?.user_metadata?.name || user?.email}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
                <Separator className="my-2" />

                <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
                <NavItem icon={ListChecks} label="To-Do" to="/todo" />
                <NavItem icon={BookOpen} label="Syllabus" to="/syllabus" />
                <NavItem icon={Brain} label="Questions" to="/questions" />
                <NavItem icon={TrendingUp} label="Predictor" to="/predictor" />
                <NavItem icon={AlarmClock} label="Timer" to="/timer" />
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="additional">
                  <AccordionTrigger className="px-3 py-2 hover:bg-secondary">
                    <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Additional Tools</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-3 py-2">
                      <NavItem icon={Note} label="Notes" to="/notes" />
                      <NavItem icon={Award} label="Badges" to="/badges" />
                      <NavItem icon={Import} label="Export" to="/export" />
                      <NavItem icon={Brush} label="Theme" to="/theme" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator className="my-2" />
              <div className="mt-auto px-3 py-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <aside className="hidden md:block w-64 border-r bg-secondary py-4">
        <ScrollArea className="h-screen">
          <div className="py-4">
            {/* Profile Section */}
            <div className="mb-8 px-6">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.user_metadata?.avatar_url || "https://avatars.dicebear.com/api/open-peeps/:seed.svg"} alt="Avatar" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-sm font-semibold">{user?.user_metadata?.name || user?.email}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
              <NavItem icon={ListChecks} label="To-Do" to="/todo" />
              <NavItem icon={BookOpen} label="Syllabus" to="/syllabus" />
              <NavItem icon={Brain} label="Questions" to="/questions" />
              <NavItem icon={TrendingUp} label="Predictor" to="/predictor" />
              <NavItem icon={AlarmClock} label="Timer" to="/timer" />
            </div>

            {/* Additional Tools Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="additional">
                <AccordionTrigger className="px-4 py-2 hover:bg-secondary">
                  <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Additional Tools</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 px-4 py-2">
                    <NavItem icon={Note} label="Notes" to="/notes" />
                    <NavItem icon={Award} label="Badges" to="/badges" />
                    <NavItem icon={Import} label="Export" to="/export" />
                    <NavItem icon={Brush} label="Theme" to="/theme" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Sign Out Button */}
            <div className="mt-auto px-6">
              <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* Footer */}
      <div className="mt-auto pt-6 pb-4 space-y-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:shadow-lg transition-all duration-300"
            >
              <Instagram className="w-3 h-3" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 text-white hover:shadow-lg transition-all duration-300"
            >
              <Github className="w-3 h-3" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-600 text-white hover:shadow-lg transition-all duration-300"
            >
              <Linkedin className="w-3 h-3" />
            </a>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-orange-600 font-bold text-xs">🇮🇳</span>
              <span className="text-orange-600 font-semibold text-xs">Made in India</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Designed & Developed By
            </div>
            <a
              href="https://satyamrojha.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              Satyam Rojha
            </a>
            <div className="text-xs text-muted-foreground">
              v3.21.28
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
