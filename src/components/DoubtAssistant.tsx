
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Loader2, BookOpen, Brain } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const DoubtAssistant = () => {
  const { subjects } = useSyllabus();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI study assistant. Ask me any Class 10 CBSE questions and I'll give you clear, short answers! 📚",
      role: 'assistant',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatAIResponse = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = `You are an AI tutor for Class 10 CBSE students. Give SHORT, DIRECT answers only.

Student's question: "${inputMessage}"

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
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = formatAIResponse(data.candidates[0].content.parts[0].text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Couldn't process your question. Try again!",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, couldn't process that. Try again!",
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
          <span>AI Doubt Assistant</span>
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Ask your study doubts and get instant help! 🤖📚</p>
      </div>

      {/* Chat Container */}
      <Card className="glass-card flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b py-2 sm:py-3 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Study Chat</span>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-2 sm:px-4" ref={scrollAreaRef}>
            <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 sm:gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
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
                  
                  <div className={`flex-1 max-w-[80%] sm:max-w-[75%] ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-2 sm:p-3 md:p-4 rounded-2xl text-xs sm:text-sm md:text-base ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-secondary-foreground border'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed break-words">
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
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-2 sm:p-3 md:p-4 rounded-2xl bg-secondary/50 border">
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
          <div className="border-t p-2 sm:p-3 md:p-4 bg-background/50 flex-shrink-0">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your doubt here... (Press Enter to send)"
                className="flex-1 min-h-[36px] sm:min-h-[40px] max-h-24 sm:max-h-32 resize-none text-xs sm:text-sm md:text-base"
                disabled={isLoading}
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-2 sm:px-3 md:px-4 h-9 sm:h-10 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">
                📚 Study Help
              </Badge>
              <Badge variant="outline" className="text-xs">
                🧮 Math Solutions
              </Badge>
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                🔬 Science Concepts
              </Badge>
              <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                📖 English Grammar
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
