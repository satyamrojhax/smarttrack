
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, BookOpen, Target, Users, Sparkles, ArrowRight, TrendingUp, Award, Star, History, Play, MessageSquare, Trophy, Zap, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { subjects, getOverallProgress } = useSyllabus();
  const { profile } = useAuth();
  const overallProgress = getOverallProgress();

  const totalChapters = subjects.reduce((total, subject) => total + subject.chapters.length, 0);
  const completedChapters = subjects.reduce(
    (total, subject) => total + subject.chapters.filter(chapter => chapter.completed).length,
    0
  );

  const recentlyStudied = subjects
    .flatMap(subject => 
      subject.chapters
        .filter(chapter => chapter.completed)
        .map(chapter => ({ ...chapter, subject: subject.name, icon: subject.icon }))
    )
    .slice(-3);

  const quickActions = [
    {
      title: 'Practice Questions',
      description: 'Generate PYQ-style questions',
      icon: Brain,
      href: '/questions',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'MCQ Quiz',
      description: 'Take timed MCQ tests',
      icon: Play,
      href: '/mcq-quiz',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'AI Doubt Solver',
      description: 'Get instant solutions',
      icon: MessageSquare,
      href: '/doubts',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your syllabus',
      icon: BookOpen,
      href: '/syllabus',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Marks Predictor',
      description: 'Predict your scores',
      icon: Target,
      href: '/predictor',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Smart question generation based on CBSE patterns and PYQs',
      color: 'from-purple-400 to-pink-600',
      stats: 'Unlimited Questions'
    },
    {
      icon: Trophy,
      title: 'Exam-Ready Practice',
      description: 'MCQ quizzes with timer and detailed explanations',
      color: 'from-green-400 to-emerald-600',
      stats: 'Timed Tests'
    },
    {
      icon: Target,
      title: 'Smart Analytics',
      description: 'Track progress and predict performance with AI insights',
      color: 'from-blue-400 to-indigo-600',
      stats: 'Performance Tracking'
    },
    {
      icon: Sparkles,
      title: 'Instant Solutions',
      description: 'Get step-by-step solutions for all your doubts',
      color: 'from-orange-400 to-red-600',
      stats: '24/7 AI Support'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:ml-64 space-y-8 scroll-smooth">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8 md:p-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
            <GraduationCap className="w-4 h-4" />
            <span className="font-medium">Welcome back, {profile?.name}!</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Master CBSE Class 10
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              With AI Power
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Generate unlimited practice questions, take MCQ quizzes, and get instant doubt solutions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link to="/questions">
              <Button size="lg" className="px-8 py-6 text-lg bg-white text-purple-600 hover:bg-white/90 font-semibold">
                <Brain className="w-5 h-5 mr-2" />
                Generate Questions
              </Button>
            </Link>
            <Link to="/mcq-quiz">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-white/30 text-white hover:bg-white/10 font-semibold">
                <Play className="w-5 h-5 mr-2" />
                Take MCQ Quiz
              </Button>
            </Link>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
              <div className="text-3xl font-bold mb-1">{overallProgress}%</div>
              <div className="text-sm text-white/80">Progress</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
              <div className="text-3xl font-bold mb-1">{completedChapters}</div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
              <div className="text-3xl font-bold mb-1">{subjects.length}</div>
              <div className="text-sm text-white/80">Subjects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href} className="group">
            <Card className={`${action.bgColor} border-0 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full`}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-3">{feature.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {feature.stats}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview Enhanced */}
      <Card className="border-0 bg-gradient-to-r from-background via-accent/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span>Your Learning Journey</span>
          </CardTitle>
          <CardDescription className="text-lg">Track your progress across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <p className="text-xs text-muted-foreground">
              {completedChapters} of {totalChapters} chapters completed
            </p>
          </div>

          {recentlyStudied.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recently Completed
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentlyStudied.map((chapter, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1 px-3 py-1">
                    <span>{chapter.icon}</span>
                    <span className="text-xs">{chapter.name}</span>
                    <Star className="w-3 h-3 text-yellow-500" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Overview Grid */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Subject Progress</span>
          </CardTitle>
          <CardDescription className="text-lg">Your performance across all CBSE Class 10 subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const completedCount = subject.chapters.filter(ch => ch.completed).length;
              const progress = (completedCount / subject.chapters.length) * 100;
              
              return (
                <div key={subject.id} className="group">
                  <Card className="hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] border-0 bg-gradient-to-br from-background to-accent/5">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-3xl p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                          {subject.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{subject.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {completedCount}/{subject.chapters.length} chapters
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/syllabus">
              <Button className="px-8 py-3 text-lg font-semibold">
                View Detailed Progress
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
