
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Play, Loader2, Trophy, Target, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { formatAIResponse } from '@/components/QuestionGenerator/utils';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  chapter: string;
}

interface QuizState {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  showResults: boolean;
  timeLeft: number;
  isTimerActive: boolean;
}

const MCQQuizPage: React.FC = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const availableChapters = selectedSubjectData?.chapters || [];

  const generateMCQPrompt = (
    count: string,
    subjectName: string,
    chapterName: string,
    difficultyLevel: string
  ): string => {
    return `Generate ${count} high-quality CBSE Class 10 MCQ questions for ${subjectName}, chapter "${chapterName}".

IMPORTANT REQUIREMENTS:
- Generate ONLY PYQ (Previous Year Questions) style MCQs or exam-pattern questions
- Difficulty: ${difficultyLevel} level
- Each question must have EXACTLY 4 options (a, b, c, d)
- Questions should be board exam focused and conceptually strong
- Include application-based and HOTS (Higher Order Thinking Skills) questions
- Cover important topics likely to appear in CBSE board exams

FORMAT EACH QUESTION AS:
Question 1: [Clear, exam-style question]
a) [Option 1]
b) [Option 2]
c) [Option 3]
d) [Option 4]
Correct Answer: [a/b/c/d]
Explanation: [Brief explanation of why this answer is correct]

Question 2: [Next question]
...continue this pattern

Make questions challenging but fair, focusing on:
- Conceptual understanding
- Application of knowledge
- Problem-solving skills
- Board exam pattern similarity

Generate exactly ${count} questions following this format.`;
  };

  const parseGeneratedMCQs = (text: string, subject: string, chapter: string): MCQQuestion[] => {
    const formattedText = formatAIResponse(text);
    const questionBlocks = formattedText.split(/Question\s*\d+:/i).filter(q => q.trim());
    
    return questionBlocks.map((block, index) => {
      const lines = block.trim().split('\n').filter(line => line.trim());
      const questionText = lines[0]?.trim() || '';
      
      const options: string[] = [];
      let correctAnswer = 0;
      let explanation = '';
      
      let collectingExplanation = false;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (collectingExplanation) {
          explanation += (explanation ? ' ' : '') + line;
          continue;
        }
        
        if (line.match(/^[a-d]\)/)) {
          options.push(line.replace(/^[a-d]\)\s*/, ''));
        } else if (line.match(/^Correct Answer:\s*[a-d]/i)) {
          const match = line.match(/^Correct Answer:\s*([a-d])/i);
          if (match) {
            correctAnswer = match[1].toLowerCase().charCodeAt(0) - 97;
          }
        } else if (line.match(/^Explanation:/i)) {
          explanation = line.replace(/^Explanation:\s*/i, '');
          collectingExplanation = true;
        }
      }
      
      return {
        id: `mcq-${Date.now()}-${index}`,
        question: questionText,
        options: options.length === 4 ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: correctAnswer,
        explanation: explanation || 'This is the correct answer based on the concept.',
        subject,
        chapter
      };
    });
  };

  const generateQuiz = async () => {
    if (!selectedSubject || !selectedChapter || !difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields before generating quiz",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const subjectName = selectedSubjectData?.name || '';
      const chapterName = availableChapters.find(ch => ch.id === selectedChapter)?.name || '';
      
      const prompt = generateMCQPrompt(questionCount, subjectName, chapterName, difficulty);

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
          }],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      const questions = parseGeneratedMCQs(generatedText, subjectName, chapterName);

      if (questions.length === 0) {
        throw new Error('No valid questions generated');
      }

      setQuizState({
        questions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(questions.length).fill(null),
        showResults: false,
        timeLeft: questions.length * 60, // 1 minute per question
        isTimerActive: true
      });

      toast({
        title: "Quiz Generated! 🎯",
        description: `Created ${questions.length} MCQ questions for practice`,
      });

    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to create quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (!quizState || quizState.showResults) return;

    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestionIndex] = answerIndex;
    
    setQuizState({
      ...quizState,
      selectedAnswers: newSelectedAnswers
    });
  };

  const nextQuestion = () => {
    if (!quizState) return;

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1
      });
    }
  };

  const previousQuestion = () => {
    if (!quizState) return;

    if (quizState.currentQuestionIndex > 0) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex - 1
      });
    }
  };

  const finishQuiz = () => {
    if (!quizState) return;

    setQuizState({
      ...quizState,
      showResults: true,
      isTimerActive: false
    });
  };

  const resetQuiz = () => {
    setQuizState(null);
    setSelectedSubject('');
    setSelectedChapter('');
    setDifficulty('');
  };

  const calculateScore = () => {
    if (!quizState) return { correct: 0, total: 0, percentage: 0 };

    const correct = quizState.selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quizState.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const total = quizState.questions.length;
    const percentage = Math.round((correct / total) * 100);

    return { correct, total, percentage };
  };

  // Timer effect
  React.useEffect(() => {
    if (!quizState?.isTimerActive) return;

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (!prev || prev.timeLeft <= 1) {
          if (prev) {
            return {
              ...prev,
              timeLeft: 0,
              isTimerActive: false,
              showResults: true
            };
          }
          return prev;
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState?.isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizState?.showResults) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5 p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Quiz Completed! 🎉</CardTitle>
              <CardDescription className="text-lg">
                Your Score: {score.correct}/{score.total} ({score.percentage}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4 mb-6">
                <Button onClick={resetQuiz} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Take Another Quiz
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>
              
              <div className="space-y-4">
                {quizState.questions.map((question, index) => {
                  const userAnswer = quizState.selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            Q{index + 1}: {question.question}
                          </CardTitle>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded border ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700'
                                  : optIndex === userAnswer && userAnswer !== question.correctAnswer
                                  ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700'
                                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                              }`}
                            >
                              {String.fromCharCode(97 + optIndex)}) {option}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizState && !quizState.showResults) {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Quiz Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">MCQ Quiz Mode</CardTitle>
                    <CardDescription>
                      Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className={quizState.timeLeft < 60 ? 'text-red-500' : 'text-orange-500'}>
                      {formatTime(quizState.timeLeft)}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={finishQuiz}>
                    Finish Quiz
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
          </Card>

          {/* Current Question */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      quizState.selectedAnswers[quizState.currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                        quizState.selectedAnswers[quizState.currentQuestionIndex] === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={quizState.currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {quizState.questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index === quizState.currentQuestionIndex
                          ? 'bg-blue-500 text-white'
                          : quizState.selectedAnswers[index] !== null
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                {quizState.currentQuestionIndex < quizState.questions.length - 1 ? (
                  <Button onClick={nextQuestion}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={finishQuiz} className="bg-green-600 hover:bg-green-700">
                    Finish Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                MCQ Quiz Generator
              </h1>
              <p className="text-muted-foreground text-lg">
                Practice with CBSE PYQ style MCQ questions
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Setup Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Create Your Quiz
            </CardTitle>
            <CardDescription>
              Generate MCQ questions based on CBSE Class 10 exam pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.icon} {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chapter</label>
                <Select 
                  value={selectedChapter} 
                  onValueChange={setSelectedChapter}
                  disabled={!selectedSubject}
                >
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy - Foundation Level</SelectItem>
                    <SelectItem value="medium">🟡 Medium - Board Exam Level</SelectItem>
                    <SelectItem value="hard">🔴 Hard - Competitive Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Question count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateQuiz} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start MCQ Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-6">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <h3 className="font-semibold mb-2">PYQ Based</h3>
            <p className="text-sm text-muted-foreground">Questions based on previous year papers and exam patterns</p>
          </Card>
          
          <Card className="text-center p-6">
            <Target className="w-12 h-12 mx-auto mb-3 text-blue-500" />
            <h3 className="font-semibold mb-2">Timed Practice</h3>
            <p className="text-sm text-muted-foreground">Practice under exam conditions with time management</p>
          </Card>
          
          <Card className="text-center p-6">
            <Brain className="w-12 h-12 mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold mb-2">Detailed Solutions</h3>
            <p className="text-sm text-muted-foreground">Get explanations for every question after completion</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MCQQuizPage;
