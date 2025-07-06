
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BookOpen, Target, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuestionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Mobile-First Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
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
            
            {/* Quick Actions */}
            <div className="hidden md:flex space-x-2">
              <Link to="/prompt-questions">
                <Button variant="outline" className="bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-pink-200">
                  <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                  AI Prompts
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200">
                  <Clock className="w-4 h-4 mr-2 text-amber-500" />
                  History
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats - Mobile Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-purple-600">AI Powered</p>
                  <p className="text-lg font-bold text-purple-700">Smart</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-600">Questions</p>
                  <p className="text-lg font-bold text-blue-700">Unlimited</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-600">Subjects</p>
                  <p className="text-lg font-bold text-green-700">All CBSE</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-orange-600">Mode</p>
                  <p className="text-lg font-bold text-orange-700">Practice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Navigation Cards - Mobile */}
        <div className="md:hidden mb-6 grid grid-cols-2 gap-3">
          <Link to="/prompt-questions">
            <Card className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="text-sm font-semibold text-pink-700">AI Prompts</p>
                  <p className="text-xs text-pink-600">Custom Questions</p>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-500 ml-auto" />
              </div>
            </Card>
          </Link>
          
          <Link to="/history">
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-700">History</p>
                  <p className="text-xs text-amber-600">Past Questions</p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-500 ml-auto" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Main Question Generator - Enhanced */}
        <div className="w-full">
          <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Question Generator Hub
                  </CardTitle>
                  <CardDescription className="text-base">
                    Select subject, chapter, and difficulty to generate practice questions
                  </CardDescription>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-xl">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <QuestionGenerator />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tips Section */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tips for Better Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400">Smart Selection</h4>
                    <p className="text-muted-foreground">Choose specific chapters for targeted practice and better results</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400">Difficulty Levels</h4>
                    <p className="text-muted-foreground">Start easy and gradually increase difficulty to build confidence</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400">Regular Practice</h4>
                    <p className="text-muted-foreground">Generate multiple questions daily for comprehensive preparation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-orange-700 dark:text-orange-400">Save Progress</h4>
                    <p className="text-muted-foreground">Important questions are automatically saved to your history</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-pink-700 dark:text-pink-400">AI Prompts</h4>
                    <p className="text-muted-foreground">Use custom prompts for personalized question generation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-indigo-700 dark:text-indigo-400">Track Performance</h4>
                    <p className="text-muted-foreground">Review your question history to identify improvement areas</p>
                  </div>
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
