
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudyTimer from '@/components/StudyTimer';
import NotesFlashcards from '@/components/NotesFlashcards';
import AchievementBadges from '@/components/AchievementBadges';
import ExportProgress from '@/components/ExportProgress';
import EnhancedThemeToggle from '@/components/EnhancedThemeToggle';
import { Timer, BookOpen, Trophy, Download, Palette } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const handleSessionComplete = (duration: number) => {
    console.log(`Study session completed: ${duration} seconds`);
    // Here you would typically save the session data to your backend
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Study Tools</h1>
        <p className="text-muted-foreground">
          Enhance your learning experience with our comprehensive study tools
        </p>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timer" className="gap-2">
            <Timer className="w-4 h-4" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="mt-6">
          <div className="flex justify-center">
            <StudyTimer onSessionComplete={handleSessionComplete} />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NotesFlashcards />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <AchievementBadges />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ExportProgress />
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <div className="flex justify-center">
            <EnhancedThemeToggle />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryPage;
