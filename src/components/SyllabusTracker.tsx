
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';

export const SyllabusTracker = () => {
  const { subjects, toggleChapterCompletion, getSubjectProgress, resetProgress } = useSyllabus();
  const { isMobile, isTablet } = useDeviceCapabilities();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 px-2 sm:px-0">
        <h2 className={`font-bold ${
          isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-2xl'
        }`}>Progress Overview</h2>
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={resetProgress}
          className="flex items-center space-x-2 w-full sm:w-auto touch-manipulation"
        >
          <RotateCcw className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          <span className={isMobile ? 'text-sm' : 'text-base'}>Reset Progress</span>
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4 w-full">
        {subjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          const isExpanded = expandedSubjects.includes(subject.id);
          const completedChapters = subject.chapters.filter(ch => ch.completed).length;

          return (
            <Card key={subject.id} className="glass-card w-full">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader 
                    className="cursor-pointer hover:bg-secondary/50 transition-colors p-3 sm:p-4 lg:p-6 touch-manipulation"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className={`text-muted-foreground flex-shrink-0 ${
                            isMobile ? 'w-4 h-4' : 'w-5 h-5'
                          }`} />
                        ) : (
                          <ChevronRight className={`text-muted-foreground flex-shrink-0 ${
                            isMobile ? 'w-4 h-4' : 'w-5 h-5'
                          }`} />
                        )}
                        <span className={`flex-shrink-0 ${
                          isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
                        }`}>{subject.icon}</span>
                        <div className="flex-1 min-w-0">
                          <CardTitle className={`truncate ${
                            isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg'
                          }`}>{subject.name}</CardTitle>
                          <p className={`text-muted-foreground truncate ${
                            isMobile ? 'text-xs' : 'text-sm'
                          }`}>
                            {completedChapters} of {subject.chapters.length} chapters completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <Badge 
                          variant={progress >= 75 ? "default" : progress >= 50 ? "secondary" : "outline"}
                          className={`px-2 sm:px-3 py-1 ${
                            isMobile ? 'text-xs' : 'text-sm'
                          }`}
                        >
                          {progress}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={progress} className={`mt-2 sm:mt-3 ${
                      isMobile ? 'h-1.5' : 'h-2'
                    }`} />
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 p-3 sm:p-4 lg:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-secondary/30 transition-colors touch-manipulation"
                        >
                          <Checkbox
                            id={chapter.id}
                            checked={chapter.completed}
                            onCheckedChange={() => toggleChapterCompletion(subject.id, chapter.id)}
                            className="flex-shrink-0"
                          />
                          <label
                            htmlFor={chapter.id}
                            className={`flex-1 cursor-pointer font-medium min-w-0 ${
                              isMobile ? 'text-sm' : 'text-sm'
                            } ${
                              chapter.completed
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            <span className="block truncate">{chapter.name}</span>
                          </label>
                          {chapter.completed && (
                            <Badge variant="secondary" className={`flex-shrink-0 ${
                              isMobile ? 'text-xs px-2 py-0.5' : 'text-xs'
                            }`}>
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
