
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Wand2, History, BookOpen, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Question Generator
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                  Generate unlimited practice questions tailored for your studies
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/prompt-questions')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate with Custom Prompts
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/history')}
                className="px-6 py-3 rounded-xl border-2 hover:bg-accent/50 transition-all duration-300"
              >
                <History className="w-5 h-5 mr-2" />
                View Question History
              </Button>
            </div>
          </div>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">AI Powered</p>
                  <p className="text-xl font-bold text-purple-700">Smart</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Questions</p>
                  <p className="text-xl font-bold text-blue-700">Unlimited</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">Subjects</p>
                  <p className="text-xl font-bold text-green-700">All CBSE</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-orange-600 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-orange-600">Mode</p>
                  <p className="text-xl font-bold text-orange-700">Practice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Question Generator */}
        <div className="w-full">
          <QuestionGenerator />
        </div>

        {/* Enhanced Tips Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Pro Tips for Better Learning
              </CardTitle>
              <CardDescription className="text-base">
                Maximize your study efficiency with these expert recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-primary">Question Generation Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Select specific chapters for targeted practice instead of entire subjects</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Start with easy difficulty and gradually increase to build confidence</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Mix different question types (MCQ, Short Answer, Long Answer) for comprehensive preparation</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-primary">Study Strategy</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Practice regularly with 10-15 questions per session for better retention</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Use the quiz mode to simulate exam conditions and track your progress</p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">Review explanations carefully to understand concepts, not just memorize answers</p>
                    </div>
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
