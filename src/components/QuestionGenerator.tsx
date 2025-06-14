
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle, XCircle, RefreshCw, Loader2, Clock, Target } from 'lucide-react';
import { saveQuestionResponse, saveQuestionHistory, saveQuestionToDatabase } from '@/services/questionResponseService';

interface QuestionData {
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  type: string;
  difficulty: number;
}

const QuestionGenerator = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const generateQuestion = async () => {
    setIsGenerating(true);
    try {
      // Mock question generation - replace with actual AI integration
      const mockQuestions = [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          correct_answer: "Paris",
          explanation: "Paris is the capital and largest city of France.",
          type: "mcq",
          difficulty: 1
        },
        {
          question: "Explain the process of photosynthesis.",
          correct_answer: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
          explanation: "This is a fundamental biological process that converts light energy into chemical energy.",
          type: "descriptive",
          difficulty: 2
        }
      ];
      
      const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUserAnswer('');
      setSelectedOption(null);
      setShowAnswer(false);
      setStartTime(Date.now());
      setResponseTime(null);
      
      // Save the generated question to database
      console.log('Saving generated question to database...');
      const saveResult = await saveQuestionToDatabase(
        randomQuestion.question,
        randomQuestion.type,
        randomQuestion.difficulty,
        randomQuestion.correct_answer,
        randomQuestion.options ? { options: randomQuestion.options } : null,
        randomQuestion.explanation
      );
      
      if (saveResult.success) {
        console.log('Question saved to database successfully');
      } else {
        console.error('Failed to save question to database:', saveResult.error);
      }
      
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate question",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || (!userAnswer.trim() && selectedOption === null)) {
      toast({
        title: "Warning",
        description: "Please provide an answer before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const endTime = Date.now();
    const timeTaken = startTime ? Math.round((endTime - startTime) / 1000) : null;
    setResponseTime(timeTaken);

    try {
      const finalAnswer = currentQuestion.type === 'mcq' && selectedOption !== null 
        ? currentQuestion.options?.[selectedOption] || ''
        : userAnswer;

      let isCorrect = false;
      if (currentQuestion.type === 'mcq') {
        isCorrect = finalAnswer === currentQuestion.correct_answer;
      } else {
        // For descriptive questions, we'll mark as correct for now
        // In a real app, this would use AI to evaluate the answer
        isCorrect = finalAnswer.toLowerCase().includes(currentQuestion.correct_answer.toLowerCase().split(' ')[0]);
      }

      console.log('Submitting answer:', { finalAnswer, isCorrect, timeTaken });

      // Save to question_responses table
      const responseResult = await saveQuestionResponse(
        currentQuestion.question,
        finalAnswer,
        currentQuestion.correct_answer,
        isCorrect,
        timeTaken || undefined
      );

      // Save to question_history table
      const historyResult = await saveQuestionHistory(
        currentQuestion.question,
        finalAnswer,
        currentQuestion.correct_answer,
        isCorrect,
        timeTaken || undefined,
        currentQuestion.type,
        currentQuestion.difficulty
      );

      if (responseResult.success && historyResult.success) {
        console.log('Answer saved to database successfully');
        toast({
          title: "Answer Submitted",
          description: `Your answer has been saved. ${isCorrect ? 'Correct!' : 'Incorrect, but keep trying!'}`,
          variant: isCorrect ? "default" : "destructive"
        });
      } else {
        console.error('Failed to save answer:', responseResult.error || historyResult.error);
        toast({
          title: "Warning",
          description: "Answer submitted but failed to save to database",
          variant: "destructive"
        });
      }

      setShowAnswer(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuestion = () => {
    setCurrentQuestion(null);
    setUserAnswer('');
    setSelectedOption(null);
    setShowAnswer(false);
    setStartTime(null);
    setResponseTime(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 mb-2">
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <span>AI Question Generator</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">
            Practice with AI-generated questions and track your progress
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-6">
          <Button
            onClick={generateQuestion}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate New Question
          </Button>
          <Button
            onClick={resetQuestion}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="glass-card mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg md:text-xl">Question</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.type.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Level {currentQuestion.difficulty}
                  </Badge>
                  {startTime && !showAnswer && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Active
                    </Badge>
                  )}
                  {responseTime && showAnswer && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {responseTime}s
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed">
                {currentQuestion.question}
              </p>

              {/* MCQ Options */}
              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showAnswer && setSelectedOption(index)}
                      disabled={showAnswer}
                      className={`w-full p-3 text-left rounded-lg border transition-colors text-sm ${
                        selectedOption === index
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      } ${
                        showAnswer && option === currentQuestion.correct_answer
                          ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : ''
                      } ${
                        showAnswer && selectedOption === index && option !== currentQuestion.correct_answer
                          ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : ''
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {/* Descriptive Answer */}
              {currentQuestion.type === 'descriptive' && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showAnswer}
                    className="min-h-[120px] text-sm"
                  />
                </div>
              )}

              {/* Submit Button */}
              {!showAnswer && (
                <Button
                  onClick={submitAnswer}
                  disabled={isSaving || (!userAnswer.trim() && selectedOption === null)}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Submit Answer
                </Button>
              )}

              {/* Answer Display */}
              {showAnswer && (
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-sm">Correct Answer:</span>
                  </div>
                  <p className="text-sm mb-3">{currentQuestion.correct_answer}</p>
                  
                  {currentQuestion.explanation && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">Explanation:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Generating your question...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;
