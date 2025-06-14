
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSyllabus } from '@/contexts/SyllabusContext';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  MessageCircleQuestion, 
  TrendingUp, 
  Target,
  Clock,
  Trophy,
  ChevronRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const { subjects, getOverallProgress } = useSyllabus();

  const overallProgress = getOverallProgress();

  const quickActions = [
    {
      title: 'Track Syllabus',
      description: 'Monitor your chapter completion progress',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      href: '/syllabus'
    },
    {
      title: 'Ask Doubts',
      description: 'Get instant help with AI-powered doubt resolution',
      icon: MessageCircleQuestion,
      color: 'from-purple-500 to-purple-600',
      href: '/doubts'
    },
    {
      title: 'Predict Marks',
      description: 'Estimate your exam performance based on progress',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      href: '/predictor'
    }
  ];

  const recentSubjects = subjects.slice(0, 3);

  return (
    <MainLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Ready to continue your CBSE Class 10 journey? Let's make today productive!
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
                <Badge variant={overallProgress >= 70 ? "default" : overallProgress >= 40 ? "secondary" : "outline"}>
                  {overallProgress >= 70 ? "Excellent" : overallProgress >= 40 ? "Good" : "Keep Going"}
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You've completed {overallProgress}% of your syllabus. {overallProgress >= 70 ? "Amazing work!" : "Keep it up!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <div className="flex items-center text-primary text-sm font-medium">
                          Get Started
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Subjects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Subjects</h2>
            <Link to="/syllabus">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSubjects.map((subject) => {
              const completedChapters = subject.chapters.filter(ch => ch.completed).length;
              const totalChapters = subject.chapters.length;
              const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

              return (
                <Card key={subject.id} className="transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center text-white text-lg`}>
                          {subject.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {completedChapters}/{totalChapters} chapters
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Motivational Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Keep Up the Great Work! 🌟
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  Consistency is key to success. Every chapter completed brings you closer to your goals. 
                  {overallProgress >= 50 ? " You're doing amazing!" : " You've got this!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
