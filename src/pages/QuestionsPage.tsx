
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';

const QuestionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Mobile-First Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                AI Question Generator
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Generate unlimited practice questions for your studies
              </p>
            </div>
          </div>
          
          {/* Quick Stats - Mobile Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-600">AI Powered</p>
                  <p className="text-lg font-bold text-purple-700">Smart</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-600">Questions</p>
                  <p className="text-lg font-bold text-blue-700">Unlimited</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <div>
                  <p className="text-xs font-medium text-green-600">Subjects</p>
                  <p className="text-lg font-bold text-green-700">All CBSE</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-600 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-xs font-medium text-orange-600">Mode</p>
                  <p className="text-lg font-bold text-orange-700">Practice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Question Generator - Mobile Optimized */}
        <div className="w-full">
          <QuestionGenerator />
        </div>

        {/* Mobile Tips Section */}
        <div className="mt-8 lg:hidden">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Select subject and chapter for targeted practice</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Choose difficulty level to match your preparation</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Generate multiple questions for comprehensive practice</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Bookmark important questions for revision</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
