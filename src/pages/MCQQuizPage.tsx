
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
  const { subjects, chapters } = useSyllabus();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const filteredChapters = chapters.filter(chapter => 
    !selectedSubject || chapter.subject_id === selectedSubject
  );

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
      const { data, error } = await supabase.functions.invoke('generate-mcq-questions', {
        body: {
          subject_id: selectedSubject,
          chapter_id: selectedChapter || null,
          difficulty_level: difficulty,
          question_count: questionCount
        }
      });

      if (error) throw error;

      if (data?.questions && data.questions.length > 0) {
        setQuizSession({
          questions: data.questions,
          currentQuestionIndex: 0,
          answers: [],
          score: 0,
          isCompleted: false,
          startTime: new Date(),
          timeElapsed: 0
        });
        setTimer(0);
      } else {
        toast({
          title: "No Questions Available",
          description: "No questions found for the selected criteria. Try different settings.",
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
    
    // Save quiz session to database
    try {
      const { error } = await supabase
        .from('mcq_quiz_sessions')
        .insert({
          user_id: user!.id,
          total_questions: completedSession.questions.length,
          correct_answers: completedSession.score,
          score_percentage: Math.round((completedSession.score / completedSession.questions.length) * 100),
          time_taken: completedSession.timeElapsed,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving quiz session:', error);
      }
    } catch (error) {
      console.error('Error saving quiz session:', error);
    }
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              Quiz Hub
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Test your knowledge with AI-generated questions
            </p>
          </div>
          {quizSession && !quizSession.isCompleted && (
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm sm:text-base">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timer)}
              </Badge>
              <Badge variant="secondary" className="text-sm sm:text-base">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Target className="w-5 h-5 text-blue-600" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subject *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {subjects.map((subject) => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setSelectedChapter('');
                    }}
                    className="justify-start text-xs sm:text-sm h-auto py-3 px-3"
                  >
                    <span className="text-lg mr-2">{subject.icon}</span>
                    <span className="truncate">{subject.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chapter Selection */}
            {selectedSubject && filteredChapters.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Chapter (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant={!selectedChapter ? "default" : "outline"}
                    onClick={() => setSelectedChapter('')}
                    className="justify-start text-xs sm:text-sm h-auto py-2 px-3"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    All Chapters
                  </Button>
                  {filteredChapters.map((chapter) => (
                    <Button
                      key={chapter.id}
                      variant={selectedChapter === chapter.id ? "default" : "outline"}
                      onClick={() => setSelectedChapter(chapter.id)}
                      className="justify-start text-xs sm:text-sm h-auto py-2 px-3"
                    >
                      <span className="truncate">{chapter.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Difficulty Level</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      onClick={() => setDifficulty(level)}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Number of Questions</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? "default" : "outline"}
                      onClick={() => setQuestionCount(count)}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={startQuiz} 
              className="w-full py-3 text-sm sm:text-base font-medium"
              disabled={!selectedSubject}
            >
              <Brain className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      ) : quizSession.isCompleted ? (
        // Quiz Results
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-green-600">{quizSession.score}</p>
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Correct</p>
              </div>
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {quizSession.questions.length - quizSession.score}
                </p>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">Wrong</p>
              </div>
              <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {Math.round((quizSession.score / quizSession.questions.length) * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400">Score</p>
              </div>
              <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {formatTime(quizSession.timeElapsed)}
                </p>
                <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-400">Time</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={resetQuiz} className="flex-1 text-sm sm:text-base">
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={resetQuiz} className="flex-1 text-sm sm:text-base">
                Change Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Active Quiz
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-base sm:text-lg">
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
          <CardContent className="space-y-6">
            <div className="p-4 sm:p-6 bg-accent/50 rounded-lg">
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {quizSession.questions[quizSession.currentQuestionIndex].question_text}
              </p>
            </div>

            <div className="grid gap-3">
              {quizSession.questions[quizSession.currentQuestionIndex].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => answerQuestion(index)}
                  className="justify-start text-left h-auto p-3 sm:p-4 text-xs sm:text-sm hover:bg-accent/70 transition-colors"
                >
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium flex items-center justify-center mr-3 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </Button>
              ))}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
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
