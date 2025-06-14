
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle, XCircle, RefreshCw, Loader2, Clock, Target, Play, Settings } from 'lucide-react';
import { saveQuestionResponse, saveQuestionHistory, saveQuestionToDatabase } from '@/services/questionResponseService';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { QuizMode } from '@/components/QuizMode';

interface QuestionData {
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  type: string;
  difficulty: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  chapter: string;
}

const QuestionGenerator = () => {
  const { toast } = useToast();
  const { subjects } = useSyllabus();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>('mcq');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const availableChapters = selectedSubjectData?.chapters || [];

  const generateQuestions = async () => {
    if (!selectedSubject || !selectedChapter) {
      toast({
        title: "Missing Selection",
        description: "Please select both subject and chapter",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setShowSettings(false);
    
    try {
      // Mock question generation based on selections
      const mockQuestions: QuestionData[] = [];
      
      for (let i = 0; i < questionCount; i++) {
        if (questionType === 'mcq') {
          mockQuestions.push({
            question: `MCQ Question ${i + 1} for ${selectedSubjectData?.name} - ${availableChapters.find(c => c.id === selectedChapter)?.name} (Level ${difficulty})`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct_answer: "Option A",
            explanation: "This is the correct answer because...",
            type: "mcq",
            difficulty: difficulty
          });
        } else {
          mockQuestions.push({
            question: `Descriptive Question ${i + 1} for ${selectedSubjectData?.name} - ${availableChapters.find(c => c.id === selectedChapter)?.name} (Level ${difficulty})`,
            correct_answer: "This is a sample descriptive answer that explains the concept thoroughly.",
            explanation: "This answer covers all the key points needed for understanding.",
            type: "descriptive",
            difficulty: difficulty
          });
        }
      }
      
      setGeneratedQuestions(mockQuestions);
      setCurrentQuestion(mockQuestions[0]);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setSelectedOption(null);
      setShowAnswer(false);
      setStartTime(Date.now());
      setResponseTime(null);
      
      // Save all generated questions to database
      for (const question of mockQuestions) {
        const saveResult = await saveQuestionToDatabase(
          question.question,
          question.type,
          question.difficulty,
          question.correct_answer,
          question.options ? { options: question.options } : null,
          question.explanation,
          selectedChapter
        );
        
        if (!saveResult.success) {
          console.error('Failed to save question:', saveResult.error);
        }
      }
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuizMode = () => {
    if (generatedQuestions.length === 0 || questionType !== 'mcq') return;
    
    const quizQuestions: QuizQuestion[] = generatedQuestions.map((q, index) => ({
      id: `question-${index}`,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.options?.indexOf(q.correct_answer) || 0,
      explanation: q.explanation || '',
      subject: selectedSubjectData?.name || '',
      chapter: availableChapters.find(c => c.id === selectedChapter)?.name || ''
    }));
    
    setShowQuiz(true);
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
        isCorrect = finalAnswer.toLowerCase().includes(currentQuestion.correct_answer.toLowerCase().split(' ')[0]);
      }

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
        toast({
          title: "Answer Submitted",
          description: `Your answer has been saved. ${isCorrect ? 'Correct!' : 'Incorrect, but keep trying!'}`,
          variant: isCorrect ? "default" : "destructive"
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

  const nextQuestion = () => {
    if (currentQuestionIndex < generatedQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(generatedQuestions[nextIndex]);
      setUserAnswer('');
      setSelectedOption(null);
      setShowAnswer(false);
      setStartTime(Date.now());
      setResponseTime(null);
    }
  };

  const resetGenerator = () => {
    setCurrentQuestion(null);
    setGeneratedQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setSelectedOption(null);
    setShowAnswer(false);
    setStartTime(null);
    setResponseTime(null);
    setShowSettings(true);
    setShowQuiz(false);
  };

  if (showQuiz && generatedQuestions.length > 0 && questionType === 'mcq') {
    const quizQuestions: QuizQuestion[] = generatedQuestions.map((q, index) => ({
      id: `question-${index}`,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.options?.indexOf(q.correct_answer) || 0,
      explanation: q.explanation || '',
      subject: selectedSubjectData?.name || '',
      chapter: availableChapters.find(c => c.id === selectedChapter)?.name || ''
    }));

    return <QuizMode questions={quizQuestions} onExit={() => setShowQuiz(false)} />;
  }

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
            Generate customized questions based on your syllabus and practice with AI
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Question Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <span>{subject.icon}</span>
                          <span>{subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Chapter</label>
                <Select 
                  value={selectedChapter} 
                  onValueChange={setSelectedChapter}
                  disabled={!selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableChapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Question Type</label>
                <RadioGroup value={questionType} onValueChange={setQuestionType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mcq" id="mcq" />
                    <label htmlFor="mcq" className="text-sm">Multiple Choice Questions (MCQ)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="descriptive" id="descriptive" />
                    <label htmlFor="descriptive" className="text-sm">Descriptive Questions</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty.toString()} onValueChange={(value) => setDifficulty(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Easy (Level 1)</SelectItem>
                    <SelectItem value="2">Medium (Level 2)</SelectItem>
                    <SelectItem value="3">Hard (Level 3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateQuestions}
                disabled={isGenerating || !selectedSubject || !selectedChapter}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                Generate Questions
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        {!showSettings && generatedQuestions.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
            <div className="flex gap-2">
              <Button
                onClick={resetGenerator}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                New Questions
              </Button>
              {questionType === 'mcq' && (
                <Button
                  onClick={startQuizMode}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Quiz Mode
                </Button>
              )}
            </div>
            <Badge variant="outline" className="text-sm">
              Question {currentQuestionIndex + 1} of {generatedQuestions.length}
            </Badge>
          </div>
        )}

        {/* Question Card */}
        {currentQuestion && !showSettings && (
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

              {/* Next Question Button */}
              {showAnswer && currentQuestionIndex < generatedQuestions.length - 1 && (
                <Button
                  onClick={nextQuestion}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  Next Question
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
                <p className="text-muted-foreground">Generating your customized questions...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;
