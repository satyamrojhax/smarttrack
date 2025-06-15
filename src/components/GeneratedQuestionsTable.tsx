
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Download, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserQuestionResponses } from '@/services/questionResponseService';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedQuestion {
  id: string;
  question_text: string;
  question_type: string;
  difficulty_level: number;
  correct_answer: string;
  created_at: string;
  subjects?: { name: string };
  chapters?: { name: string };
}

export const GeneratedQuestionsTable: React.FC = () => {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedDifficulty, selectedType]);

  const fetchQuestions = async () => {
    try {
      const data = await getUserQuestionResponses();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch generated questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subjects?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.chapters?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty_level === parseInt(selectedDifficulty));
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(q => q.question_type === selectedType);
    }

    setFilteredQuestions(filtered);
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_generated_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const exportQuestions = () => {
    const csv = [
      'Question,Type,Difficulty,Subject,Chapter,Answer,Created At',
      ...filteredQuestions.map(q => [
        `"${q.question_text.replace(/"/g, '""')}"`,
        q.question_type || '',
        q.difficulty_level,
        q.subjects?.name || '',
        q.chapters?.name || '',
        `"${q.correct_answer?.replace(/"/g, '""') || ''}"`,
        new Date(q.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-questions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Questions exported successfully",
    });
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 2:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 3:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Questions ({filteredQuestions.length})</span>
          <Button onClick={exportQuestions} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Short Answer">Short Answer</SelectItem>
                <SelectItem value="Long Answer">Long Answer</SelectItem>
                <SelectItem value="True/False">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Questions Table */}
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions found matching your criteria</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-[300px]">
                        <p className="line-clamp-3 text-sm">{question.question_text}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {question.question_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getDifficultyColor(question.difficulty_level)}`}>
                          {getDifficultyText(question.difficulty_level)}
                        </Badge>
                      </TableCell>
                      <TableCell>{question.subjects?.name || 'N/A'}</TableCell>
                      <TableCell>{question.chapters?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(question.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
