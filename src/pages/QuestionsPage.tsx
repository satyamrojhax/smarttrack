
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  HelpCircle, 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp,
  Wand2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI Question Generator",
      description: "Generate custom questions using AI from your study topics",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      path: "/prompt-questions",
      badge: "AI Powered"
    },
    {
      title: "MCQ Quiz Mode",
      description: "Practice with multiple choice questions and instant feedback",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      path: "/mcq-quiz",
      badge: "Interactive"
    },
    {
      title: "Subject-wise Questions",
      description: "Browse questions organized by subjects and chapters",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      path: "/syllabus",
      badge: "Organized"
    },
    {
      title: "Question History",
      description: "View all your generated and attempted questions",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      path: "/history",
      badge: "Track Progress"
    }
  ];

  const stats = [
    { label: "Question Types", value: "5+", icon: HelpCircle },
    { label: "AI Models", value: "2", icon: Brain },
    { label: "Difficulty Levels", value: "3", icon: TrendingUp },
    { label: "Subjects", value: "10+", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Question Hub
              </h1>
              <p className="text-muted-foreground text-xl mt-2">
                AI-powered question generation and practice platform
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                <Button
                  onClick={() => navigate(feature.path)}
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-medium group-hover:shadow-lg transition-all duration-300"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/prompt-questions')}
                variant="outline"
                className="h-16 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
              >
                <Wand2 className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Generate with AI</span>
              </Button>
              
              <Button
                onClick={() => navigate('/mcq-quiz')}
                variant="outline"
                className="h-16 flex-col space-y-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
              >
                <Target className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Start Quiz</span>
              </Button>
              
              <Button
                onClick={() => navigate('/history')}
                variant="outline"
                className="h-16 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
              >
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">View History</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Need Help Getting Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI-powered question generation system can create personalized questions based on your study needs. 
                Simply enter a topic or prompt, and get instant questions with detailed explanations.
              </p>
              <Button
                onClick={() => navigate('/prompt-questions')}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Generator Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
