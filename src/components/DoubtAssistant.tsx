
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Send, User, Bot, Copy, Trash2, Sparkles, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const DoubtAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hi! I'm your AI Study Assistant 🤖\n\nI'm here to help you with your Class 10 CBSE doubts in Math, Science, English, Social Science, and Hindi. Ask me anything - from concept explanations to problem-solving steps!\n\nHow can I help you today?",
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
      .trim();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const prompt = `You are a friendly and knowledgeable AI tutor specializing in Class 10 CBSE curriculum. A student has asked: "${userMessage.content}"

Please provide a helpful, clear, and encouraging response. Follow these guidelines:
- Be warm and supportive in your tone
- Break down complex concepts into simple steps
- Use examples when helpful
- For math problems, show step-by-step solutions
- For science topics, explain concepts clearly with real-world connections
- For language subjects, provide clear explanations and examples
- Include study tips when relevant
- Encourage the student and boost their confidence
- Keep responses concise but comprehensive
- Use emojis sparingly to make it friendly but professional

Remember: You're helping a Class 10 student, so adjust your language and examples accordingly.`;

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
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = formatAIResponse(data.candidates[0].content.parts[0].text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Response Ready! 🎉",
        description: "Your doubt has been answered",
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. If the problem persists, try rephrasing your question.",
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Response Failed",
        description: "Unable to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied! 📋",
      description: "Message copied to clipboard",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        content: "Hi! I'm your AI Study Assistant 🤖\n\nI'm here to help you with your Class 10 CBSE doubts in Math, Science, English, Social Science, and Hindi. Ask me anything - from concept explanations to problem-solving steps!\n\nHow can I help you today?",
        role: 'assistant',
        timestamp: Date.now()
      }
    ]);
    toast({
      title: "Chat Cleared! 🗑️",
      description: "Starting fresh conversation",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center space-x-2">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <span>AI Doubt Assistant</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">Get instant help with your CBSE Class 10 doubts</p>
        </div>

        <Card className="glass-card smooth-transition h-[calc(100vh-200px)] sm:h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Chat with AI Tutor</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  AI Powered
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className={`rounded-lg p-3 sm:p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 border shadow-sm'
                      }`}>
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                        
                        {message.role === 'assistant' && (
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    } px-10`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[80%]">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border shadow-sm rounded-lg p-3 sm:p-4">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 sm:p-6 bg-background/50">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your doubt here... (Press Enter to send)"
                  disabled={isLoading}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="px-3 sm:px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Ask about Math, Science, English, Social Science, Hindi concepts and problems
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
