
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Clock, Trophy, Target, Play, RotateCcw, CheckCircle, XCircle, BookOpen } from 'lucide-react';

interface MCQQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  explanation?: string;
  is_pyq: boolean;
  difficulty_level: number;
}

interface QuizSession {
  totalQuestions: number;
  currentQuestion: number;
  score: number;
  timeLeft: number;
  isActive: boolean;
  questions: MCQQuestion[];
  userAnswers: number[];
  showResults: boolean;
}

const MCQQuizPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<QuizSession>({
    totalQuestions: 0,
    currentQuestion: 0,
    score: 0,
    timeLeft: 0,
    isActive: false,
    questions: [],
    userAnswers: [],
    showResults: false
  });

  const generateMCQQuestions = async (count: number = 10) => {
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const prompt = `Generate ${count} multiple choice questions for CBSE Class 10 Mathematics. Focus on:
      - Previous Year Questions (PYQs) pattern
      - Higher exam probability topics
      - Mix of difficulty levels (Easy: 40%, Medium: 40%, Hard: 20%)
      - Cover topics like: Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry, Areas and Volumes, Statistics, Probability
      
      For each question, provide:
      1. Clear question text
      2. Four options (A, B, C, D)
      3. Correct answer index (0-3)
      4. Brief explanation
      5. Mark if it's based on PYQ pattern
      6. Difficulty level (1-3)
      
      Format as JSON array with objects containing: question_text, options, correct_option, explanation, is_pyq, difficulty_level`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'your-openai-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const questionsText = data.choices[0].message.content;
        const questions = JSON.parse(questionsText);
        
        // Save questions to database
        const questionsToSave = questions.map((q: any) => ({
          user_id: user.id,
          question_text: q.question_text,
          options: q.options,
          correct_option: q.correct_option,
          explanation: q.explanation,
          is_pyq: q.is_pyq || false,
          difficulty_level: q.difficulty_level || 1,
          question_type: 'mcq'
        }));

        const { data: savedQuestions, error } = await supabase
          .from('mcq_questions')
          .insert(questionsToSave)
          .select();

        if (error) throw error;

        // Start quiz
        startQuiz(savedQuestions.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: q.options,
          correct_option: q.correct_option,
          explanation: q.explanation,
          is_pyq: q.is_pyq,
          difficulty_level: q.difficulty_level
        })));

        toast({
          title: "Quiz Generated!",
          description: `${count} CBSE Class 10 MCQ questions ready for practice`,
        });
      }
    } catch (error) {
      console.error('Error generating MCQ questions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate MCQ questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = (questions: MCQQuestion[]) => {
    setQuiz({
      totalQuestions: questions.length,
      currentQuestion: 0,
      score: 0,
      timeLeft: questions.length * 60, // 1 minute per question
      isActive: true,
      questions,
      userAnswers: new Array(questions.length).fill(-1),
      showResults: false
    });
  };

  const handleAnswer = (answerIndex: number) => {
    if (!quiz.isActive) return;

    const newAnswers = [...quiz.userAnswers];
    newAnswers[quiz.currentQuestion] = answerIndex;
    
    setQuiz(prev => ({
      ...prev,
      userAnswers: newAnswers
    }));
  };

  const nextQuestion = () => {
    if (quiz.currentQuestion < quiz.totalQuestions - 1) {
      setQuiz(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const correctAnswers = quiz.questions.reduce((count, question, index) => {
      return count + (quiz.userAnswers[index] === question.correct_option ? 1 : 0);
    }, 0);

    const scorePercentage = (correctAnswers / quiz.totalQuestions) * 100;

    setQuiz(prev => ({
      ...prev,
      score: correctAnswers,
      isActive: false,
      showResults: true
    }));

    // Save quiz session
    if (user) {
      await supabase.from('mcq_quiz_sessions').insert({
        user_id: user.id,
        total_questions: quiz.totalQuestions,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
        time_taken: (quiz.totalQuestions * 60) - quiz.timeLeft
      });
    }
  };

  const resetQuiz = () => {
    setQuiz({
      totalQuestions: 0,
      currentQuestion: 0,
      score: 0,
      timeLeft: 0,
      isActive: false,
      questions: [],
      userAnswers: [],
      showResults: false
    });
  };

  // Timer effect
  useEffect(() => {
    if (quiz.isActive && quiz.timeLeft > 0) {
      const timer = setInterval(() => {
        setQuiz(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    } else if (quiz.isActive && quiz.timeLeft === 0) {
      finishQuiz();
    }
  }, [quiz.isActive, quiz.timeLeft]);

  const currentQuestion = quiz.questions[quiz.currentQuestion];
  const progress = quiz.totalQuestions > 0 ? ((quiz.currentQuestion + 1) / quiz.totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">MCQ Quiz Generator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practice with AI-generated CBSE Class 10 Mathematics MCQs focusing on PYQs and high-probability exam questions
          </p>
        </div>

        {!quiz.isActive && !quiz.showResults && (
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Target className="w-6 h-6 text-indigo-600" />
                <span>Start Your MCQ Practice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">CBSE Pattern</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Questions following exact CBSE format</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">PYQ Focus</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Previous year question patterns</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 dark:text-green-300">High Probability</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">Exam-likely questions</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => generateMCQQuestions(10)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start 10 Question Quiz
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => generateMCQQuestions(20)}
                  disabled={isGenerating}
                  variant="outline"
                  className="px-8 py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Extended 20 Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {quiz.isActive && currentQuestion && (
          <div className="space-y-6">
            {/* Quiz Header */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Badge variant={currentQuestion.is_pyq ? "default" : "secondary"}>
                      {currentQuestion.is_pyq ? "PYQ Pattern" : "Practice"}
                    </Badge>
                    <Badge variant="outline">
                      Level {currentQuestion.difficulty_level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(quiz.timeLeft / 60)}:{(quiz.timeLeft % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <span>Question {quiz.currentQuestion + 1} of {quiz.totalQuestions}</span>
                  </div>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="glass-card">
              <CardContent className="p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed">
                  {currentQuestion.question_text}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        quiz.userAnswers[quiz.currentQuestion] === index
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setQuiz(prev => ({ ...prev, currentQuestion: Math.max(0, prev.currentQuestion - 1) }))}
                    disabled={quiz.currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    disabled={quiz.userAnswers[quiz.currentQuestion] === -1}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {quiz.currentQuestion === quiz.totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {quiz.showResults && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You scored {quiz.score} out of {quiz.totalQuestions} questions
                  </p>
                </div>

                <div className="text-6xl font-bold gradient-text">
                  {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800 dark:text-green-300">{quiz.score}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Correct</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-800 dark:text-red-300">{quiz.totalQuestions - quiz.score}</div>
                    <div className="text-sm text-red-600 dark:text-red-400">Incorrect</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {Math.floor(((quiz.totalQuestions * 60) - quiz.timeLeft) / 60)}m
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Time Taken</div>
                  </div>
                </div>

                <Button
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MCQQuizPage;
