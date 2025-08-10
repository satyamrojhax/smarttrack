import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DomainMigrationPopup from '@/components/DomainMigrationPopup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Play, 
  Trophy, 
  Target, 
  BookOpen, 
  Brain, 
  ChevronRight, 
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Zap,
  Award
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  chapter: string;
}

interface QuizSettings {
  subject: string;
  chapter: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
}

const MCQQuizPage: React.FC = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  
  const [currentTab, setCurrentTab] = useState('setup');
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    subject: '',
    chapter: '',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: 15
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const selectedSubject = subjects.find(s => s.id === quizSettings.subject);
  const availableChapters = selectedSubject?.chapters || [];

  // Show popup after 3 seconds on page load (non-closable)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [quizStarted, timeRemaining, quizCompleted]);

  const generateQuestions = async () => {
    if (!quizSettings.subject || !quizSettings.chapter) {
      toast({
        title: "Missing Information",
        description: "Please select subject and chapter",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const subjectName = selectedSubject?.name || '';
      const chapterName = availableChapters.find(ch => ch.id === quizSettings.chapter)?.name || '';
      
      const prompt = `Generate ${quizSettings.questionCount} multiple choice questions for ${subjectName} - ${chapterName} at ${quizSettings.difficulty} difficulty level.

Format as JSON array:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer",
    "difficulty": "${quizSettings.difficulty}"
  }
]

Make questions challenging and educational. Include variety in question types.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questionsData = JSON.parse(jsonMatch[0]);
        const formattedQuestions: QuizQuestion[] = questionsData.map((q: any, index: number) => ({
          id: `q${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          subject: subjectName,
          chapter: chapterName
        }));
        
        setQuestions(formattedQuestions);
        setCurrentTab('quiz');
        
        toast({
          title: "Questions Generated! 🎯",
          description: `${formattedQuestions.length} questions ready for your quiz`,
        });
      }
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quizSettings.timeLimit * 60); // Convert to seconds
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    setQuizStarted(false);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / questions.length) * 100);
    return {
      correct,
      total: questions.length,
      percentage,
      incorrect: questions.length - correct
    };
  };

  const resetQuiz = () => {
    setCurrentTab('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeRemaining(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowResults(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const results = showResults ? calculateResults() : null;

  return (
    <>
      <DomainMigrationPopup
        isOpen={showPopup}
        showCloseButton={false}
        variant="quiz"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎯 Smart MCQ Quiz Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your knowledge with AI-powered personalized quizzes
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="quiz" disabled={questions.length === 0} className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!showResults} className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quiz Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={quizSettings.subject} onValueChange={(value) => 
                      setQuizSettings(prev => ({ ...prev, subject: value, chapter: '' }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter</Label>
                    <Select value={quizSettings.chapter} onValueChange={(value) => 
                      setQuizSettings(prev => ({ ...prev, chapter: value }))
                    } disabled={!quizSettings.subject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
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

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={quizSettings.difficulty} onValueChange={(value) => 
                      setQuizSettings(prev => ({ ...prev, difficulty: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionCount">Number of Questions</Label>
                    <Input
                      type="number"
                      min="5"
                      max="50"
                      value={quizSettings.questionCount}
                      onChange={(e) => setQuizSettings(prev => ({ 
                        ...prev, 
                        questionCount: parseInt(e.target.value) || 10 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={quizSettings.timeLimit}
                      onChange={(e) => setQuizSettings(prev => ({ 
                        ...prev, 
                        timeLimit: parseInt(e.target.value) || 15 
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={generateQuestions} 
                  disabled={isGenerating || !quizSettings.subject || !quizSettings.chapter}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            {!quizStarted && !quizCompleted ? (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center">Ready to Start?</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{questions.length} Questions</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{quizSettings.timeLimit} Minutes</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">{quizSettings.difficulty}</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Trophy className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Challenge</p>
                    </div>
                  </div>
                  
                  <Button onClick={startQuiz} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xl py-6 px-12">
                    <Play className="w-6 h-6 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : quizStarted && currentQuestion ? (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Clock className="w-5 h-5" />
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                  <Progress 
                    value={((currentQuestionIndex + 1) / questions.length) * 100} 
                    className="w-full mt-4"
                  />
                </CardHeader>
                <CardContent className="space-y-6">
                  <h3 className="text-xl font-semibold leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="grid gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                        className={`p-4 h-auto text-left justify-start transition-all duration-200 ${
                          selectedAnswers[currentQuestionIndex] === index 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105' 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <span className="mr-3 font-bold">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestionIndex] === -1}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="results">
            {results && (
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Quiz Results</CardTitle>
                  <div className="text-6xl my-6">
                    {results.percentage >= 80 ? '🏆' : results.percentage >= 60 ? '🎖️' : '📚'}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {results.percentage}%
                    </div>
                    <p className="text-muted-foreground">
                      You got {results.correct} out of {results.total} questions correct
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{results.correct}</p>
                      <p className="text-sm text-green-700 dark:text-green-400">Correct</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">{results.incorrect}</p>
                      <p className="text-sm text-red-700 dark:text-red-400">Incorrect</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Review Answers:</h4>
                    {questions.map((question, index) => {
                      const userAnswer = selectedAnswers[index];
                      const isCorrect = userAnswer === question.correctAnswer;
                      
                      return (
                        <div key={question.id} className={`p-4 rounded-lg border ${
                          isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-red-50 dark:bg-red-900/20 border-red-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.question}</p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Your answer:</strong> {userAnswer !== -1 ? question.options[userAnswer] : 'Not answered'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                              </p>
                              {question.explanation && (
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={resetQuiz} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Quiz
                    </Button>
                    <Button onClick={() => window.location.href = '/'} className="flex-1">
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default MCQQuizPage;