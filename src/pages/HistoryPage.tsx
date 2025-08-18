import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History, MessageCircle, HelpCircle, Clock, ChevronRight, Bot, User, FileText, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DoubtHistory {
  id: string;
  subject: string;
  question: string;
  status: string;
  created_at: string;
}

interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messageCount: number;
}

interface ChatMessage {
  id: string;
  response_text: string;
  is_ai_response: boolean;
  created_at: string;
}

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

const HistoryPage: React.FC = () => {
  const [doubts, setDoubts] = useState<DoubtHistory[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'questions'>('chats');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAllHistory();
    }
  }, [user]);

  const fetchAllHistory = async () => {
    await Promise.all([
      fetchDoubtHistory(),
      fetchChatHistory(),
      fetchGeneratedQuestions()
    ]);
    setLoading(false);
  };

  const fetchDoubtHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doubts')
        .select(`
          id, 
          title, 
          description, 
          status, 
          created_at,
          subjects_old(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doubt history:', error);
      } else {
        const transformedDoubts = (data || []).map(doubt => ({
          id: doubt.id,
          subject: (doubt as any).subjects_old?.name || 'Unknown Subject',
          question: doubt.title,
          status: doubt.status || 'open',
          created_at: doubt.created_at
        }));
        setDoubts(transformedDoubts);
      }
    } catch (error) {
      console.error('Error fetching doubt history:', error);
    }
  };

  const fetchChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doubt_conversations')
        .select(`
          id,
          title,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat history:', error);
      } else {
        const conversationsWithCount = await Promise.all(
          (data || []).map(async (conv) => {
            const { count } = await supabase
              .from('doubt_responses')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id);
            
            return {
              ...conv,
              messageCount: count || 0
            };
          })
        );
        
        setConversations(conversationsWithCount);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchGeneratedQuestions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_generated_questions')
        .select(`
          id,
          question_text,
          question_type,
          difficulty_level,
          correct_answer,
          created_at,
          subjects_old(name),
          chapters(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching generated questions:', error);
      } else {
        const transformedQuestions = (data || []).map(q => ({
          ...q,
          subjects: (q as any).subjects_old
        }));
        setGeneratedQuestions(transformedQuestions);
      }
    } catch (error) {
      console.error('Error fetching generated questions:', error);
    }
  };

  const fetchConversationMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('doubt_responses')
        .select('id, response_text, is_ai_response, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation messages:', error);
        setMessages([]);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchConversationMessages(conversationId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuestions = generatedQuestions.filter(q =>
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoubts = doubts.filter(d =>
    d.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <History className="w-6 h-6 md:w-8 md:h-8" />
          Learning History
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          View your past conversations, doubts, and generated questions
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search your history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full border-2 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mobile-First Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {[
          { key: 'chats', label: 'Chat History', icon: MessageCircle, count: conversations.length },
          { key: 'questions', label: 'Questions', icon: FileText, count: generatedQuestions.length }
        ].map(({ key, label, icon: Icon, count }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "outline"}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              activeTab === key 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Mobile-Responsive Content */}
      <div className="space-y-4">
        {activeTab === 'chats' && (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Chat List */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  Chat Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Chats Found</h3>
                    <p className="text-muted-foreground text-sm">
                      {searchTerm ? 'No chats match your search' : 'Start a conversation to see your chat history here!'}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] md:h-[500px]">
                    <div className="space-y-3">
                      {filteredConversations.map((conversation) => (
                        <Button
                          key={conversation.id}
                          variant="ghost"
                          className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                            selectedConversation === conversation.id 
                              ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => handleConversationClick(conversation.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex-1 text-left">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {conversation.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MessageCircle className="w-3 h-3" />
                                <span>{conversation.messageCount} messages</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(conversation.updated_at).split(',')[0]}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  {selectedConversation ? 'Conversation' : 'Select a Chat'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedConversation ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Chat</h3>
                    <p className="text-muted-foreground text-sm">
                      Click on a chat from the history to view the conversation
                    </p>
                  </div>
                ) : messagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">No messages found in this conversation</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] md:h-[500px]">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start gap-3 ${
                            !message.is_ai_response ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                            !message.is_ai_response 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                          }`}>
                            {!message.is_ai_response ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className={`flex-1 max-w-[85%] ${
                            !message.is_ai_response ? 'text-right' : ''
                          }`}>
                            <div className={`inline-block p-3 rounded-2xl text-sm shadow-sm ${
                              !message.is_ai_response
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                : 'bg-white dark:bg-gray-800 border'
                            }`}>
                              <div className="whitespace-pre-wrap leading-relaxed">
                                {message.response_text}
                              </div>
                            </div>
                            <div className={`text-xs text-muted-foreground mt-1 ${
                              !message.is_ai_response ? 'text-right' : 'text-left'
                            }`}>
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'questions' && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Generated Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
                  <p className="text-muted-foreground text-sm">
                    {searchTerm ? 'No questions match your search' : 'Generate questions to see them here!'}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredQuestions.map((question) => (
                      <div key={question.id} className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                              {question.subjects?.name || 'Unknown Subject'}
                            </Badge>
                            {question.chapters?.name && (
                              <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20">
                                {question.chapters.name}
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getDifficultyColor(question.difficulty_level)}`}>
                              Level {question.difficulty_level}
                            </Badge>
                            {question.question_type && (
                              <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20">
                                {question.question_type}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium leading-relaxed line-clamp-3">
                            {question.question_text}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(question.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
