
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles } from 'lucide-react';
import { saveQuestionResponse, saveQuestionToDatabase } from '@/services/questionResponseService';
import { saveQuestionToHistory } from '@/services/questionHistoryService';
import { GeneratedQuestion, QuestionFormData } from './types';
import { QuestionForm } from './QuestionForm';
import { QuestionList } from './QuestionList';
import { 
  formatAIResponse, 
  parseQuestions, 
  exportQuestions, 
  generateQuestionsPrompt, 
  generateSolutionPrompt 
} from './utils';

export const QuestionGenerator = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<QuestionFormData>({
    selectedSubject: '',
    selectedChapter: '',
    difficulty: '',
    questionTypes: [],
    questionCount: '5'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());
  const [generatingSolution, setGeneratingSolution] = useState<string | null>(null);
  const [savingQuestions, setSavingQuestions] = useState(false);

  const selectedSubjectData = subjects.find(s => s.id === formData.selectedSubject);
  const availableChapters = selectedSubjectData?.chapters || [];

  const handleFormDataChange = (data: Partial<QuestionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const saveQuestionsToDatabase = async (questions: GeneratedQuestion[]) => {
    setSavingQuestions(true);
    try {
      const chapterId = formData.selectedChapter;
      let savedCount = 0;
      let errorCount = 0;
      
      console.log('Starting to save questions to database:', questions.length);
      
      for (const question of questions) {
        try {
          console.log('Saving individual question:', question.question.substring(0, 50) + '...');
          
          const difficultyNum = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3;
          
          const questionSaveResult = await saveQuestionToDatabase(
            question.question,
            question.type,
            difficultyNum,
            question.options ? String.fromCharCode(97 + (question.correctAnswer || 0)) : question.answer,
            question.options ? question.options : undefined,
            question.answer,
            chapterId
          );

          if (questionSaveResult.success && questionSaveResult.data) {
            console.log('Question saved successfully:', questionSaveResult.data.id);
            
            const historyResult = await saveQuestionToHistory(
              question.question,
              question.type,
              difficultyNum,
              undefined,
              question.options ? String.fromCharCode(97 + (question.correctAnswer || 0)) : question.answer,
              undefined,
              undefined,
              questionSaveResult.data.id
            );

            if (historyResult.success) {
              console.log('Question saved to history successfully');
            } else {
              console.error('Failed to save to history:', historyResult.error);
            }

            const responseResult = await saveQuestionResponse(
              question.question,
              undefined,
              question.options ? String.fromCharCode(97 + (question.correctAnswer || 0)) : question.answer,
              undefined,
              undefined,
              questionSaveResult.data.id
            );

            if (responseResult.success) {
              console.log('Question response saved successfully');
              savedCount++;
            } else {
              console.error('Failed to save question response:', responseResult.error);
              errorCount++;
            }
          } else {
            console.error('Failed to save question:', questionSaveResult.error);
            errorCount++;
          }
        } catch (error) {
          console.error('Error saving individual question:', error);
          errorCount++;
        }
      }

      console.log(`Saving complete. Saved: ${savedCount}, Errors: ${errorCount}`);

      if (savedCount > 0) {
        toast({
          title: "Questions Saved! 💾",
          description: `Successfully saved ${savedCount} questions to database${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Unable to save questions to database. Please check your connection and try again.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error saving questions:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save questions to database",
        variant: "destructive"
      });
    } finally {
      setSavingQuestions(false);
    }
  };

  const generateQuestions = async () => {
    if (!formData.selectedSubject || !formData.selectedChapter || !formData.difficulty || formData.questionTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and select at least one question type",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const subjectName = selectedSubjectData?.name || '';
      const chapterName = availableChapters.find(ch => ch.id === formData.selectedChapter)?.name || '';
      
      const prompt = generateQuestionsPrompt(
        formData.questionCount,
        subjectName,
        chapterName,
        formData.questionTypes,
        formData.difficulty
      );

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      const formattedText = formatAIResponse(generatedText);
      
      const questions = parseQuestions(formattedText, formData.questionTypes, formData.difficulty, subjectName, chapterName);

      setGeneratedQuestions(questions);
      
      await saveQuestionsToDatabase(questions);
      
      toast({
        title: "Questions Generated Successfully! 🎉",
        description: `Created ${questions.length} practice questions tailored for CBSE Class 10`,
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to create questions right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSolution = async (question: GeneratedQuestion) => {
    setGeneratingSolution(question.id);
    
    try {
      const prompt = generateSolutionPrompt(question);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.3
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate solution');
      }

      const data = await response.json();
      const solution = formatAIResponse(data.candidates[0].content.parts[0].text);
      
      setGeneratedQuestions(prev => 
        prev.map(q => 
          q.id === question.id 
            ? { ...q, answer: solution }
            : q
        )
      );

      setVisibleSolutions(prev => new Set([...prev, question.id]));

      toast({
        title: "Solution Ready! ✨",
        description: "Detailed step-by-step solution generated successfully",
      });

    } catch (error) {
      console.error('Error generating solution:', error);
      toast({
        title: "Solution Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setGeneratingSolution(null);
    }
  };

  const toggleSolutionVisibility = (questionId: string) => {
    setVisibleSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast({
      title: "Copied! 📋",
      description: "Question copied to clipboard",
    });
  };

  const handleExportQuestions = () => {
    exportQuestions(generatedQuestions);
    toast({
      title: "Downloaded! 📥",
      description: "Questions exported successfully",
    });
  };

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
          <span>Practice Question Generator</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2">
          Generate CBSE Class 10 PYQ-style questions with detailed step-by-step solutions
        </p>
        
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90 text-sm sm:text-base"
            onClick={() => window.location.href = '/doubts'}
          >
            <Brain className="w-4 h-4 mr-2" />
            Ask Doubt - ChatGPT Style
          </Button>
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 hover:opacity-90 text-sm sm:text-base"
            onClick={() => window.location.href = '/mcq-quiz'}
          >
            <Brain className="w-4 h-4 mr-2" />
            Try MCQ Quiz Mode
          </Button>
        </div>
      </div>

      <QuestionForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
        subjects={subjects}
        availableChapters={availableChapters}
        isLoading={isLoading}
        savingQuestions={savingQuestions}
        onGenerate={generateQuestions}
      />

      <QuestionList
        questions={generatedQuestions}
        visibleSolutions={visibleSolutions}
        generatingSolution={generatingSolution}
        onExportQuestions={handleExportQuestions}
        onCopyQuestion={copyQuestion}
        onToggleSolution={toggleSolutionVisibility}
        onGenerateSolution={generateSolution}
      />
    </div>
  );
};
