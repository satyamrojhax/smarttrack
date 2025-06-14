import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Copy, Download, Share, Loader2, Eye, EyeOff, Sparkles, Play } from 'lucide-react';
import { QuizMode } from './QuizMode';
import { saveQuestionResponse, saveQuestionToDatabase } from '@/services/questionResponseService';

interface GeneratedQuestion {
  id: string;
  question: string;
  answer?: string;
  type: string;
  difficulty: string;
  subject: string;
  chapter: string;
  timestamp: number;
  options?: string[];
  correctAnswer?: number;
}

export const QuestionGenerator = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState('5');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());
  const [generatingSolution, setGeneratingSolution] = useState<string | null>(null);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const availableChapters = selectedSubjectData?.chapters || [];

  const handleQuestionTypeToggle = (type: string) => {
    setQuestionTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const formatAIResponse = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '');
  };

  const saveQuestionsToDatabase = async (questions: GeneratedQuestion[]) => {
    setSavingQuestions(true);
    try {
      const chapterId = selectedChapter;
      let savedCount = 0;
      
      for (const question of questions) {
        // Save the question itself
        const questionSaveResult = await saveQuestionToDatabase(
          question.question,
          question.type,
          question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3,
          question.options ? String.fromCharCode(97 + (question.correctAnswer || 0)) : undefined,
          question.options ? question.options : undefined,
          question.answer,
          chapterId
        );

        if (questionSaveResult.success) {
          // Save the generated question response
          await saveQuestionResponse(
            question.question,
            undefined, // user hasn't answered yet
            question.options ? String.fromCharCode(97 + (question.correctAnswer || 0)) : question.answer,
            undefined, // not answered yet
            undefined, // no time taken yet
            questionSaveResult.data?.id
          );
          savedCount++;
        }
      }

      toast({
        title: "Questions Saved! 💾",
        description: `Successfully saved ${savedCount} questions to database`,
      });

    } catch (error) {
      console.error('Error saving questions:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save questions to database",
        variant: "destructive"
      });
    } finally {
      setSavingQuestions(false);
    }
  };

  const generateQuestions = async () => {
    if (!selectedSubject || !selectedChapter || !difficulty || questionTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields before generating questions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const subjectName = selectedSubjectData?.name || '';
      const chapterName = availableChapters.find(ch => ch.id === selectedChapter)?.name || '';
      
      const prompt = `Create ${questionCount} high-quality practice questions for Class 10 CBSE ${subjectName}, chapter "${chapterName}".

Requirements:
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level
- Make them exam-oriented and based on latest CBSE pattern
- DO NOT include any context or introduction as the first question

For MCQ questions, provide exactly 4 options labeled as:
a) [option 1]
b) [option 2] 
c) [option 3]
d) [option 4]

Then clearly state: "Correct Answer: [letter]"

For other question types, write clear, direct questions that test understanding.

Format each question as:
Question 1: [question text]
[If MCQ, include options and correct answer]

Question 2: [question text]
[If MCQ, include options and correct answer]

And so on...

Write in a friendly, encouraging tone like a helpful tutor. Focus on clarity and exam relevance.`;

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
      const formattedText = formatAIResponse(generatedText);
      
      // Parse questions more carefully
      const questionBlocks = formattedText.split(/Question\s*\d+:/i).filter(q => q.trim());
      
      const questions = questionBlocks.map((block, index) => {
        let options: string[] | undefined;
        let correctAnswer: number | undefined;
        let questionText = block.trim();
        
        // Check if it's an MCQ
        const optionMatches = block.match(/[a-d]\)\s*([^\n]+)/gi);
        const correctAnswerMatch = block.match(/Correct Answer:\s*([a-d])/i);
        
        if (optionMatches && optionMatches.length === 4 && correctAnswerMatch) {
          options = optionMatches.map(opt => opt.replace(/[a-d]\)\s*/, '').trim());
          const correctLetter = correctAnswerMatch[1].toLowerCase();
          correctAnswer = correctLetter.charCodeAt(0) - 97; // Convert a-d to 0-3
          
          // Remove options and correct answer from question text
          questionText = questionText
            .replace(/[a-d]\)\s*[^\n]+/gi, '')
            .replace(/Correct Answer:\s*[a-d]/i, '')
            .trim();
        }
        
        return {
          id: `${Date.now()}-${index}`,
          question: questionText,
          type: questionTypes[index % questionTypes.length],
          difficulty,
          subject: subjectName,
          chapter: chapterName,
          timestamp: Date.now(),
          options,
          correctAnswer
        };
      });

      setGeneratedQuestions(questions);
      
      // Auto-save questions to database
      await saveQuestionsToDatabase(questions);
      
      toast({
        title: "Questions Generated Successfully! 🎉",
        description: `Created ${questions.length} practice questions tailored for you`,
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to create questions right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSolution = async (question: GeneratedQuestion) => {
    setGeneratingSolution(question.id);
    
    try {
      const prompt = `Provide a SHORT and CONCISE solution for this Class 10 CBSE ${question.subject} question from "${question.chapter}":

${question.question}

${question.options ? `Options:\na) ${question.options[0]}\nb) ${question.options[1]}\nc) ${question.options[2]}\nd) ${question.options[3]}` : ''}

IMPORTANT: Give ONLY a brief, direct answer. Keep it under 100 words. Include:
1. The correct answer (if MCQ)
2. ONE key explanation line
3. Main concept involved

Be concise and to the point. No lengthy explanations.`;

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
        throw new Error('Failed to generate solution');
      }

      const data = await response.json();
      const solution = formatAIResponse(data.candidates[0].content.parts[0].text);
      
      setGeneratedQuestions(prev => 
        prev.map(q => 
          q.id === question.id 
            ? { ...q, answer: solution }
            : q
        )
      );

      setVisibleSolutions(prev => new Set([...prev, question.id]));

      toast({
        title: "Solution Ready! ✨",
        description: "Brief explanation generated successfully",
      });

    } catch (error) {
      console.error('Error generating solution:', error);
      toast({
        title: "Solution Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setGeneratingSolution(null);
    }
  };

  const toggleSolutionVisibility = (questionId: string) => {
    setVisibleSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast({
      title: "Copied! 📋",
      description: "Question copied to clipboard",
    });
  };

  const exportQuestions = () => {
    const questionsText = generatedQuestions.map((q, index) => 
      `Question ${index + 1}:\n${q.question}\n${q.options ? q.options.map((opt, i) => `${String.fromCharCode(97 + i)}) ${opt}`).join('\n') : ''}\n${q.answer ? `\nSolution:\n${q.answer}` : ''}\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice-questions-${selectedSubject}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 📥",
      description: "Questions exported successfully",
    });
  };

  const startQuiz = () => {
    const mcqQuestions = generatedQuestions.filter(q => q.options && q.correctAnswer !== undefined);
    if (mcqQuestions.length === 0) {
      toast({
        title: "No MCQ Questions Available",
        description: "Please generate MCQ questions first to start the quiz mode!",
        variant: "destructive"
      });
      return;
    }
    setShowQuizMode(true);
  };

  if (showQuizMode) {
    const quizQuestions = generatedQuestions
      .filter(q => q.options && q.correctAnswer !== undefined)
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options!,
        correctAnswer: q.correctAnswer!,
        explanation: q.answer || "Great attempt! The key to mastering this topic is regular practice and understanding the underlying concepts.",
        subject: q.subject,
        chapter: q.chapter
      }));

    return (
      <div className="min-h-screen w-full p-2 sm:p-4 md:p-6">
        <QuizMode 
          questions={quizQuestions}
          onExit={() => setShowQuizMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
          <span>Smart Question Generator</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2">Generate personalized CBSE practice questions with AI-powered solutions</p>
        
        {/* Ask Doubt Button */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90 text-sm sm:text-base"
            onClick={() => window.location.href = '/doubts'}
          >
            <Brain className="w-4 h-4 mr-2" />
            Ask Doubt - ChatGPT Style
          </Button>
        </div>
      </div>

      {/* Generator Form */}
      <Card className="glass-card smooth-transition w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span>Create Your Practice Set</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="How challenging should it be?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy - Foundation building</SelectItem>
                  <SelectItem value="medium">🟡 Medium - Exam preparation</SelectItem>
                  <SelectItem value="hard">🔴 Hard - Advanced practice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="How many questions?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions</SelectItem>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question Types</label>
            <div className="flex flex-wrap gap-2">
              {['MCQ', 'Short Answer', 'Long Answer', 'Application Based'].map((type) => (
                <Badge
                  key={type}
                  variant={questionTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm smooth-transition hover:scale-105"
                  onClick={() => handleQuestionTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateQuestions} 
            disabled={isLoading || savingQuestions}
            className="w-full smooth-transition"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                <span className="text-sm sm:text-base">Generating practice questions...</span>
              </>
            ) : savingQuestions ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                <span className="text-sm sm:text-base">Saving to database...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Generate Practice Questions</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card className="glass-card smooth-transition w-full">
          <CardHeader>
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg md:text-xl">🎯 Your Practice Questions</span>
                <Badge variant="secondary" className="text-sm">{generatedQuestions.length} questions</Badge>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {generatedQuestions.some(q => q.options) && (
                  <Button variant="outline" size="sm" onClick={startQuiz} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90 text-xs sm:text-sm">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Start Quiz Mode
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={exportQuestions} className="text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {generatedQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-3 sm:p-4 md:p-6 space-y-4 smooth-transition bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                  <h4 className="font-semibold text-base sm:text-lg md:text-xl text-primary">Question {index + 1}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(question.question)}
                      title="Copy question"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.share?.({ text: question.question })}
                      title="Share question"
                    >
                      <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <div className="text-sm sm:text-base md:text-lg leading-relaxed bg-white/80 dark:bg-gray-800/80 p-3 sm:p-4 rounded-lg border">
                    {question.question}
                  </div>
                  
                  {question.options && (
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                          <span className="font-bold text-primary text-sm sm:text-base">{String.fromCharCode(97 + optIndex)})</span>
                          <span className="text-sm sm:text-base">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{question.type}</Badge>
                    <Badge variant="outline" className="capitalize text-xs">{question.difficulty}</Badge>
                    {question.options && <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">MCQ</Badge>}
                  </div>
                  
                  <div className="flex space-x-2">
                    {question.answer ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSolutionVisibility(question.id)}
                        className="smooth-transition text-xs sm:text-sm"
                      >
                        {visibleSolutions.has(question.id) ? (
                          <>
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide Solution
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Show Solution
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSolution(question)}
                        disabled={generatingSolution === question.id}
                        className="smooth-transition text-xs sm:text-sm"
                      >
                        {generatingSolution === question.id ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Get Solution
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Solution Display */}
                {question.answer && visibleSolutions.has(question.id) && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-fade-in">
                    <h5 className="font-semibold mb-4 text-primary flex items-center text-sm sm:text-base md:text-lg">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Quick Solution
                    </h5>
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                        {question.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
