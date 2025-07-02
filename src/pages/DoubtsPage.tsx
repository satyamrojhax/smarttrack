
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageSquare, Brain, Zap } from 'lucide-react';

const DoubtsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-6 space-y-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Doubt Assistant
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">
                  Get instant answers to your academic questions
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-700">24/7 Available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-700">AI Powered</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">Instant Help</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="w-full">
          <Card className="shadow-xl border-0 bg-background/95 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100vh-16rem)] sm:h-[calc(100vh-18rem)] w-full">
                <DoubtAssistant />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoubtsPage;
