
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Loader2, Menu, Brain } from 'lucide-react';
import { useConversationMessages } from '@/hooks/useConversationMessages';

interface ChatWindowProps {
  conversationId: string | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const { messages, addMessage, loading } = useConversationMessages(conversationId);
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      // Add user message
      const userMessage = {
        id: `user-${Date.now()}`,
        content: messageText,
        role: 'user' as const,
        timestamp: Date.now()
      };
      
      await addMessage(userMessage);

      // Simulate AI response (replace with actual AI service call)
      setTimeout(async () => {
        const aiMessage = {
          id: `ai-${Date.now()}`,
          content: `I understand your question: "${messageText}". Let me help you with that. This is a placeholder response for now.`,
          role: 'assistant' as const,
          timestamp: Date.now()
        };
        
        await addMessage(aiMessage);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      throw error;
    }
  }, [conversationId, addMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading || !conversationId) return;

    try {
      await sendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [inputMessage, isLoading, conversationId, sendMessage, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const MessageComponent = React.memo(({ message }: { message: any }) => (
    <div
      className={`flex items-start gap-3 ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground'
      }`}>
        {message.role === 'user' ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[85%] ${
        message.role === 'user' ? 'text-right' : ''
      }`}>
        <div className={`inline-block p-3 rounded-2xl text-sm break-words ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-secondary/50 text-secondary-foreground border'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${
          message.role === 'user' ? 'text-right' : 'text-left'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  ));

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Study Assistant</h1>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <Brain className="w-16 h-16 mx-auto text-primary opacity-50" />
            <h2 className="text-2xl font-semibold text-muted-foreground">Ready to help!</h2>
            <p className="text-muted-foreground">
              Start a new conversation to ask your study questions and get instant AI assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">AI Study Assistant</h1>
          <Badge variant="secondary" className="text-xs">Online</Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-2xl bg-secondary/50 border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-background/50 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your study question here... (Press Enter to send)"
              className="flex-1 min-h-[44px] max-h-32 resize-none text-sm"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 h-11 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">📚 Study Help</Badge>
            <Badge variant="outline" className="text-xs">🧮 Math Solutions</Badge>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">🔬 Science Concepts</Badge>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">📖 English Grammar</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
