
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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center justify-center sm:justify-start space-x-2">
            <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span>Saved Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {savedQuestions.length} question{savedQuestions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {savedQuestions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
            <Button variant="outline" size="sm" onClick={exportAllQuestions} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="destructive" size="sm" onClick={clearAllBookmarks} className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {savedQuestions.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="text-center py-8 sm:py-12 px-4">
            <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Saved Questions</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Questions you bookmark will appear here for easy access
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {savedQuestions.map((question) => (
            <Card key={question.id} className="glass-card">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <CardTitle className="text-base sm:text-lg">{question.subject}</CardTitle>
                      <Badge variant="outline" className="w-fit">{question.chapter}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">{question.type}</Badge>
                      <Badge variant="outline" className="text-xs">{question.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col lg:flex-row gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(question.question)}
                      className="flex-1 sm:flex-none"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.share?.({ text: question.question })}
                      className="flex-1 sm:flex-none"
                    >
                      <Share className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Share</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed break-words">{question.question}</p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
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
