
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import { QuestionFormData } from './types';

interface QuestionFormProps {
  formData: QuestionFormData;
  onFormDataChange: (data: Partial<QuestionFormData>) => void;
  subjects: any[];
  availableChapters: any[];
  isLoading: boolean;
  savingQuestions: boolean;
  onGenerate: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  onFormDataChange,
  subjects,
  availableChapters,
  isLoading,
  savingQuestions,
  onGenerate
}) => {
  const handleQuestionTypeToggle = (type: string) => {
    const newTypes = formData.questionTypes.includes(type)
      ? formData.questionTypes.filter(t => t !== type)
      : [...formData.questionTypes, type];
    onFormDataChange({ questionTypes: newTypes });
  };

  return (
    <Card className="glass-card smooth-transition w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <span>Create Your Practice Set</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select value={formData.selectedSubject} onValueChange={(value) => onFormDataChange({ selectedSubject: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Chapter</label>
            <Select 
              value={formData.selectedChapter} 
              onValueChange={(value) => onFormDataChange({ selectedChapter: value })}
              disabled={!formData.selectedSubject}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {availableChapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select value={formData.difficulty} onValueChange={(value) => onFormDataChange({ difficulty: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="How challenging should it be?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Easy - Foundation building</SelectItem>
                <SelectItem value="medium">🟡 Medium - Exam preparation</SelectItem>
                <SelectItem value="hard">🔴 Hard - Advanced practice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Questions</label>
            <Select value={formData.questionCount} onValueChange={(value) => onFormDataChange({ questionCount: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="How many questions?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions</SelectItem>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Question Types</label>
          <div className="flex flex-wrap gap-2">
            {['MCQ', 'Short Answer', 'Long Answer', 'Application Based', 'CFQs', 'CBQs'].map((type) => (
              <Badge
                key={type}
                variant={formData.questionTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm smooth-transition hover:scale-105"
                onClick={() => handleQuestionTypeToggle(type)}
                title={type === 'CFQs' ? 'Competency Focused Questions' : type === 'CBQs' ? 'Case Based Questions' : ''}
              >
                {type}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            CFQs = Competency Focused Questions, CBQs = Case Based Questions
          </p>
        </div>

        <Button 
          onClick={onGenerate} 
          disabled={isLoading || savingQuestions}
          className="w-full smooth-transition"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span className="text-sm sm:text-base">Generating practice questions...</span>
            </>
          ) : savingQuestions ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span className="text-sm sm:text-base">Saving to database...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Generate Practice Questions</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
