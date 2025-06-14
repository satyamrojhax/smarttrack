
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, Copy, Share, Trash2, Download, RefreshCw } from 'lucide-react';
import { getUserBookmarks, removeBookmarkFromDatabase } from '@/services/bookmarkService';

interface BookmarkWithQuestion {
  id: string;
  question_id: string;
  created_at: string;
  questions: {
    id: string;
    question_text: string;
    question_type: string;
    difficulty_level: number;
    chapter_id: string;
  } | null;
}

export const BookmarksView = () => {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkWithQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      console.log('Loading bookmarks...');
      const data = await getUserBookmarks();
      console.log('Bookmarks loaded:', data);
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeQuestion = async (questionId: string, bookmarkId: string) => {
    try {
      console.log('Removing bookmark:', { questionId, bookmarkId });
      const result = await removeBookmarkFromDatabase(questionId);
      if (result.success) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        toast({
          title: "Removed",
          description: "Question removed from bookmarks",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive"
      });
    }
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast({
      title: "Copied!",
      description: "Question copied to clipboard",
    });
  };

  const exportAllQuestions = () => {
    if (bookmarks.length === 0) {
      toast({
        title: "No Questions",
        description: "No bookmarked questions to export",
        variant: "destructive"
      });
      return;
    }

    const questionsText = bookmarks.map((bookmark, index) => 
      `${index + 1}. ${bookmark.questions?.question_text || 'Question not found'}\n`
    ).join('\n');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarked-questions-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllBookmarks = async () => {
    try {
      // Remove all bookmarks one by one
      const promises = bookmarks.map(bookmark => 
        removeBookmarkFromDatabase(bookmark.question_id)
      );
      
      await Promise.all(promises);
      setBookmarks([]);
      
      toast({
        title: "Cleared",
        description: "All bookmarks cleared",
      });
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to clear all bookmarks",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

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
            {bookmarks.length} question{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={loadBookmarks} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {bookmarks.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={exportAllQuestions} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button variant="destructive" size="sm" onClick={clearAllBookmarks} className="w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {bookmarks.length === 0 ? (
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
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="glass-card">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {bookmark.questions?.question_type || 'Question'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Level {bookmark.questions?.difficulty_level || 1}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col lg:flex-row gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bookmark.questions && copyQuestion(bookmark.questions.question_text)}
                      className="flex-1 sm:flex-none"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bookmark.questions && navigator.share?.({ text: bookmark.questions.question_text })}
                      className="flex-1 sm:flex-none"
                    >
                      <Share className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Share</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(bookmark.question_id, bookmark.id)}
                      className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden lg:inline ml-1">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed break-words">
                  {bookmark.questions?.question_text || 'Question not found'}
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-3">
                  Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
