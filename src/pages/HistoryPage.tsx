
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { History, MessageSquare, Brain, Calendar, User, Bot, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { getUserDoubts, getDoubtHistory, type Doubt, type DoubtResponse } from '@/services/doubtService';
import { getUserQuestionHistory, type QuestionHistory } from '@/services/questionHistoryService';
import { getUserQuestionResponses, type QuestionResponse } from '@/services/questionResponseService';

const HistoryPage = () => {
  const { toast } = useToast();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  const [questionResponses, setQuestionResponses] = useState<QuestionResponse[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [doubtHistory, setDoubtHistory] = useState<DoubtResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'doubts' | 'questions' | 'responses'>('doubts');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true);
      console.log('Loading history data...');
      
      const [doubtsData, questionsData, responsesData] = await Promise.all([
        getUserDoubts(),
        getUserQuestionHistory(),
        getUserQuestionResponses()
      ]);
      
      console.log('History data loaded:', { doubtsData, questionsData, responsesData });
      console.log('Doubts count:', doubtsData?.length || 0);
      console.log('Questions count:', questionsData?.length || 0);
      console.log('Responses count:', responsesData?.length || 0);
      
      setDoubts(doubtsData || []);
      setQuestionHistory(questionsData || []);
      setQuestionResponses(responsesData || []);
      
      if (doubtsData?.length === 0 && questionsData?.length === 0 && responsesData?.length === 0) {
        toast({
          title: "No Data Found",
          description: "No learning history found. Start asking questions or generating practice questions to see your progress here.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load history data. Please check your authentication and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your learning history...</p>
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
            Track your doubts, conversations, and question attempts
          </p>
        </div>

        {/* Refresh Button - Mobile */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistoryData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{doubts.length}</p>
              <p className="text-sm text-muted-foreground">Doubts Asked</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{questionHistory.length}</p>
              <p className="text-sm text-muted-foreground">Questions Attempted</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{questionResponses.length}</p>
              <p className="text-sm text-muted-foreground">Responses Saved</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-center mb-6">
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 p-1 bg-muted rounded-lg w-full sm:w-fit">
            <Button
              variant={activeTab === 'doubts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('doubts')}
              className="flex items-center gap-2 justify-center w-full sm:w-auto text-xs sm:text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Doubts ({doubts.length})
            </Button>
            <Button
              variant={activeTab === 'questions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('questions')}
              className="flex items-center gap-2 justify-center w-full sm:w-auto text-xs sm:text-sm"
            >
              <Brain className="w-4 h-4" />
              Questions ({questionHistory.length})
            </Button>
            <Button
              variant={activeTab === 'responses' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('responses')}
              className="flex items-center gap-2 justify-center w-full sm:w-auto text-xs sm:text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Responses ({questionResponses.length})
            </Button>
          </div>
        </div>

        {/* Content - Mobile First Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Panel - List */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                {activeTab === 'doubts' ? (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Your Doubts
                  </>
                ) : activeTab === 'questions' ? (
                  <>
                    <Brain className="w-5 h-5" />
                    Question History
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Question Responses
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] lg:h-[500px]">
                <div className="space-y-2 p-4">
                  {activeTab === 'doubts' ? (
                    doubts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No doubts asked yet</p>
                        <p className="text-xs mt-1">Visit the Doubts page to start asking questions</p>
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
                    )
                  ) : activeTab === 'questions' ? (
                    questionHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No questions attempted yet</p>
                        <p className="text-xs mt-1">Visit the Questions page to start practicing</p>
                      </div>
                    ) : (
                      questionHistory.map((question) => (
                        <Card key={question.id} className="hover:bg-muted/50">
                          <CardContent className="p-3">
                            <p className="text-sm mb-2 line-clamp-2">{question.question_text}</p>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {question.question_type || 'Question'}
                              </Badge>
                              {question.difficulty_level && (
                                <Badge variant="secondary" className="text-xs">
                                  Level {question.difficulty_level}
                                </Badge>
                              )}
                              {question.is_correct !== null && (
                                <div className="flex items-center gap-1">
                                  {question.is_correct ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              {question.time_taken && (
                                <span>Time: {question.time_taken}s</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(question.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {question.user_answer && (
                              <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                                <span className="font-medium">Your answer: </span>
                                <span className="text-muted-foreground">{question.user_answer}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )
                  ) : (
                    questionResponses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No question responses yet</p>
                        <p className="text-xs mt-1">Generate and answer questions to see responses here</p>
                      </div>
                    ) : (
                      questionResponses.map((response) => (
                        <Card key={response.id} className="hover:bg-muted/50">
                          <CardContent className="p-3">
                            <p className="text-sm mb-2 line-clamp-2">{response.generated_question_text}</p>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {response.user_response && (
                                <Badge variant="outline" className="text-xs">
                                  Answered
                                </Badge>
                              )}
                              {response.is_correct !== null && (
                                <div className="flex items-center gap-1">
                                  {response.is_correct ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              {response.response_time && (
                                <span>Time: {response.response_time}s</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(response.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {response.user_response && (
                              <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                                <span className="font-medium">Your answer: </span>
                                <span className="text-muted-foreground">{response.user_response}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right Panel - Details */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                {activeTab === 'doubts' ? (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Conversation History
                  </>
                ) : activeTab === 'questions' ? (
                  <>
                    <Brain className="w-5 h-5" />
                    Question Details
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Response Details
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activeTab === 'doubts' && selectedDoubt && doubtHistory.length > 0 ? (
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
                    {activeTab === 'doubts' ? (
                      <>
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select a doubt to view conversation</p>
                      </>
                    ) : activeTab === 'questions' ? (
                      <>
                        <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Question details will appear here</p>
                        <p className="text-xs mt-1">Practice more questions to see detailed history</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Response details will appear here</p>
                        <p className="text-xs mt-1">Answer questions to see detailed responses</p>
                      </>
                    )}
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
