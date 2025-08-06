
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Users } from 'lucide-react';
import { sendCommunityMessage, getCommunityMessages, CommunityMessage } from '@/services/communityService';
import { supabase } from '@/integrations/supabase/client';

export const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('community_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as CommunityMessage;
          setMessages(prev => [newMessage, ...prev]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getCommunityMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const result = await sendCommunityMessage(newMessage);
      
      if (result.success) {
        setNewMessage('');
        toast({
          title: "Message Sent! 📤",
          description: "Your message has been shared with the community",
        });
      } else {
        toast({
          title: "Failed to Send",
          description: result.error || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            <span>Community Chat</span>
            <span className="text-sm text-muted-foreground ml-2">
              ({messages.length} messages)
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea 
            ref={scrollAreaRef}
            className="flex-1 px-4 max-h-[calc(100vh-200px)]"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                {messages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {getUserInitials(message.user_id)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          User {message.user_id.substring(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm bg-muted p-2 rounded-lg">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="border-t p-4 bg-background">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isSending}
                maxLength={500}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                size="sm"
                className="px-3"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {newMessage.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {newMessage.length}/500 characters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
