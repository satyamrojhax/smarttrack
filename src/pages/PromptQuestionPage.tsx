
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Copy, Eye, EyeOff, Wand2, Save } from 'lucide-react';
import { saveQuestionToDatabase } from '@/services/questionResponseService';

interface GeneratedQuestion {
  id: string;
  question: string;
  answer: string;
  type: string;
  difficulty: string;
  options?: string[];
  correctAnswer?: number;
}

const PromptQuestionPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Set<string>>(new Set());
  const [savingQuestions, setSavingQuestions] = useState(false);
  const { toast } = useToast();

  const generateQuestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a prompt to generate questions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const enhancedPrompt = `
        Based on this prompt: "${prompt}"
        
        Generate 5 diverse educational questions. For each question, provide:
        1. The question text
        2. The question type (MCQ, Short Answer, Long Answer, or True/False)
        3. Difficulty level (easy, medium, or hard)
        4. If MCQ: provide 4 options and indicate the correct answer
        5. A detailed explanation/answer
        
        Format your response as:
        
        Question 1:
        Type: [question type]
        Difficulty: [difficulty level]
        Question: [question text]
        Options (if MCQ): A) option1 B) option2 C) option3 D) option4
        Correct Answer: [answer]
        Explanation: [detailed explanation]
        
        Continue this format for all 5 questions.
      `;

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
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      const questions = parseGeneratedQuestions(generatedText);
      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions Generated! ✨",
        description: `Created ${questions.length} questions from your prompt`,
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to create questions right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseGeneratedQuestions = (text: string): GeneratedQuestion[] => {
    const questions: GeneratedQuestion[] = [];
    const questionBlocks = text.split(/Question \d+:/).filter(block => block.trim());

    questionBlocks.forEach((block, index) => {
      const lines = block.split('\n').filter(line => line.trim());
      let type = 'Short Answer';
      let difficulty = 'medium';
      let question = '';
      let answer = '';
      let options: string[] = [];
      let correctAnswer: number | undefined;

      lines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('Type:')) {
          type = cleanLine.replace('Type:', '').trim();
        } else if (cleanLine.startsWith('Difficulty:')) {
          difficulty = cleanLine.replace('Difficulty:', '').trim();
        } else if (cleanLine.startsWith('Question:')) {
          question = cleanLine.replace('Question:', '').trim();
        } else if (cleanLine.startsWith('Options')) {
          const optionMatch = cleanLine.match(/A\)(.*?)B\)(.*?)C\)(.*?)D\)(.*)/);
          if (optionMatch) {
            options = [
              optionMatch[1].trim(),
              optionMatch[2].trim(),
              optionMatch[3].trim(),
              optionMatch[4].trim()
            ];
          }
        } else if (cleanLine.startsWith('Correct Answer:')) {
          const answerText = cleanLine.replace('Correct Answer:', '').trim();
          if (type === 'MCQ' && answerText.match(/^[A-D]/)) {
            correctAnswer = answerText.charCodeAt(0) - 65;
          }
          answer = answerText;
        } else if (cleanLine.startsWith('Explanation:')) {
          answer = cleanLine.replace('Explanation:', '').trim();
        }
      });

      if (question) {
        questions.push({
          id: `prompt-q-${index}-${Date.now()}`,
          question,
          answer,
          type,
          difficulty,
          options: options.length > 0 ? options : undefined,
          correctAnswer
        });
      }
    });

    return questions;
  };

  const saveAllQuestions = async () => {
    setSavingQuestions(true);
    try {
      let savedCount = 0;
      let errorCount = 0;
      
      for (const question of generatedQuestions) {
        try {
          const difficultyNum = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3;
          
          const result = await saveQuestionToDatabase(
            question.question,
            question.type,
            difficultyNum,
            question.answer,
            question.options,
            question.answer
          );

          if (result.success) {
            savedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Error saving individual question:', error);
          errorCount++;
        }
      }

      if (savedCount > 0) {
        toast({
          title: "Questions Saved! 💾",
          description: `Successfully saved ${savedCount} questions to history${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Unable to save questions. Please try again.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error saving questions:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save questions to database",
        variant: "destructive"
      });
    } finally {
      setSavingQuestions(false);
    }
  };

  const toggleSolutionVisibility = (questionId: string) => {
    setVisibleSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
    toast({
      title: "Copied! 📋",
      description: "Question copied to clipboard",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Prompt Question Generator
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Generate custom questions using AI prompts
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Enter Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your prompt here... For example: Generate questions about photosynthesis for Class 10 students, or Create math word problems about algebra..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-base"
            />
            <Button
              onClick={generateQuestions}
              disabled={isLoading || !prompt.trim()}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Questions...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Questions</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  🎯 Generated Questions
                  <Badge variant="secondary">{generatedQuestions.length} questions</Badge>
                </CardTitle>
                <Button
                  onClick={saveAllQuestions}
                  disabled={savingQuestions}
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  {savingQuestions ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save All to History</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Question {index + 1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.type}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQuestion(question.question)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg font-medium">{question.question}</p>

                    {question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <Badge variant="outline" className="w-6 h-6 rounded-full text-xs">
                              {String.fromCharCode(65 + optIndex)}
                            </Badge>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSolutionVisibility(question.id)}
                      >
                        {visibleSolutions.has(question.id) ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Solution
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show Solution
                          </>
                        )}
                      </Button>
                    </div>

                    {visibleSolutions.has(question.id) && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Solution:</h4>
                        <p className="text-blue-700 dark:text-blue-300">{question.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PromptQuestionPage;
