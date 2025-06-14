
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History, MessageCircle, HelpCircle, Clock, ChevronRight, Bot, User } from 'lucide-react';

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

const HistoryPage: React.FC = () => {
  const [doubts, setDoubts] = useState<DoubtHistory[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDoubtHistory();
      fetchChatHistory();
    }
  }, [user]);

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
          subjects(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doubt history:', error);
      } else {
        // Transform the data to match our interface
        const transformedDoubts = (data || []).map(doubt => ({
          id: doubt.id,
          subject: doubt.subjects?.name || 'Unknown Subject',
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
        // For each conversation, count the messages
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
    } finally {
      setLoading(false);
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
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
          <History className="w-8 h-8" />
          Chat & Doubt History
        </h1>
        <p className="text-muted-foreground">
          View your past conversations and doubt submissions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chat History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Chats Yet</h3>
                <p className="text-muted-foreground">
                  Start a conversation to see your chat history here!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                        selectedConversation === conversation.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {conversation.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {conversation.messageCount} messages
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(conversation.updated_at)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {selectedConversation ? 'Conversation Messages' : 'Select a Chat'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedConversation ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Chat</h3>
                <p className="text-muted-foreground">
                  Click on a chat from the history to view the conversation
                </p>
              </div>
            ) : messagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading messages...</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        !message.is_ai_response ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        !message.is_ai_response 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {!message.is_ai_response ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${
                        !message.is_ai_response ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block p-3 rounded-lg text-sm ${
                          !message.is_ai_response
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 border'
                        }`}>
                          <div className="whitespace-pre-wrap">
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

      {/* Doubt History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Doubt History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doubts.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Doubts Yet</h3>
              <p className="text-muted-foreground">
                Start asking questions to see your doubt history here!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {doubts.map((doubt, index) => (
                  <div key={doubt.id}>
                    <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {doubt.subject}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(doubt.status)}`}>
                            {doubt.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {doubt.question}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(doubt.created_at)}
                        </div>
                      </div>
                    </div>
                    {index < doubts.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
