
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { GeneratedQuestion } from './types';

interface QuestionCardProps {
  question: GeneratedQuestion;
  index: number;
  isVisible: boolean;
  isGeneratingSolution: boolean;
  onCopyQuestion: (question: string) => void;
  onToggleSolution: (questionId: string) => void;
  onGenerateSolution: (question: GeneratedQuestion) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isVisible,
  isGeneratingSolution,
  onCopyQuestion,
  onToggleSolution,
  onGenerateSolution
}) => {
  return (
    <div className="border rounded-lg p-3 sm:p-4 md:p-6 space-y-4 smooth-transition bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
        <h4 className="font-semibold text-base sm:text-lg md:text-xl text-primary">Question {index + 1}</h4>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopyQuestion(question.question)}
            title="Copy question"
          >
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.share?.({ text: question.question })}
            title="Share question"
          >
            <Share className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      
      <div className="prose prose-sm sm:prose-base max-w-none">
        <div className="text-sm sm:text-base md:text-lg leading-relaxed bg-white/80 dark:bg-gray-800/80 p-3 sm:p-4 rounded-lg border">
          {question.question}
        </div>
        
        {question.options && (
          <div className="mt-4 space-y-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center space-x-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                <span className="font-bold text-primary text-sm sm:text-base">{String.fromCharCode(97 + optIndex)})</span>
                <span className="text-sm sm:text-base">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">{question.type}</Badge>
          <Badge variant="outline" className="capitalize text-xs">{question.difficulty}</Badge>
          {question.options && <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">MCQ</Badge>}
        </div>
        
        <div className="flex space-x-2">
          {question.answer ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleSolution(question.id)}
              className="smooth-transition text-xs sm:text-sm"
            >
              {isVisible ? (
                <>
                  <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Hide Solution
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Show Solution
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateSolution(question)}
              disabled={isGeneratingSolution}
              className="smooth-transition text-xs sm:text-sm"
            >
              {isGeneratingSolution ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Get Solution
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Solution Display */}
      {question.answer && isVisible && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-fade-in">
          <h5 className="font-semibold mb-4 text-primary flex items-center text-sm sm:text-base md:text-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Quick Solution
          </h5>
          <div className="prose prose-sm sm:prose-base max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {question.answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
