import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Copy, Download, Share, Bookmark, Loader2, Eye, EyeOff, Sparkles, Play } from 'lucide-react';
import { QuizMode } from './QuizMode';

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
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());
  const [generatingSolution, setGeneratingSolution] = useState<string | null>(null);
  const [showQuizMode, setShowQuizMode] = useState(false);

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
      .replace(/###\s*(.*?)(\n|$)/g, '\n🔹 $1\n')
      .replace(/##\s*(.*?)(\n|$)/g, '\n📌 $1\n')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/Question\s*(\d+):/gi, '🎯 Question $1:')
      .replace(/Answer:|Solution:/gi, '💡 Here\'s the solution:')
      .replace(/Explanation:/gi, '📝 Let me explain:')
      .replace(/Key Points?:/gi, '🔑 Important points to remember:')
      .replace(/Tips?:/gi, '💭 Pro tip:')
      .replace(/Steps?:/gi, '👣 Step-by-step approach:')
      .replace(/Note:/gi, '📌 Note:')
      .replace(/Remember:/gi, '🧠 Remember:');
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
      
      const prompt = `Hey! I need you to create 5 awesome practice questions for Class 10 CBSE ${subjectName}, specifically from the chapter "${chapterName}". 

Here's what I'm looking for:
- Question types: ${questionTypes.join(', ')}
- Difficulty: ${difficulty} level
- Make them exam-oriented and comprehensive
- For MCQs, include 4 clear options (a, b, c, d) and mark the correct answer
- Test different concepts from the chapter
- Write in a friendly, engaging tone like you're a helpful tutor

Please format each question clearly with proper numbering and make sure they're the kind that would actually help students prepare for their board exams. Thanks!`;

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
      const questionBlocks = formattedText.split(/🎯\s*Question\s*\d+:/i).filter(q => q.trim());
      
      const questions = questionBlocks.map((block, index) => {
        const isHavingMCQ = questionTypes.includes('MCQ');
        let options: string[] | undefined;
        let correctAnswer: number | undefined;
        
        if (isHavingMCQ) {
          const optionMatches = block.match(/[a-d]\)\s*([^\n]+)/gi);
          if (optionMatches && optionMatches.length === 4) {
            options = optionMatches.map(opt => opt.replace(/[a-d]\)\s*/, '').trim());
            correctAnswer = Math.floor(Math.random() * 4); // Random for demo
          }
        }
        
        return {
          id: `${Date.now()}-${index}`,
          question: block.trim(),
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
      
      toast({
        title: "Questions Generated! 🎉",
        description: `Created ${questions.length} engaging practice questions for you`,
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Oops! Something went wrong",
        description: "Couldn't generate questions right now. Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSolution = async (question: GeneratedQuestion) => {
    setGeneratingSolution(question.id);
    
    try {
      const prompt = `Hi! I need a detailed, student-friendly solution for this Class 10 CBSE ${question.subject} question from "${question.chapter}":

${question.question}

Please provide:
1. The correct answer (if applicable)
2. A clear, step-by-step explanation
3. The key concepts involved
4. Helpful tips for similar questions

Write it like you're explaining to a student who wants to really understand the concept, not just memorize the answer. Keep it conversational and encouraging!`;

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
        description: "I've prepared a detailed explanation for you",
      });

    } catch (error) {
      console.error('Error generating solution:', error);
      toast({
        title: "Couldn't generate solution",
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

  const saveQuestion = (question: GeneratedQuestion) => {
    const savedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    const updatedQuestions = [...savedQuestions, question];
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedQuestions));
    
    toast({
      title: "Bookmarked! 🔖",
      description: "Question saved to your bookmarks",
    });
  };

  const exportQuestions = () => {
    const questionsText = generatedQuestions.map((q, index) => 
      `Question ${index + 1}:\n${q.question}\n${q.answer ? `\nSolution:\n${q.answer}` : ''}\n${'='.repeat(50)}\n\n`
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
      description: "Questions saved to your device",
    });
  };

  const startQuiz = () => {
    const mcqQuestions = generatedQuestions.filter(q => q.options && q.correctAnswer !== undefined);
    if (mcqQuestions.length === 0) {
      toast({
        title: "No MCQ Questions",
        description: "Generate some MCQ questions first to start the quiz!",
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
        explanation: q.answer || "Great job! Keep practicing to master this concept.",
        subject: q.subject,
        chapter: q.chapter
      }));

    return (
      <div className="space-y-6 hardware-acceleration">
        <QuizMode 
          questions={quizQuestions}
          onExit={() => setShowQuizMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 hardware-acceleration">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>AI Question Generator</span>
        </h2>
        <p className="text-muted-foreground">Generate personalized practice questions with smart AI solutions</p>
      </div>

      {/* Generator Form */}
      <Card className="glass-card smooth-transition">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Create Your Practice Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="How challenging should it be?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Easy - Building confidence</SelectItem>
                <SelectItem value="medium">🟡 Medium - Balanced practice</SelectItem>
                <SelectItem value="hard">🔴 Hard - Challenge yourself</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question Types (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {['MCQ', 'Short Answer', 'Long Answer', 'HOTS'].map((type) => (
                <Badge
                  key={type}
                  variant={questionTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 smooth-transition hover:scale-105"
                  onClick={() => handleQuestionTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={generateQuestions} 
            disabled={isLoading}
            className="w-full smooth-transition"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating amazing questions for you...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Practice Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card className="glass-card smooth-transition">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <span>🎯 Your Practice Questions</span>
                <Badge variant="secondary">{generatedQuestions.length} questions</Badge>
              </CardTitle>
              <div className="flex space-x-2">
                {generatedQuestions.some(q => q.options) && (
                  <Button variant="outline" size="sm" onClick={startQuiz}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={exportQuestions}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {generatedQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-3 hardware-acceleration hover:shadow-md smooth-transition">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-lg">Question {index + 1}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(question.question)}
                      title="Copy question"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveQuestion(question)}
                      title="Save to bookmarks"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.share?.({ text: question.question })}
                      title="Share question"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-secondary/20 p-3 rounded">
                    {question.question}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{question.type}</Badge>
                    <Badge variant="outline" className="capitalize">{question.difficulty}</Badge>
                    {question.options && <Badge variant="secondary">MCQ</Badge>}
                  </div>
                  
                  <div className="flex space-x-2">
                    {question.answer ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSolutionVisibility(question.id)}
                        className="smooth-transition"
                      >
                        {visibleSolutions.has(question.id) ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Solution
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
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
                        className="smooth-transition"
                      >
                        {generatingSolution === question.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get Solution
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Solution Display */}
                {question.answer && visibleSolutions.has(question.id) && (
                  <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                    <h5 className="font-medium mb-3 text-primary flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Detailed Solution
                    </h5>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
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
