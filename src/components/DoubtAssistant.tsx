
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Loader2, BookOpen, Brain, Sparkles } from 'lucide-react';

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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <span>AI Doubt Assistant</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg">Ask your study doubts and get instant help! 🤖📚</p>
      </div>

      <Card className="glass-card h-[70vh] sm:h-[75vh] flex flex-col">
        <CardHeader className="border-b py-3 sm:py-4">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Study Chat</span>
            <Badge variant="secondary" className="text-xs sm:text-sm">Online</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 sm:space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-3 sm:p-4 rounded-2xl text-sm sm:text-base ${
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
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 sm:p-4 rounded-2xl bg-secondary/50 border">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm sm:text-base">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-3 sm:p-4 bg-background/50">
            <div className="flex space-x-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your doubt here... (Press Enter to send)"
                className="flex-1 min-h-[40px] max-h-32 resize-none text-sm sm:text-base"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-3 sm:px-4 h-10 sm:h-auto"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">
                📚 Study Help
              </Badge>
              <Badge variant="outline" className="text-xs">
                🧮 Math Solutions
              </Badge>
              <Badge variant="outline" className="text-xs">
                🔬 Science Concepts
              </Badge>
              <Badge variant="outline" className="text-xs">
                📖 English Grammar
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
