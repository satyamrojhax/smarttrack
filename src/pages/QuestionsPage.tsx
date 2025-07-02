
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Zap, Target, BookOpen, Award } from 'lucide-react';

const QuestionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Question Generator
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">
                  Generate unlimited practice questions with AI precision
                </p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-600">AI Powered</p>
                    <p className="text-xl font-bold text-purple-700">Smart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Questions</p>
                    <p className="text-xl font-bold text-blue-700">Unlimited</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Subjects</p>
                    <p className="text-xl font-bold text-green-700">All CBSE</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/20 rounded-full -translate-y-10 translate-x-10"></div>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-600">Practice</p>
                    <p className="text-xl font-bold text-orange-700">Targeted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Question Generator */}
        <div className="w-full">
          <QuestionGenerator />
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Smart Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI analyzes curriculum patterns to generate relevant questions tailored to your learning needs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Difficulty Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from easy, medium, or hard difficulty levels to match your preparation stage.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Instant Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get detailed explanations and answers immediately to enhance your understanding.
              </p>
            </CardContent>
          </Card>
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
            <CardContent className="space-y-3">
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
                  <p className="text-muted-foreground">Review explanations to deepen understanding</p>
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
