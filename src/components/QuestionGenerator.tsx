
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Shuffle, BookOpen, Target, Clock, Award, Loader2 } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  chapter: string;
  type: 'mcq' | 'short' | 'long';
  marks: number;
  estimatedTime: number;
  topic?: string;
}

export const QuestionGenerator = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [questionType, setQuestionType] = useState<'mcq' | 'short' | 'long' | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestions = async () => {
    if (!selectedSubject || !selectedChapter) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and chapter.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const generatedQuestions: Question[] = Array.from({ length: questionCount }, (_, i) => ({
        id: Date.now().toString() + i,
        question: `Question ${i + 1}: What is the capital of ${selectedSubject}?`,
        difficulty: difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard' : difficulty,
        subject: selectedSubject,
        chapter: selectedChapter,
        type: questionType === 'mixed' ? ['mcq', 'short', 'long'][i % 3] as 'mcq' | 'short' | 'long' : questionType,
        marks: i + 1,
        estimatedTime: (i + 1) * 60,
        topic: 'Geography'
      }));

      setQuestions(generatedQuestions);
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${questionCount} questions for ${selectedSubject} - ${selectedChapter}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSubjectData = subjects.find(s => s.name === selectedSubject);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <span>Question Generator</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg">Generate practice questions tailored to your needs 🎯</p>
      </div>

      {/* Configuration Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Question Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject and Chapter Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select onValueChange={(value) => setSelectedSubject(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => setSelectedChapter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSubjectData &&
                    selectedSubjectData.chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.name}>{chapter.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty and Question Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard' | 'mixed')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={(value) => setQuestionType(value as 'mcq' | 'short' | 'long' | 'mixed')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="long">Long Answer</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Number of Questions
            </label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter question count"
            />
          </div>

          {/* Generate Button */}
          <Button onClick={generateQuestions} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      {questions.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Generated Questions</span>
              </div>
              <Badge variant="secondary">{questions.length} Questions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{question.question}</h3>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Subject:</span> {question.subject}
                  </div>
                  <div>
                    <span className="font-medium">Chapter:</span> {question.chapter}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {question.type}
                  </div>
                  <div>
                    <span className="font-medium">Marks:</span> {question.marks}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Time:</span> {question.estimatedTime} seconds
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
