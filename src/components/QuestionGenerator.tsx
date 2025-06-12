import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Copy, Download, Share, Bookmark, Loader2, Eye, EyeOff } from 'lucide-react';

interface GeneratedQuestion {
  id: string;
  question: string;
  answer?: string;
  type: string;
  difficulty: string;
  subject: string;
  chapter: string;
  timestamp: number;
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

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const availableChapters = selectedSubjectData?.chapters || [];

  const handleQuestionTypeToggle = (type: string) => {
    setQuestionTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
      
      const prompt = `Generate 5 well-structured questions for Class 10 CBSE ${subjectName}, chapter '${chapterName}'. 

Requirements:
- Include ${questionTypes.join(', ')} type questions
- Difficulty level: ${difficulty}
- Format each question clearly with proper numbering
- For MCQ questions, provide 4 options (a, b, c, d)
- Make questions comprehensive and exam-oriented
- Ensure questions test different concepts within the chapter

Format:
Question 1: [Question text]
[Options if MCQ]

Question 2: [Question text]
[Options if MCQ]

Continue this pattern for all 5 questions.`;

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
      
      // Parse the generated text into individual questions with better formatting
      const questionBlocks = generatedText.split(/Question\s*\d+:/i).filter(q => q.trim());
      
      const questions = questionBlocks.map((block, index) => ({
        id: `${Date.now()}-${index}`,
        question: block.trim(),
        type: questionTypes[index % questionTypes.length],
        difficulty,
        subject: subjectName,
        chapter: chapterName,
        timestamp: Date.now()
      }));

      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions Generated!",
        description: `Generated ${questions.length} high-quality questions`,
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSolution = async (question: GeneratedQuestion) => {
    setGeneratingSolution(question.id);
    
    try {
      const prompt = `Provide a detailed solution for this Class 10 CBSE ${question.subject} question from chapter '${question.chapter}':

${question.question}

Please provide:
1. The correct answer
2. Step-by-step explanation
3. Key concepts involved
4. Tips for similar questions

Make the solution clear and educational.`;

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
      const solution = data.candidates[0].content.parts[0].text;
      
      // Update the question with the solution
      setGeneratedQuestions(prev => 
        prev.map(q => 
          q.id === question.id 
            ? { ...q, answer: solution }
            : q
        )
      );

      setVisibleSolutions(prev => new Set([...prev, question.id]));

      toast({
        title: "Solution Generated!",
        description: "Detailed solution is now available",
      });

    } catch (error) {
      console.error('Error generating solution:', error);
      toast({
        title: "Solution Failed",
        description: "Failed to generate solution. Please try again.",
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
      title: "Copied!",
      description: "Question copied to clipboard",
    });
  };

  const saveQuestion = (question: GeneratedQuestion) => {
    const savedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    const updatedQuestions = [...savedQuestions, question];
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedQuestions));
    
    toast({
      title: "Bookmarked!",
      description: "Question saved to bookmarks",
    });
  };

  const exportQuestions = () => {
    const questionsText = generatedQuestions.map((q, index) => 
      `Question ${index + 1}:\n${q.question}\n${q.answer ? `\nSolution:\n${q.answer}` : ''}\n\n`
    ).join('');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-${selectedSubject}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 hardware-acceleration">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <span>AI Question Generator</span>
        </h2>
        <p className="text-muted-foreground">Generate practice questions with AI-powered solutions</p>
      </div>

      {/* Generator Form */}
      <Card className="glass-card smooth-transition">
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
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
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question Types</label>
            <div className="flex flex-wrap gap-2">
              {['MCQ', 'Short Answer', 'Long Answer', 'HOTS'].map((type) => (
                <Badge
                  key={type}
                  variant={questionTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 smooth-transition"
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
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Questions
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
              <CardTitle>Generated Questions</CardTitle>
              <Button variant="outline" size="sm" onClick={exportQuestions}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-3 hardware-acceleration">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(question.question)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveQuestion(question)}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.share?.({ text: question.question })}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-medium">{question.question}</pre>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{question.type}</Badge>
                    <Badge variant="outline">{question.difficulty}</Badge>
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
                            Generating...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Get Solution
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Solution Display */}
                {question.answer && visibleSolutions.has(question.id) && (
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg animate-fade-in">
                    <h5 className="font-medium mb-2 text-primary">Solution:</h5>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">{question.answer}</pre>
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
