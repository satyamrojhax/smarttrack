
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Loader2, Menu, Brain } from 'lucide-react';
import { useConversationMessages } from '@/hooks/useConversationMessages';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

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
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, addMessage, loading: messagesLoading } = useConversationMessages(conversationId);

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

  const formatAIResponse = useCallback((text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '');
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading || !conversationId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      role: 'user',
      timestamp: Date.now()
    };

    addMessage(userMessage);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = `You are an AI tutor for Class 10 CBSE students. Give SHORT, DIRECT answers only.

Student's question: "${currentInput}"

IMPORTANT RULES:
- Keep answers under 100 words
- Be direct and to the point
- Only answer what was asked
- For math problems: show just the key steps
- For concepts: give brief explanations only
- No extra motivational content
- No long introductions or conclusions
- Just the answer they need

Answer briefly:`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from AI');
      }

      const aiResponse = formatAIResponse(data.candidates[0].content.parts[0].text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: Date.now()
      };

      addMessage(assistantMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "Sorry, couldn't process that. Try again!";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please try again with a shorter question.";
        } else if (error.message.includes('HTTP error')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        content: errorMessage,
        role: 'assistant',
        timestamp: Date.now()
      };

      addMessage(errorResponse);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, conversationId, addMessage, formatAIResponse, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
          <p className="text-muted-foreground text-sm">Select a conversation or start a new chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 h-auto"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="font-semibold text-sm sm:text-base">AI Study Assistant</h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && !messagesLoading && (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Welcome to AI Study Assistant!</h3>
              <p className="text-muted-foreground text-sm sm:text-base px-4">Ask me any Class 10 CBSE questions and I'll give you clear, short answers! 📚</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 sm:gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                message.role === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-2 sm:p-3 rounded-2xl text-sm sm:text-base ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
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
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-2 sm:p-3 rounded-2xl bg-secondary/50 border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-3 sm:p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your doubt here... (Press Enter to send)"
              className="flex-1 min-h-[40px] max-h-32 resize-none text-sm sm:text-base"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-3 sm:px-4 h-10 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
