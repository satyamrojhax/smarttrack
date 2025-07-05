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
      const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
      
      const { data, error } = await supabase.functions.invoke('generate-mcq-questions', {
        body: {
          subjectId: selectedSubject,
          subjectName: selectedSubjectData?.name || 'General',
          difficulty: selectedDifficulty,
          numberOfQuestions: numberOfQuestions
        }
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
        description: `Generated ${numberOfQuestions} AI-powered CBSE questions. Best of luck!`
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg animate-pulse">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI MCQ Quiz Generator
              </h1>
              <p className="text-muted-foreground text-lg">CBSE Class 10 Pattern Questions</p>
            </div>
          </div>
        </div>

        <Card className="glass-card border-none shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-8 h-8 text-primary animate-bounce" />
              Setup Your Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-primary">📚 Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue placeholder="Choose your subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id} className="hover:bg-primary/10">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{subject.icon}</span>
                          <span>{subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-primary">⚡ Difficulty Level</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            level.value === '1' ? 'bg-green-500' : 
                            level.value === '2' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className={level.color}>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-primary">🔢 Questions Count</label>
                <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                  <SelectTrigger className="h-12 border-2 hover:border-primary transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionCounts.map(count => (
                      <SelectItem key={count} value={count}>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>{count} Questions</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={generateMCQQuestions}
                disabled={isGenerating || !selectedSubject}
                className="w-full md:w-auto px-12 h-14 text-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="animate-pulse">Generating AI Questions...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-3" />
                    🚀 Start AI Quiz
                  </>
                )}
              </Button>
              {selectedSubject && (
                <p className="text-sm text-muted-foreground animate-fade-in">
                  Estimated time: {parseInt(numberOfQuestions) * 1.5} minutes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              🎯 Quiz Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "🎓", text: "CBSE Class 10 Pattern Questions", color: "text-blue-600" },
                { icon: "📝", text: "Previous Year Questions (PYQs)", color: "text-purple-600" },
                { icon: "💡", text: "Detailed Step-by-Step Explanations", color: "text-orange-600" },
                { icon: "⏱️", text: "Smart Timed Quiz Sessions", color: "text-green-600" },
                { icon: "🤖", text: "AI-Generated Quality Questions", color: "text-red-600" },
                { icon: "📊", text: "Performance Analytics & Results", color: "text-cyan-600" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className={`font-medium ${feature.color}`}>{feature.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="glass-card border-none shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-400 rounded-full">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">💡 Pro Tips for Better Performance</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• Use the explanation feature to understand concepts better</li>
                  <li>• Start with easier difficulty and gradually increase</li>
                  <li>• Time yourself to simulate real exam conditions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCQQuizPage;