
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, Brain, Trophy, Target, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';

interface MCQQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
  difficulty_level?: number;
  subject_id?: string;
  chapter_id?: string;
}

interface QuizSession {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  isCompleted: boolean;
  startTime: Date;
  timeElapsed: number;
}

const MCQQuizPage: React.FC = () => {
  const { user } = useAuth();
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Get chapters for the selected subject
  const filteredChapters = selectedSubject 
    ? subjects.find(s => s.id === selectedSubject)?.chapters || []
    : [];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizSession && !quizSession.isCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizSession]);

  const startQuiz = async () => {
    if (!selectedSubject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject to start the quiz.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Generate MCQ questions using AI
      const subjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
      const chapterName = selectedChapter ? filteredChapters.find(ch => ch.id === selectedChapter)?.name || '' : '';
      
      const prompt = `Generate ${questionCount} multiple choice questions for ${subjectName}${chapterName ? ` - ${chapterName}` : ''} at ${difficulty === 1 ? 'easy' : difficulty === 2 ? 'medium' : 'hard'} difficulty level for Class 10 students.

Format each question as:
Question: [question text]
A) [option 1]
B) [option 2] 
C) [option 3]
D) [option 4]
Correct Answer: [A/B/C/D]
Explanation: [brief explanation]

Make sure questions are educational and test understanding of key concepts.`;

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
      
      // Parse the generated questions
      const questions = parseQuestions(generatedText);
      
      if (questions.length > 0) {
        setQuizSession({
          questions: questions,
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          isCompleted: false,
          startTime: new Date(),
          timeElapsed: 0
        });
        setTimer(0);
        
        toast({
          title: "Quiz Started! 🎯",
          description: `Generated ${questions.length} questions for your quiz.`,
        });
      } else {
        toast({
          title: "No Questions Generated",
          description: "Unable to generate questions. Please try different settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to start quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const parseQuestions = (text: string): MCQQuestion[] => {
    const questions: MCQQuestion[] = [];
    const questionBlocks = text.split(/Question \d+:|Question:/i).filter(block => block.trim());
    
    questionBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 6) return; // Need at least question + 4 options + answer
      
      const questionText = lines[0];
      const options: string[] = [];
      let correctAnswer = 0;
      let explanation = '';
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/^[A-D]\)/)) {
          options.push(line.substring(2).trim());
        } else if (line.toLowerCase().startsWith('correct answer:')) {
          const answer = line.split(':')[1].trim().toUpperCase();
          correctAnswer = answer.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        } else if (line.toLowerCase().startsWith('explanation:')) {
          explanation = line.split(':')[1].trim();
        }
      }
      
      if (options.length === 4 && questionText) {
        questions.push({
          id: `q${index + 1}`,
          question_text: questionText,
          options: options,
          correct_option: correctAnswer,
          explanation: explanation,
          difficulty_level: difficulty,
          subject_id: selectedSubject,
          chapter_id: selectedChapter
        });
      }
    });
    
    return questions;
  };

  const answerQuestion = (selectedOption: number) => {
    if (!quizSession) return;

    const newAnswers = [...quizSession.answers, selectedOption];
    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;
    const newScore = quizSession.score + (isCorrect ? 1 : 0);

    if (quizSession.currentQuestionIndex === quizSession.questions.length - 1) {
      // Quiz completed
      completeQuiz({
        ...quizSession,
        answers: newAnswers,
        score: newScore,
        isCompleted: true,
        timeElapsed: timer
      });
    } else {
      // Next question
      setQuizSession({
        ...quizSession,
        currentQuestionIndex: quizSession.currentQuestionIndex + 1,
        answers: newAnswers,
        score: newScore
      });
    }
  };

  const completeQuiz = async (completedSession: QuizSession) => {
    setQuizSession(completedSession);
    
    toast({
      title: "Quiz Complete! 🎉",
      description: `You scored ${completedSession.score}/${completedSession.questions.length}`,
    });
  };

  const resetQuiz = () => {
    setQuizSession(null);
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Generating quiz questions..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-4xl">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-600" />
              Quiz Challenge
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
              Test your knowledge with AI-generated questions
            </p>
          </div>
          {quizSession && !quizSession.isCompleted && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="outline" className="text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {formatTime(timer)}
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {quizSession.currentQuestionIndex + 1} / {quizSession.questions.length}
              </Badge>
            </div>
          )}
        </div>
        <Separator />
      </div>

      {!quizSession ? (
        // Quiz Setup
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Subject *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setSelectedChapter('');
                    }}
                    className="justify-start text-xs sm:text-sm h-auto py-2 sm:py-3 px-2 sm:px-3"
                  >
                    <span className="text-base sm:text-lg mr-2">{subject.icon}</span>
                    <span className="truncate text-left">{subject.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chapter Selection */}
            {selectedSubject && filteredChapters.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">Chapter (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant={!selectedChapter ? "default" : "outline"}
                    onClick={() => setSelectedChapter('')}
                    className="justify-start text-xs sm:text-sm h-auto py-2 px-2 sm:px-3"
                  >
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    All Chapters
                  </Button>
                  {filteredChapters.map((chapter) => (
                    <Button
                      key={chapter.id}
                      variant={selectedChapter === chapter.id ? "default" : "outline"}
                      onClick={() => setSelectedChapter(chapter.id)}
                      className="justify-start text-xs sm:text-sm h-auto py-2 px-2 sm:px-3"
                    >
                      <span className="truncate text-left">{chapter.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level)}
                      size="sm"
                      className="text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                    >
                      {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-foreground">Number of Questions</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? "default" : "outline"}
                      onClick={() => setQuestionCount(count)}
                      size="sm"
                      className="text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={startQuiz} 
              className="w-full py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-medium"
              disabled={!selectedSubject}
            >
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      ) : quizSession.isCompleted ? (
        // Quiz Results
        <Card className="w-full">
          <CardHeader className="text-center p-3 sm:p-4 lg:p-6">
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl lg:text-2xl">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-600" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="p-2 sm:p-3 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{quizSession.score}</p>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Correct</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  {quizSession.questions.length - quizSession.score}
                </p>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">Wrong</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {Math.round((quizSession.score / quizSession.questions.length) * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400">Score</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {formatTime(quizSession.timeElapsed)}
                </p>
                <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400">Time</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button onClick={resetQuiz} className="flex-1 text-xs sm:text-sm lg:text-base py-2 sm:py-3">
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={resetQuiz} className="flex-1 text-xs sm:text-sm lg:text-base py-2 sm:py-3">
                Change Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Active Quiz
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-sm sm:text-base lg:text-lg">
                Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timer)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
            <div className="p-3 sm:p-4 lg:p-6 bg-accent/50 rounded-lg">
              <p className="text-xs sm:text-sm lg:text-base font-medium leading-relaxed">
                {quizSession.questions[quizSession.currentQuestionIndex].question_text}
              </p>
            </div>

            <div className="grid gap-2 sm:gap-3">
              {quizSession.questions[quizSession.currentQuestionIndex].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => answerQuestion(index)}
                  className="justify-start text-left h-auto p-3 sm:p-4 text-xs sm:text-sm hover:bg-accent/70 transition-colors w-full"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-relaxed break-words flex-1">{option}</span>
                </Button>
              ))}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ width: `${((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCQQuizPage;
