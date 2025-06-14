
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Play } from 'lucide-react';
import { GeneratedQuestion } from './types';
import { QuestionCard } from './QuestionCard';

interface QuestionListProps {
  questions: GeneratedQuestion[];
  visibleSolutions: Set<string>;
  generatingSolution: string | null;
  onStartQuiz: () => void;
  onExportQuestions: () => void;
  onCopyQuestion: (question: string) => void;
  onToggleSolution: (questionId: string) => void;
  onGenerateSolution: (question: GeneratedQuestion) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  visibleSolutions,
  generatingSolution,
  onStartQuiz,
  onExportQuestions,
  onCopyQuestion,
  onToggleSolution,
  onGenerateSolution
}) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card smooth-transition w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg md:text-xl">🎯 Your Practice Questions</span>
            <Badge variant="secondary" className="text-sm">{questions.length} questions</Badge>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            {questions.some(q => q.options) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onStartQuiz} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90 text-xs sm:text-sm"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Start Quiz Mode
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onExportQuestions} className="text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isVisible={visibleSolutions.has(question.id)}
            isGeneratingSolution={generatingSolution === question.id}
            onCopyQuestion={onCopyQuestion}
            onToggleSolution={onToggleSolution}
            onGenerateSolution={onGenerateSolution}
          />
        ))}
      </CardContent>
    </Card>
  );
};
