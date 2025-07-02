
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Sparkles, Zap, Star, Target, BookOpen, Users } from 'lucide-react';

const DoubtsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Header Section */}
        <div className="mb-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-6 py-3 rounded-full border border-purple-200 dark:border-purple-700">
              <div className="relative">
                <Brain className="w-8 h-8 text-purple-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Doubt Assistant
                </h1>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                  Get instant answers to your study questions
                </p>
              </div>
              <div className="relative">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-300">AI</span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Powered</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-300">24/7</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-bold text-green-700 dark:text-green-300">All</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Subjects</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="text-lg font-bold text-orange-700 dark:text-orange-300">Smart</span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Answers</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Highlight */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-muted-foreground">Instant Responses</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-muted-foreground">CBSE Class 10 Expert</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Step-by-Step Solutions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Doubt Assistant */}
        <div className="w-full">
          <DoubtAssistant />
        </div>
      </div>
    </div>
  );
};

export default DoubtsPage;
