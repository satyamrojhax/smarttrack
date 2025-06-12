
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Copy, Share, Trash2, Download } from 'lucide-react';

interface SavedQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  subject: string;
  chapter: string;
  timestamp: number;
}

export const BookmarksView = () => {
  const { toast } = useToast();
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]');
    setSavedQuestions(saved);
  }, []);

  const removeQuestion = (questionId: string) => {
    const updated = savedQuestions.filter(q => q.id !== questionId);
    setSavedQuestions(updated);
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(updated));
    
    toast({
      title: "Removed",
      description: "Question removed from bookmarks",
    });
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast({
      title: "Copied!",
      description: "Question copied to clipboard",
    });
  };

  const exportAllQuestions = () => {
    if (savedQuestions.length === 0) {
      toast({
        title: "No Questions",
        description: "No bookmarked questions to export",
        variant: "destructive"
      });
      return;
    }

    const questionsText = savedQuestions.map((q, index) => 
      `${index + 1}. [${q.subject} - ${q.chapter}] (${q.type}, ${q.difficulty})\n${q.question}\n`
    ).join('\n');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarked-questions-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllBookmarks = () => {
    setSavedQuestions([]);
    localStorage.removeItem('bookmarkedQuestions');
    
    toast({
      title: "Cleared",
      description: "All bookmarks cleared",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Bookmark className="w-6 h-6 text-primary" />
            <span>Saved Questions</span>
          </h2>
          <p className="text-muted-foreground">
            {savedQuestions.length} question{savedQuestions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {savedQuestions.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportAllQuestions}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="destructive" size="sm" onClick={clearAllBookmarks}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {savedQuestions.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Saved Questions</h3>
            <p className="text-muted-foreground">
              Questions you bookmark will appear here for easy access
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedQuestions.map((question) => (
            <Card key={question.id} className="glass-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{question.subject}</CardTitle>
                      <Badge variant="outline">{question.chapter}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">{question.type}</Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                    </div>
                  </div>
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
                      onClick={() => navigator.share?.({ text: question.question })}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{question.question}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Saved on {new Date(question.timestamp).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
