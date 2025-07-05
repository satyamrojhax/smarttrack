import React, { useState, useRef, useEffect, useCallback } from 'react';
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
      content: "Hi! 👋 I'm your specialized Class 10 CBSE Math AI tutor. I can provide detailed solutions for:\n\n🔢 **Short Answer Questions** - Quick explanations\n📝 **Long Answer Questions** - Step-by-step solutions\n🎯 **Application Problems** - Real-world math scenarios\n\nAsk me any math doubt and I'll give you the best detailed solution!",
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

  const detectQuestionType = useCallback((question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for math keywords
    const mathKeywords = ['solve', 'find', 'calculate', 'prove', 'derive', 'equation', 'formula', 'theorem', 'graph', 'polynomial', 'quadratic', 'linear', 'trigonometry', 'geometry', 'algebra', 'statistics', 'probability'];
    const isMath = mathKeywords.some(keyword => lowerQuestion.includes(keyword));
    
    // Check for application-based keywords
    const applicationKeywords = ['real life', 'daily life', 'application', 'practical', 'example', 'scenario', 'situation', 'problem', 'word problem'];
    const isApplication = applicationKeywords.some(keyword => lowerQuestion.includes(keyword));
    
    // Check for short vs long answer indicators
    const shortIndicators = ['what is', 'define', 'state', 'name', 'list', 'mention'];
    const longIndicators = ['explain', 'describe', 'solve step by step', 'detailed', 'prove', 'derive', 'show that'];
    
    const isShort = shortIndicators.some(indicator => lowerQuestion.includes(indicator));
    const isLong = longIndicators.some(indicator => lowerQuestion.includes(indicator));
    
    if (isMath && isApplication) return 'math-application';
    if (isMath && isLong) return 'math-long';
    if (isMath && isShort) return 'math-short';
    if (isMath) return 'math-general';
    if (isApplication) return 'application';
    if (isLong) return 'long-answer';
    if (isShort) return 'short-answer';
    
    return 'general';
  }, []);

  const generateEnhancedPrompt = useCallback((question: string): string => {
    const questionType = detectQuestionType(question);
    
    const basePrompt = `You are an expert Class 10 CBSE Mathematics tutor specializing in detailed explanations and step-by-step solutions.

Student Question: "${question}"

Question Type Detected: ${questionType}

`;

    switch (questionType) {
      case 'math-application':
        return basePrompt + `INSTRUCTIONS FOR APPLICATION-BASED MATH PROBLEMS:
1. **Understand the Problem:** Break down the real-world scenario
2. **Identify Given Information:** List all given data clearly
3. **Mathematical Translation:** Convert the word problem into mathematical expressions
4. **Step-by-Step Solution:** Show each calculation step with proper reasoning
5. **Formula Application:** Use relevant Class 10 CBSE formulas
6. **Final Answer:** Present the answer in context of the real-world problem
7. **Verification:** Check if the answer makes practical sense

Provide a comprehensive solution with proper mathematical notation and clear explanations.`;

      case 'math-long':
        return basePrompt + `INSTRUCTIONS FOR DETAILED MATH SOLUTIONS:
1. **Given/To Find:** Clearly state what is given and what needs to be found  
2. **Relevant Formula/Theorem:** Mention the Class 10 CBSE formula or theorem
3. **Step-by-Step Working:** Show every algebraic step and calculation
4. **Mathematical Reasoning:** Explain why each step is taken
5. **Substitution:** Show all value substitutions clearly
6. **Simplification:** Demonstrate each simplification step
7. **Final Answer:** Highlight the final result
8. **Alternative Methods:** If applicable, mention other solving approaches

Use proper mathematical symbols and provide educational explanations.`;

      case 'math-short':
        return basePrompt + `INSTRUCTIONS FOR CONCISE MATH EXPLANATIONS:
1. **Direct Answer:** Provide the key answer/definition first
2. **Essential Formula:** State the main formula used
3. **Quick Working:** Show the most important steps
4. **Key Concept:** Explain the core mathematical concept
5. **CBSE Context:** Relate to Class 10 CBSE syllabus

Keep it focused but mathematically accurate and educationally valuable.`;

      case 'math-general':
        return basePrompt + `INSTRUCTIONS FOR GENERAL MATH QUESTIONS:
1. **Problem Analysis:** Understand what type of math problem this is
2. **Approach Selection:** Choose the best solving method for Class 10 level
3. **Detailed Solution:** Provide step-by-step mathematical working
4. **Concept Explanation:** Explain the underlying mathematical concepts
5. **CBSE Relevance:** Connect to Class 10 CBSE exam patterns

Ensure the solution is appropriate for Class 10 CBSE standard.`;

      default:
        return basePrompt + `INSTRUCTIONS FOR GENERAL ACADEMIC QUESTIONS:
1. **Clear Answer:** Provide accurate information
2. **Detailed Explanation:** Give comprehensive explanation
3. **CBSE Context:** Relate to Class 10 CBSE syllabus
4. **Examples:** Include relevant examples if helpful
5. **Key Points:** Highlight important concepts to remember

Make it educational and exam-oriented for Class 10 students.`;
    }
  }, [detectQuestionType]);

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

      const enhancedPrompt = generateEnhancedPrompt(currentInput);

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
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.2
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
  }, [inputMessage, isLoading, formatAIResponse, toast, currentConversationId, messages.length, generateEnhancedPrompt]);

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
      className={`flex items-start gap-3 mb-6 ${
        message.role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        message.role === 'user' 
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
      }`}>
        {message.role === 'user' ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${
        message.role === 'user' ? 'text-right' : ''
      }`}>
        <div className={`inline-block p-4 rounded-2xl text-base break-words shadow-lg ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b">
        <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Math AI Tutor
            </h1>
            <p className="text-muted-foreground font-medium text-sm">Expert Class 10 CBSE Math Solutions</p>
          </div>
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area - Fixed height to ensure input is always visible */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
          <div className="py-4 max-w-4xl mx-auto pb-20">
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-muted-foreground">AI is solving your problem...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Fixed Input Area - Always visible at bottom */}
        <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your math question (e.g., 'Solve x² + 5x + 6 = 0' or 'Explain Pythagoras theorem')..."
                  className="min-h-[50px] max-h-[100px] resize-none text-base border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 shadow-sm focus:shadow-md transition-all duration-300 px-4 py-3 font-medium"
                  disabled={isLoading}
                  rows={1}
                  autoFocus
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/25 hover:scale-105 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
