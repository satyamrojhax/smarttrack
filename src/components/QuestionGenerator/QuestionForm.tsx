import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import { QuestionFormData } from './types';

interface Subject {
  id: string;
  name: string;
  chapters: Array<{ id: string; name: string }>;
}

interface QuestionFormProps {
  formData: QuestionFormData;
  onFormDataChange: (data: Partial<QuestionFormData>) => void;
  subjects: Subject[];
  availableChapters: Array<{ id: string; name: string }>;
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
  const questionTypeOptions = [
    { id: 'MCQ', label: 'Multiple Choice (MCQ)', color: 'bg-blue-100 text-blue-800' },
    { id: 'Short Answer', label: 'Short Answer', color: 'bg-green-100 text-green-800' },
    { id: 'Long Answer', label: 'Long Answer', color: 'bg-purple-100 text-purple-800' },
    { id: 'Application Based', label: 'Application Based', color: 'bg-orange-100 text-orange-800' },
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' },
  ];

  // Dynamic question count options based on selected question types
  const getQuestionCountOptions = () => {
    const hasMCQ = formData.questionTypes.includes('MCQ');
    const hasOtherTypes = formData.questionTypes.some(type => type !== 'MCQ');
    
    if (hasMCQ && !hasOtherTypes) {
      // Only MCQ selected - allow up to 100
      return [
        { value: '5', label: '5 Questions' },
        { value: '10', label: '10 Questions' },
        { value: '15', label: '15 Questions' },
        { value: '20', label: '20 Questions' },
        { value: '25', label: '25 Questions' },
        { value: '30', label: '30 Questions' },
        { value: '40', label: '40 Questions' },
        { value: '50', label: '50 Questions' },
        { value: '100', label: '100 Questions' },
      ];
    } else {
      // Other types selected - limit to 25
      return [
        { value: '5', label: '5 Questions' },
        { value: '10', label: '10 Questions' },
        { value: '15', label: '15 Questions' },
        { value: '20', label: '20 Questions' },
        { value: '25', label: '25 Questions' },
      ];
    }
  };

  const handleQuestionTypeChange = (typeId: string, checked: boolean) => {
    const updatedTypes = checked 
      ? [...formData.questionTypes, typeId]
      : formData.questionTypes.filter(t => t !== typeId);
    
    onFormDataChange({ questionTypes: updatedTypes });
    
    // Reset question count if it exceeds the new limit
    const questionCountOptions = getQuestionCountOptions();
    const maxAllowed = Math.max(...questionCountOptions.map(opt => parseInt(opt.value)));
    const currentCount = parseInt(formData.questionCount);
    
    if (currentCount > maxAllowed) {
      onFormDataChange({ questionCount: '25' });
    }
  };

  const isFormValid = formData.selectedSubject && 
                     formData.selectedChapter && 
                     formData.difficulty && 
                     formData.questionTypes.length > 0;

  return (
    <Card className="glass-card smooth-transition w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Generate Smart Questions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Subject</label>
          <Select 
            value={formData.selectedSubject} 
            onValueChange={(value) => onFormDataChange({ selectedSubject: value, selectedChapter: '' })}
          >
            <SelectTrigger className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary transition-all">
              <SelectValue placeholder="Choose your subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id} className="py-2 sm:py-3">
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Chapter</label>
          <Select 
            value={formData.selectedChapter} 
            onValueChange={(value) => onFormDataChange({ selectedChapter: value })}
            disabled={!formData.selectedSubject}
          >
            <SelectTrigger className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary transition-all">
              <SelectValue placeholder="Select chapter to practice" />
            </SelectTrigger>
            <SelectContent>
              {availableChapters.map(chapter => (
                <SelectItem key={chapter.id} value={chapter.id} className="py-2 sm:py-3">
                  {chapter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Question Types</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {questionTypeOptions.map(type => (
              <div key={type.id} className="flex items-center space-x-3 p-3 rounded-xl border-2 border-muted hover:border-primary/30 transition-all">
                <Checkbox
                  id={type.id}
                  checked={formData.questionTypes.includes(type.id)}
                  onCheckedChange={(checked) => handleQuestionTypeChange(type.id, !!checked)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor={type.id} className="flex-1 cursor-pointer">
                  <Badge variant="secondary" className={`${type.color} text-xs px-2 py-1 font-medium`}>
                    {type.label}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty and Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
            <Select value={formData.difficulty} onValueChange={(value) => onFormDataChange({ difficulty: value })}>
              <SelectTrigger className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary transition-all">
                <SelectValue placeholder="Choose difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="py-2 sm:py-3">
                    <span className={`font-medium ${option.color}`}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Number of Questions</label>
            <Select value={formData.questionCount} onValueChange={(value) => onFormDataChange({ questionCount: value })}>
              <SelectTrigger className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary transition-all">
                <SelectValue placeholder="How many?" />
              </SelectTrigger>
              <SelectContent>
                {getQuestionCountOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="py-2 sm:py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={onGenerate}
          disabled={!isFormValid || isLoading || savingQuestions}
          className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
        >
          {isLoading || savingQuestions ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              {savingQuestions ? 'Saving Questions...' : 'Generating Questions...'}
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generate Smart Questions
            </>
          )}
        </Button>

        {/* Helper text */}
        {formData.questionTypes.length > 0 && (
          <div className="text-xs text-muted-foreground text-center bg-accent/20 rounded-lg p-3">
            {formData.questionTypes.includes('MCQ') && !formData.questionTypes.some(type => type !== 'MCQ') 
              ? "💡 MCQ questions support up to 100 questions for extensive practice"
              : "💡 Short/Long/Application-based questions are limited to 25 for quality focus"
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};
