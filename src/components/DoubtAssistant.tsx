
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Loader2, Brain, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { createConversation, saveDoubtResponseToDatabase } from '@/services/doubtService';

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
      content: "Hi! 👋 I'm your AI study companion. Ask me anything about Class 10 CBSE and I'll provide clear, concise answers!",
      role: 'assistant',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
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
      .trim();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      if (!currentConversationId && messages.length === 1) {
        try {
          const conversation = await createConversation(
            currentInput.length > 50 ? currentInput.substring(0, 50) + '...' : currentInput
          );
          setCurrentConversationId(conversation.id);
          console.log('Created conversation:', conversation.id);
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      }

      const prompt = `You are a Class 10 CBSE AI tutor. Give SHORT, DIRECT answers (max 80 words).

Question: "${currentInput}"

Rules:
- Be concise and direct
- Show key steps only for math
- Brief explanations for concepts
- No extra text or motivation
- Just the essential answer

Answer:`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

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
          }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.3
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format');
      }

      const aiResponse = formatAIResponse(data.candidates[0].content.parts[0].text);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (currentConversationId) {
        try {
          await saveDoubtResponseToDatabase(currentConversationId, currentInput, false);
          await saveDoubtResponseToDatabase(currentConversationId, aiResponse, true);
          console.log('Saved responses to conversation:', currentConversationId);
        } catch (error) {
          console.error('Error saving responses to conversation:', error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "Sorry, couldn't process that. Try again!";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please try a shorter question.";
        } else if (error.message.includes('HTTP error')) {
          errorMessage = "Network error. Please check connection.";
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

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, formatAIResponse, toast, currentConversationId, messages.length]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }, []);

  const MessageComponent = React.memo(({ message }: { message: Message }) => (
    <div
      className={`flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6 ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md border ${
        message.role === 'user' 
          ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-blue-200' 
          : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border-emerald-200'
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
        <div className={`inline-block p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-sm sm:text-base break-words shadow-md border ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-blue-200/50 border-blue-200'
            : 'bg-white dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-800/50'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed font-medium">
            {message.content}
          </div>
        </div>
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Compact Mobile Header */}
      <div className="flex-shrink-0 p-3 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-center gap-3 sm:gap-6 max-w-4xl mx-auto">
          <div className="relative">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-xl">
              <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              AI Study Assistant
            </h1>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 font-medium">Your Class 10 CBSE companion</p>
          </div>
          <div className="relative">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl sm:rounded-3xl shadow-xl">
              <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea 
          className="flex-1 px-3 sm:px-6 py-2 sm:py-4"
          ref={scrollAreaRef}
        >
          <div className="py-4 sm:py-8 max-w-5xl mx-auto">
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-md border border-emerald-200">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Compact Mobile Input Area */}
        <div className="flex-shrink-0 p-3 sm:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="max-w-5xl mx-auto">
            {/* Compact Input */}
            <div className="flex gap-2 sm:gap-4 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your study question..."
                  className="min-h-[50px] sm:min-h-[60px] max-h-[100px] sm:max-h-[140px] resize-none text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-2xl sm:rounded-3xl focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-gray-800 shadow-lg focus:shadow-xl transition-all duration-300 px-4 py-3 sm:px-6 sm:py-4 font-medium"
                  disabled={isLoading}
                  rows={1}
                  autoFocus
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl transition-all duration-300 hover:shadow-indigo-500/25 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
