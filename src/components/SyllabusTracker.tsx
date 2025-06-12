
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';

export const SyllabusTracker = () => {
  const { subjects, toggleChapterCompletion, getSubjectProgress, resetProgress } = useSyllabus();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Syllabus Tracker</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetProgress}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Progress</span>
        </Button>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          const isExpanded = expandedSubjects.includes(subject.id);
          const completedChapters = subject.chapters.filter(ch => ch.completed).length;

          return (
            <Card key={subject.id} className="glass-card">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader 
                    className="cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="text-3xl">{subject.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {completedChapters} of {subject.chapters.length} chapters completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={progress >= 75 ? "default" : progress >= 50 ? "secondary" : "outline"}
                          className="px-3 py-1"
                        >
                          {progress}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2 mt-2" />
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                        >
                          <Checkbox
                            id={chapter.id}
                            checked={chapter.completed}
                            onCheckedChange={() => toggleChapterCompletion(subject.id, chapter.id)}
                          />
                          <label
                            htmlFor={chapter.id}
                            className={`flex-1 cursor-pointer text-sm font-medium ${
                              chapter.completed
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            {chapter.name}
                          </label>
                          {chapter.completed && (
                            <Badge variant="secondary" className="text-xs">
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
