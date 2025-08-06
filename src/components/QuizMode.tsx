import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, Brain, Timer, RotateCcw, Star, Target } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  chapter: string;
}

interface QuizModeProps {
  questions: QuizQuestion[];
  onExit: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ questions, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Disable right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!quizCompleted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitAnswer();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null || timeLeft === 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
      setShowResult(true);
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getScore = () => {
    return answers.reduce((score, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const getScorePercentage = () => {
    return Math.round((getScore() / questions.length) * 100);
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You're a quiz champion! 🏆";
    if (percentage >= 80) return "Excellent work! You really know your stuff! ⭐";
    if (percentage >= 70) return "Great job! You're doing really well! 👏";
    if (percentage >= 60) return "Good effort! Keep practicing to improve! 💪";
    if (percentage >= 50) return "Not bad! There's room for improvement! 📚";
    return "Keep studying and try again! You've got this! 🌟";
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setShowExplanation(false);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = getScore();
    const percentage = getScorePercentage();
    
    return (
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <Card className="glass-card animate-fade-in shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="text-center p-4 sm:p-6 md:p-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Quiz Complete! 🎉
            </CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium mt-2">
              You've finished all the questions!
            </p>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-primary animate-pulse">
                {score}/{questions.length}
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-bold">
                Final Score: {percentage}%
              </p>
              
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center leading-relaxed break-words hyphens-auto">
                  {getPerformanceMessage(percentage)}
                </p>
              </div>
              
              <Badge 
                variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}
                className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full shadow-lg"
              >
                {percentage >= 80 ? "🏆 Excellent!" : percentage >= 60 ? "⭐ Good Job!" : "📚 Keep Practicing!"}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm sm:text-base md:text-lg flex items-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Question Review:
              </h4>
              <div className="max-h-40 sm:max-h-60 overflow-y-auto space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-secondary/20 smooth-transition">
                    <span className="font-medium text-xs sm:text-sm md:text-base">Question {index + 1}</span>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {answers[index] === question.correctAnswer ? (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                          <span className="text-green-600 font-medium text-xs sm:text-sm md:text-base">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                          <span className="text-red-600 font-medium text-xs sm:text-sm md:text-base">Incorrect</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={restartQuiz} className="flex-1 h-12 sm:h-14 text-sm sm:text-base md:text-lg" size="lg">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={onExit} className="flex-1 h-12 sm:h-14 text-sm sm:text-base md:text-lg" size="lg">
                Back to Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      <Card className="glass-card animate-fade-in shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl lg:text-2xl">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-600" />
                <span className="font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Quiz Challenge
                </span>
              </CardTitle>
              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  <span className={`font-mono text-sm sm:text-base md:text-lg font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-red-700'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                  {currentQuestionIndex + 1} / {questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6">
          <div className="space-y-6 sm:space-y-8">
            <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-relaxed text-center break-words word-break hyphens-auto">
                {currentQuestion.question}
              </h3>
            </div>
            
            <div className="grid gap-3 sm:gap-4 md:gap-5">
              {currentQuestion.options.map((option, index) => {
                let buttonVariant: "default" | "outline" | "secondary" = "outline";
                let className = "p-3 sm:p-4 md:p-5 text-left h-auto justify-start smooth-transition text-sm sm:text-base md:text-lg border-2 min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem] rounded-xl shadow-lg hover:shadow-xl";
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    className += " bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300 shadow-green-200";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    className += " bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300 shadow-red-200";
                  } else {
                    className += " opacity-60 bg-gray-50 dark:bg-gray-800";
                  }
                } else if (selectedAnswer === index) {
                  className += " bg-primary/10 border-primary shadow-primary/20 scale-102";
                } else {
                  className += " hover:bg-secondary/50 hover:border-primary/50 hover:scale-102 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={className}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-start w-full gap-2 sm:gap-3 md:gap-4">
                      <span className="font-bold text-xs sm:text-sm md:text-base flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-left break-words leading-relaxed word-break hyphens-auto">
                        {option}
                      </span>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0 animate-bounce" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {showResult && showExplanation && (
              <div className="p-4 sm:p-6 md:p-8 border rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 animate-fade-in border-amber-200 dark:border-amber-800 shadow-lg">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                      </div>
                      <span className="font-bold text-green-700 dark:text-green-300 text-sm sm:text-base md:text-lg">
                        Fantastic! You got it right! 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-300 text-sm sm:text-base md:text-lg">
                        Not quite right, but great effort! 💪
                      </span>
                    </>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-primary text-sm sm:text-base md:text-lg">Here's why:</p>
                  <p className="leading-relaxed text-muted-foreground text-sm sm:text-base md:text-lg break-words word-break hyphens-auto">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
            <Button variant="outline" onClick={onExit} size="lg" className="w-full sm:w-auto order-2 sm:order-1 h-12 sm:h-14 text-sm sm:text-base md:text-lg">
              Exit Quiz
            </Button>
            
            {!showResult ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="px-6 sm:px-8 md:px-10 w-full sm:w-auto order-1 sm:order-2 h-12 sm:h-14 text-sm sm:text-base md:text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {selectedAnswer === null ? "Select an Answer" : "Submit Answer"}
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                size="lg"
                className="px-6 sm:px-8 md:px-10 w-full sm:w-auto order-1 sm:order-2 h-12 sm:h-14 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
