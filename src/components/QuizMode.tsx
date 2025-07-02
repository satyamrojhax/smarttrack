
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
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
        <Card className="glass-card animate-fade-in">
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl">Quiz Complete! 🎉</CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">You've finished all the questions!</p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="text-center space-y-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{score}/{questions.length}</div>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">Final Score: {percentage}%</p>
              
              <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <p className="text-sm sm:text-base md:text-lg font-medium">{getPerformanceMessage(percentage)}</p>
              </div>
              
              <Badge 
                variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}
                className="text-sm sm:text-base md:text-lg px-3 sm:px-4 md:px-6 py-1 sm:py-2"
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
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 md:p-4 border rounded-lg hover:bg-secondary/20 smooth-transition">
                    <span className="font-medium text-xs sm:text-sm md:text-base">Question {index + 1}</span>
                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
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

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button onClick={restartQuiz} className="flex-1" size="lg">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={onExit} className="flex-1" size="lg">
                Back to Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <Card className="glass-card animate-fade-in">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Quiz Challenge</span>
              </CardTitle>
              <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className={`font-mono text-sm sm:text-base md:text-lg ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
                <Badge variant="outline" className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1">
                  {currentQuestionIndex + 1} / {questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2 sm:h-3" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-relaxed break-words">
                {currentQuestion.question}
              </h3>
            </div>
            
            <div className="grid gap-2 sm:gap-3 md:gap-4">
              {currentQuestion.options.map((option, index) => {
                let buttonVariant: "default" | "outline" | "secondary" = "outline";
                let className = "p-3 sm:p-4 text-left h-auto justify-start smooth-transition text-xs sm:text-sm md:text-base border-2 min-h-[3rem] sm:min-h-[3.5rem]";
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    className += " bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    className += " bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300";
                  } else {
                    className += " opacity-60";
                  }
                } else if (selectedAnswer === index) {
                  className += " bg-primary/10 border-primary";
                } else {
                  className += " hover:bg-secondary/50 hover:border-primary/50";
                }

                return (
                  <Button
                    key={index}
                    variant={buttonVariant}
                    className={className}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-start w-full gap-2 sm:gap-3">
                      <span className="font-bold text-sm sm:text-base md:text-lg flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm md:text-base">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-left break-words leading-relaxed">{option}</span>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {showResult && showExplanation && (
              <div className="p-3 sm:p-4 md:p-6 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 animate-fade-in border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
                      </div>
                      <span className="font-bold text-green-700 dark:text-green-300 text-sm sm:text-base md:text-lg">
                        Fantastic! You got it right! 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-600" />
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-300 text-sm sm:text-base md:text-lg">
                        Not quite right, but great effort! 💪
                      </span>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-primary text-xs sm:text-sm md:text-base">Here's why:</p>
                  <p className="leading-relaxed text-muted-foreground text-xs sm:text-sm md:text-base break-words">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-3 sm:gap-4">
            <Button variant="outline" onClick={onExit} size="lg" className="w-full sm:w-auto order-2 sm:order-1">
              Exit Quiz
            </Button>
            
            {!showResult ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="px-4 sm:px-6 md:px-8 w-full sm:w-auto order-1 sm:order-2"
              >
                {selectedAnswer === null ? "Select an Answer" : "Submit Answer"}
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                size="lg"
                className="px-4 sm:px-6 md:px-8 w-full sm:w-auto order-1 sm:order-2"
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
