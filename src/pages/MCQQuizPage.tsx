import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, Trophy, Target, CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MCQQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
  difficulty_level: number;
  is_pyq: boolean;
}

interface QuizSession {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  timeLeft: number;
  isActive: boolean;
  showResults: boolean;
}

const MCQQuizPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('1');
  const [numberOfQuestions, setNumberOfQuestions] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);

  const difficultyLevels = [
    { value: '1', label: 'Easy', color: 'text-green-600' },
    { value: '2', label: 'Medium', color: 'text-yellow-600' },
    { value: '3', label: 'Hard', color: 'text-red-600' }
  ];

  const questionCounts = ['5', '10', '15', '20'];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizSession?.isActive && quizSession.timeLeft > 0) {
      interval = setInterval(() => {
        setQuizSession(prev => {
          if (!prev) return null;
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            return { ...prev, timeLeft: 0, isActive: false, showResults: true };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizSession?.isActive, quizSession?.timeLeft]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      });
    }
  };

  const generateMCQQuestions = async () => {
    if (!selectedSubject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate questions using AI (mock data for now)
      const mockQuestions: MCQQuestion[] = Array.from({ length: parseInt(numberOfQuestions) }, (_, i) => ({
        id: `q-${i + 1}`,
        question_text: `CBSE Class 10 ${subjects.find(s => s.id === selectedSubject)?.name} Question ${i + 1}: What is the main concept discussed in this topic? This is a sample PYQ question that would appear in board exams.`,
        options: [
          'Option A: First possible answer',
          'Option B: Second possible answer', 
          'Option C: Third possible answer',
          'Option D: Fourth possible answer'
        ],
        correct_option: Math.floor(Math.random() * 4),
        explanation: `This is the detailed explanation for question ${i + 1}. The correct answer is explained step by step with proper reasoning according to CBSE Class 10 pattern.`,
        difficulty_level: parseInt(selectedDifficulty),
        is_pyq: Math.random() > 0.5
      }));

      // Save questions to database
      const { error: insertError } = await supabase
        .from('mcq_questions')
        .insert(
          mockQuestions.map(q => ({
            user_id: user?.id,
            question_text: q.question_text,
            options: q.options,
            correct_option: q.correct_option,
            subject_id: selectedSubject,
            difficulty_level: q.difficulty_level,
            explanation: q.explanation,
            is_pyq: q.is_pyq
          }))
        );

      if (insertError) throw insertError;

      // Start quiz session
      const timeLimit = parseInt(numberOfQuestions) * 60; // 1 minute per question
      setQuizSession({
        questions: mockQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(mockQuestions.length).fill(null),
        timeLeft: timeLimit,
        isActive: true,
        showResults: false
      });

      toast({
        title: "Quiz Started!",
        description: `Generated ${numberOfQuestions} questions. Good luck!`
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz questions",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (!quizSession || !quizSession.isActive) return;

    setQuizSession(prev => {
      if (!prev) return null;
      const newSelectedAnswers = [...prev.selectedAnswers];
      newSelectedAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: newSelectedAnswers };
    });
  };

  const nextQuestion = () => {
    if (!quizSession) return;

    if (quizSession.currentQuestionIndex < quizSession.questions.length - 1) {
      setQuizSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (!quizSession) return;

    if (quizSession.currentQuestionIndex > 0) {
      setQuizSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 } : null);
    }
  };

  const finishQuiz = async () => {
    if (!quizSession) return;

    const correctAnswers = quizSession.selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quizSession.questions[index].correct_option ? 1 : 0);
    }, 0);

    const scorePercentage = (correctAnswers / quizSession.questions.length) * 100;
    const timeTaken = (parseInt(numberOfQuestions) * 60) - quizSession.timeLeft;

    try {
      // Save quiz session to database
      await supabase.from('mcq_quiz_sessions').insert({
        user_id: user?.id,
        total_questions: quizSession.questions.length,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
        time_taken: timeTaken
      });

      setQuizSession(prev => prev ? { ...prev, isActive: false, showResults: true } : null);
    } catch (error) {
      console.error('Error saving quiz session:', error);
    }
  };

  const resetQuiz = () => {
    setQuizSession(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizSession?.showResults) {
    const correctAnswers = quizSession.selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quizSession.questions[index].correct_option ? 1 : 0);
    }, 0);
    const scorePercentage = (correctAnswers / quizSession.questions.length) * 100;

    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">
                {scorePercentage.toFixed(1)}%
              </div>
              <div className="text-xl text-muted-foreground">
                {correctAnswers} out of {quizSession.questions.length} correct
              </div>
              <Progress value={scorePercentage} className="w-full h-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{quizSession.questions.length - correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatTime((parseInt(numberOfQuestions) * 60) - quizSession.timeLeft)}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizSession && !quizSession.showResults) {
    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;

    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">
                  Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-lg font-mono">
                  <Clock className="w-5 h-5" />
                  {formatTime(quizSession.timeLeft)}
                </div>
                {currentQuestion.is_pyq && (
                  <Badge variant="secondary">PYQ</Badge>
                )}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed">
              {currentQuestion.question_text}
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={quizSession.selectedAnswers[quizSession.currentQuestionIndex] === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => selectAnswer(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={quizSession.currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={quizSession.selectedAnswers[quizSession.currentQuestionIndex] === null}
              >
                {quizSession.currentQuestionIndex === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-8 h-8 text-primary" />
            MCQ Quiz Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionCounts.map(count => (
                    <SelectItem key={count} value={count}>
                      {count} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateMCQQuestions}
            disabled={isGenerating || !selectedSubject}
            className="w-full h-12 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>CBSE Class 10 Pattern Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Previous Year Questions (PYQs)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Detailed Explanations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Timed Quiz Sessions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCQQuizPage;