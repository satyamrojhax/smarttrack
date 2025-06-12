
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Copy, Download, Share, Bookmark, Loader2 } from 'lucide-react';

interface GeneratedQuestion {
  id: string;
  question: string;
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
      
      const prompt = `Generate 5 questions for Class 10 CBSE ${subjectName}, chapter '${chapterName}'. Include ${questionTypes.join(', ')} type questions. Keep difficulty ${difficulty}. Format the output clearly with question numbers.`;

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
      
      // Parse the generated text into individual questions
      const questions = generatedText.split(/\d+\./).filter(q => q.trim()).map((q, index) => ({
        id: `${Date.now()}-${index}`,
        question: q.trim(),
        type: questionTypes[index % questionTypes.length],
        difficulty,
        subject: subjectName,
        chapter: chapterName,
        timestamp: Date.now()
      }));

      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions Generated!",
        description: `Generated ${questions.length} questions successfully`,
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
      `${index + 1}. ${q.question}`
    ).join('\n\n');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions-${selectedSubject}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <span>AI Question Generator</span>
        </h2>
        <p className="text-muted-foreground">Generate practice questions using AI</p>
      </div>

      {/* Generator Form */}
      <Card className="glass-card">
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
                  className="cursor-pointer px-3 py-1"
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
            className="w-full"
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
        <Card className="glass-card">
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
              <div key={question.id} className="border rounded-lg p-4 space-y-3">
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
                <p className="text-sm">{question.question}</p>
                <div className="flex space-x-2">
                  <Badge variant="outline">{question.type}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
