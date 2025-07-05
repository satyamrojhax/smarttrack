
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, Trophy, Target, CheckCircle, XCircle, RotateCcw, Play, ArrowLeft, ArrowRight, Zap, Star, Award } from 'lucide-react';
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
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('1');
  const [numberOfQuestions, setNumberOfQuestions] = useState('10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);

  const difficultyLevels = useMemo(() => [
    { value: '1', label: 'Easy', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: '🟢' },
    { value: '2', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: '🟡' },
    { value: '3', label: 'Hard', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: '🔴' }
  ], []);

  const questionCounts = useMemo(() => ['5', '10', '15', '20'], []);

  // Fetch subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter('');
    }
  }, [selectedSubject]);

  // Timer effect
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

  const fetchSubjects = useCallback(async () => {
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
  }, [toast]);

  const fetchChapters = useCallback(async (subjectId: string) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('subject_id', subjectId)
        .order('order_index');

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive"
      });
    }
  }, [toast]);

  const generateMCQQuestions = useCallback(async () => {
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
      const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
      const selectedChapterData = chapters.find(c => c.id === selectedChapter);
      
      const requestData = {
        subjectId: selectedSubject,
        subjectName: selectedSubjectData?.name || 'General',
        difficulty: selectedDifficulty,
        numberOfQuestions: numberOfQuestions,
        ...(selectedChapter && { 
          chapterId: selectedChapter,
          chapterName: selectedChapterData?.name 
        })
      };

      const { data, error } = await supabase.functions.invoke('generate-mcq-questions', {
        body: requestData
      });

      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      const generatedQuestions = data.questions.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
        explanation: q.explanation,
        difficulty_level: q.difficulty_level,
        is_pyq: q.is_pyq
      }));

      // Start quiz session
      const timeLimit = parseInt(numberOfQuestions) * 90; // 1.5 minutes per question
      setQuizSession({
        questions: generatedQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(generatedQuestions.length).fill(null),
        timeLeft: timeLimit,
        isActive: true,
        showResults: false
      });

      toast({
        title: "Quiz Started! 🎯",
        description: `Generated ${numberOfQuestions} AI-powered questions. Best of luck!`
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate quiz questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedSubject, selectedChapter, selectedDifficulty, numberOfQuestions, subjects, chapters, toast]);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (!quizSession || !quizSession.isActive) return;

    setQuizSession(prev => {
      if (!prev) return null;
      const newSelectedAnswers = [...prev.selectedAnswers];
      newSelectedAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: newSelectedAnswers };
    });
  }, [quizSession]);

  const nextQuestion = useCallback(() => {
    if (!quizSession) return;

    if (quizSession.currentQuestionIndex < quizSession.questions.length - 1) {
      setQuizSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
    } else {
      finishQuiz();
    }
  }, [quizSession]);

  const previousQuestion = useCallback(() => {
    if (!quizSession) return;

    if (quizSession.currentQuestionIndex > 0) {
      setQuizSession(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 } : null);
    }
  }, [quizSession]);

  const finishQuiz = useCallback(async () => {
    if (!quizSession) return;

    const correctAnswers = quizSession.selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quizSession.questions[index].correct_option ? 1 : 0);
    }, 0);

    const scorePercentage = (correctAnswers / quizSession.questions.length) * 100;
    const timeTaken = (parseInt(numberOfQuestions) * 90) - quizSession.timeLeft;

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
  }, [quizSession, numberOfQuestions, user?.id]);

  const resetQuiz = useCallback(() => {
    setQuizSession(null);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getScoreGrade = useCallback((percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', emoji: '🏆' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', emoji: '🎖️' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500', emoji: '🥉' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', emoji: '📚' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500', emoji: '📖' };
    return { grade: 'D', color: 'text-red-500', emoji: '📝' };
  }, []);

  // Results Page
  if (quizSession?.showResults) {
    const correctAnswers = quizSession.selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quizSession.questions[index].correct_option ? 1 : 0);
    }, 0);
    const scorePercentage = (correctAnswers / quizSession.questions.length) * 100;
    const { grade, color, emoji } = getScoreGrade(scorePercentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center pt-4 sm:pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 animate-bounce">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Quiz Complete! {emoji}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Here's how you performed</p>
          </div>

          {/* Score Card */}
          <Card className="glass-card border-none shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardContent className="p-4 sm:p-8">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <div className={`text-5xl sm:text-7xl font-bold ${color}`}>
                    {scorePercentage.toFixed(1)}%
                  </div>
                  <div className={`text-xl sm:text-2xl font-semibold ${color}`}>
                    Grade: {grade}
                  </div>
                  <div className="text-base sm:text-lg text-muted-foreground">
                    {correctAnswers} out of {quizSession.questions.length} correct answers
                  </div>
                </div>
                
                <div className="w-full max-w-md mx-auto">
                  <Progress value={scorePercentage} className="h-3 sm:h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-2 sm:mb-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Correct</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-2 sm:mb-3">
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-600">{quizSession.questions.length - correctAnswers}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Incorrect</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-2 sm:mb-3">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {formatTime((parseInt(numberOfQuestions) * 90) - quizSession.timeLeft)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Time Taken</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Message */}
          <Card className="glass-card border-none bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-lg sm:text-xl font-semibold mb-2">
                {scorePercentage >= 80 ? "Excellent Work! 🌟" : 
                 scorePercentage >= 60 ? "Good Job! 👍" : 
                 "Keep Practicing! 💪"}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {scorePercentage >= 80 ? "You've mastered this topic! Ready for the next challenge?" : 
                 scorePercentage >= 60 ? "You're doing well! A bit more practice and you'll ace it!" : 
                 "Don't worry! Every expert was once a beginner. Keep going!"}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pb-4 sm:pb-8">
            <Button 
              onClick={resetQuiz} 
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Session Page
  if (quizSession && !quizSession.showResults) {
    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;
    const isTimeRunningOut = quizSession.timeLeft <= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {/* Quiz Header */}
          <Card className="glass-card border-none shadow-xl">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold">
                      Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      {currentQuestion.is_pyq && (
                        <Badge variant="secondary" className="text-xs">PYQ</Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${difficultyLevels[currentQuestion.difficulty_level - 1]?.color}`}
                      >
                        {difficultyLevels[currentQuestion.difficulty_level - 1]?.icon} {difficultyLevels[currentQuestion.difficulty_level - 1]?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 text-lg sm:text-xl font-mono font-bold px-3 py-2 rounded-lg ${
                  isTimeRunningOut ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 animate-pulse' : 
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  {formatTime(quizSession.timeLeft)}
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <Progress value={progress} className="h-2 sm:h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Question Card */}
          <Card className="glass-card border-none shadow-xl">
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-base sm:text-lg leading-relaxed font-medium">
                  {currentQuestion.question_text}
                </div>

                <div className="grid gap-2 sm:gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = quizSession.selectedAnswers[quizSession.currentQuestionIndex] === index;
                    const optionLabel = String.fromCharCode(65 + index);
                    
                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full text-left justify-start h-auto p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 hover:border-purple-300'
                        }`}
                        onClick={() => selectAnswer(index)}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 w-full">
                          <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold ${
                            isSelected 
                              ? 'bg-white text-purple-600 border-white' 
                              : 'border-current'
                          }`}>
                            {optionLabel}
                          </div>
                          <span className="text-sm sm:text-base leading-relaxed text-left break-words">
                            {option}
                          </span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="glass-card border-none shadow-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex justify-between items-center gap-3">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={quizSession.currentQuestionIndex === 0}
                  className="flex-1 sm:flex-initial"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                
                <div className="text-xs sm:text-sm text-muted-foreground text-center px-2">
                  {quizSession.selectedAnswers[quizSession.currentQuestionIndex] !== null ? 
                    '✓ Answered' : 'Select an answer'}
                </div>
                
                <Button
                  onClick={nextQuestion}
                  disabled={quizSession.selectedAnswers[quizSession.currentQuestionIndex] === null}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  <span className="hidden sm:inline">
                    {quizSession.currentQuestionIndex === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                  </span>
                  <span className="sm:hidden">
                    {quizSession.currentQuestionIndex === quizSession.questions.length - 1 ? 'Finish' : 'Next'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Setup Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl shadow-lg animate-pulse">
              <Brain className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Quiz Generator
              </h1>
              <p className="text-xs sm:text-lg text-muted-foreground">CBSE Class 10 Pattern Questions</p>
            </div>
          </div>
        </div>

        {/* Setup Card */}
        <Card className="glass-card border-none shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-bounce" />
              Setup Your Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-primary">📚 Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue placeholder="Choose your subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id} className="hover:bg-primary/10">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg">{subject.icon}</span>
                          <span className="text-sm sm:text-base">{subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-primary">📖 Chapter (Optional)</label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedSubject}>
                  <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue placeholder={selectedSubject ? "Select chapter (optional)" : "Select subject first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Chapters</SelectItem>
                    {chapters.map((chapter: any) => (
                      <SelectItem key={chapter.id} value={chapter.id} className="hover:bg-primary/10">
                        <span className="text-sm sm:text-base">{chapter.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-primary">⚡ Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <span>{level.icon}</span>
                          <span className="text-sm sm:text-base">{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-primary">🔢 Questions</label>
                <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                  <SelectTrigger className="h-10 sm:h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionCounts.map(count => (
                      <SelectItem key={count} value={count}>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                          <span className="text-sm sm:text-base">{count} Questions</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <Button
                onClick={generateMCQQuestions}
                disabled={isGenerating || !selectedSubject}
                className="w-full sm:w-auto px-6 sm:px-12 h-12 sm:h-14 text-base sm:text-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                    <span className="animate-pulse">Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    🚀 Start AI Quiz
                  </>
                )}
              </Button>
              {selectedSubject && (
                <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in text-center">
                  {selectedChapter ? 
                    `Chapter-specific quiz • Estimated time: ${Math.round(parseInt(numberOfQuestions) * 1.5)} minutes` :
                    `All chapters • Estimated time: ${Math.round(parseInt(numberOfQuestions) * 1.5)} minutes`
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Features */}
          <Card className="glass-card border-none shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                🎯 Quiz Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {[
                  { icon: "🎓", text: "CBSE Pattern Questions" },
                  { icon: "📝", text: "Previous Year Questions" },
                  { icon: "📖", text: "Chapter-wise Topics" },
                  { icon: "💡", text: "Detailed Explanations" },
                  { icon: "⏱️", text: "Timed Quiz Sessions" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-base sm:text-lg">{feature.icon}</span>
                    <span className="text-xs sm:text-sm font-medium text-green-600">{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="glass-card border-none shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                💡 Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Read questions carefully",
                  "Select specific chapters for focused practice",
                  "Start with easier difficulty",
                  "Manage your time wisely",
                  "Review explanations"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-600">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MCQQuizPage;
