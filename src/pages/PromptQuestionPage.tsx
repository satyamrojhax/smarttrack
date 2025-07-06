
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Brain, Sparkles, Send, Loader2 } from 'lucide-react';
import { saveUserQuestionResponse } from '@/services/questionResponseService';

const PromptQuestionPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateQuestion = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a prompt to generate a question.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDi1wHRLfS2-g4adHzuVfZRzmI4tRrzH-U`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a detailed educational question based on this prompt: "${prompt}". 

Please create:
1. A clear, well-structured question
2. Multiple choice options (A, B, C, D) if applicable
3. The correct answer
4. A brief explanation

Format the response in a clear, educational manner suitable for Class 10 students.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      setGeneratedQuestion(generatedText);
      
      toast({
        title: "Question Generated! ✨",
        description: "Your AI-generated question is ready.",
      });
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToHistory = async () => {
    if (!generatedQuestion) {
      toast({
        title: "No Question to Save",
        description: "Please generate a question first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveUserQuestionResponse({
        question_text: generatedQuestion,
        question_type: 'ai_generated',
        difficulty_level: 2,
        explanation: `Generated from prompt: ${prompt}`,
      });

      if (result.success) {
        toast({
          title: "Saved to History! 📚",
          description: "Question has been saved to your history page.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save question to history. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save question to history.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearAll = () => {
    setPrompt('');
    setGeneratedQuestion('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                AI Question Generator
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Generate custom questions using AI prompts
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Enter Your Prompt
              </CardTitle>
              <CardDescription>
                Describe what kind of question you'd like to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Question Topic/Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Example: Generate a question about photosynthesis for Class 10 science students, focusing on the light-dependent reactions..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={generateQuestion}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate Question
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={clearAll}
                  variant="outline"
                  disabled={isGenerating}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Generated Question
              </CardTitle>
              <CardDescription>
                Your AI-generated question will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedQuestion ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-sm">
                      {generatedQuestion}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={saveToHistory}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save to History'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Enter a prompt and click "Generate Question" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">💡 Tips for Better Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Good Prompts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Be specific about the subject and chapter</li>
                  <li>• Mention the difficulty level (easy/medium/hard)</li>
                  <li>• Include the type of question (MCQ, short answer, etc.)</li>
                  <li>• Specify learning objectives or concepts to focus on</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Example Prompts:</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• "Create a medium-level MCQ about the periodic table for Class 10"</li>
                  <li>• "Generate a question on quadratic equations with real-life application"</li>
                  <li>• "Make a short answer question about democratic rights in India"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptQuestionPage;
