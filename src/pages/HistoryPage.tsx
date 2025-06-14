
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { History, MessageSquare, Calendar, User, Bot, RefreshCw } from 'lucide-react';
import { getUserDoubts, getDoubtHistory, type Doubt, type DoubtResponse } from '@/services/doubtService';

const HistoryPage = () => {
  const { toast } = useToast();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [doubtHistory, setDoubtHistory] = useState<DoubtResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading history data...');
      const doubtsData = await getUserDoubts();
      
      console.log('History data loaded:', { doubtsData });
      setDoubts(doubtsData);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load history data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoubtHistory = async (doubtId: string) => {
    try {
      const history = await getDoubtHistory(doubtId);
      setDoubtHistory(history);
      setSelectedDoubt(doubtId);
    } catch (error) {
      console.error('Error loading doubt history:', error);
      toast({
        title: "Error",
        description: "Failed to load doubt conversation",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 mb-2">
            <History className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <span>Learning History</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground px-2">
            Track your doubts and conversations
          </p>
        </div>

        {/* Refresh Button - Mobile */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistoryData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Content - Mobile First Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Panel - Doubts List */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <MessageSquare className="w-5 h-5" />
                Your Doubts ({doubts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] lg:h-[500px]">
                <div className="space-y-2 p-4">
                  {doubts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No doubts asked yet</p>
                    </div>
                  ) : (
                    doubts.map((doubt) => (
                      <Card 
                        key={doubt.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedDoubt === doubt.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => loadDoubtHistory(doubt.id)}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{doubt.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {doubt.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant={doubt.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                              {doubt.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(doubt.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Panel - Conversation Details */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <MessageSquare className="w-5 h-5" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedDoubt && doubtHistory.length > 0 ? (
                <ScrollArea className="h-[400px] lg:h-[500px]">
                  <div className="space-y-3 p-4">
                    {doubtHistory.map((response) => (
                      <div
                        key={response.id}
                        className={`flex items-start gap-3 ${
                          response.is_ai_response ? '' : 'flex-row-reverse'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          response.is_ai_response 
                            ? 'bg-secondary text-secondary-foreground' 
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {response.is_ai_response ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                          response.is_ai_response ? '' : 'text-right'
                        }`}>
                          <div className={`inline-block p-3 rounded-2xl text-sm break-words ${
                            response.is_ai_response
                              ? 'bg-secondary/50 text-secondary-foreground border'
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {response.response_text}
                            </div>
                          </div>
                          <div className={`text-xs text-muted-foreground mt-1 ${
                            response.is_ai_response ? 'text-left' : 'text-right'
                          }`}>
                            {new Date(response.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[400px] lg:h-[500px] text-muted-foreground p-4">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a doubt to view conversation</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
