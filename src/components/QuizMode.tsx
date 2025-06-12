
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, Brain, Timer, RotateCcw } from 'lucide-react';

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
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (!quizCompleted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answerIndex;
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        setTimeLeft(30);
        
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setQuizCompleted(true);
        }
      }, 2000);
    } else {
      // Auto-move to next question when time runs out
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
        setTimeLeft(30);
        
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setQuizCompleted(true);
        }
      }, 1500);
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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = getScore();
    const percentage = getScorePercentage();
    
    return (
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Quiz Completed! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{score}/{questions.length}</div>
            <p className="text-xl text-muted-foreground">Final Score: {percentage}%</p>
            
            <Badge 
              variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}
              className="text-lg px-4 py-2"
            >
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Question Review:</h4>
            {questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Question {index + 1}</span>
                <div className="flex items-center space-x-2">
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {answers[index] === question.correctAnswer ? "Correct" : "Incorrect"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button onClick={restartQuiz} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Quiz
            </Button>
            <Button variant="outline" onClick={onExit} className="flex-1">
              Exit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Quiz Mode</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4" />
              <span className={`font-mono ${timeLeft <= 10 ? 'text-red-600' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonVariant: "default" | "outline" | "secondary" = "outline";
              let className = "p-4 text-left h-auto justify-start smooth-transition";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonVariant = "default";
                  className += " bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                  className += " bg-red-100 border-red-500 text-red-800";
                }
              } else if (selectedAnswer === index) {
                buttonVariant = "secondary";
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  className={className}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              );
            })}
          </div>
          
          {showResult && (
            <div className="p-4 border rounded-lg bg-secondary/20 animate-fade-in">
              <div className="flex items-center space-x-2 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onExit}>
            Exit Quiz
          </Button>
          
          {!showResult && (
            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
