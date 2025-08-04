
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles } from 'lucide-react';
import { QuizMode } from '../QuizMode';
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
  const [showQuizMode, setShowQuizMode] = useState(false);
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
        description: "Please fill all fields before generating questions",
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
          }]
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
        description: `Created ${questions.length} practice questions tailored for you`,
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
          }]
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
        description: "Brief explanation generated successfully",
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

  const startQuiz = () => {
    const mcqQuestions = generatedQuestions.filter(q => q.options && q.correctAnswer !== undefined);
    if (mcqQuestions.length === 0) {
      toast({
        title: "No MCQ Questions Available",
        description: "Please generate MCQ questions first to start the quiz mode!",
        variant: "destructive"
      });
      return;
    }
    setShowQuizMode(true);
  };

  if (showQuizMode) {
    const quizQuestions = generatedQuestions
      .filter(q => q.options && q.correctAnswer !== undefined)
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options!,
        correctAnswer: q.correctAnswer!,
        explanation: q.answer || "Great attempt! The key to mastering this topic is regular practice and understanding the underlying concepts.",
        subject: q.subject,
        chapter: q.chapter
      }));

    return (
      <div className="min-h-screen w-full p-2 sm:p-4 md:p-6">
        <QuizMode 
          questions={quizQuestions}
          onExit={() => setShowQuizMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">

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
        onStartQuiz={startQuiz}
        onExportQuestions={handleExportQuestions}
        onCopyQuestion={copyQuestion}
        onToggleSolution={toggleSolutionVisibility}
        onGenerateSolution={generateSolution}
      />
    </div>
  );
};
