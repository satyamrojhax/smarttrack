
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, BookOpen, Target, Users, Sparkles, ArrowRight, TrendingUp, Award, Star, History, Clock, FileQuestion, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { subjects, getOverallProgress } = useSyllabus();
  const { profile } = useAuth();
  const overallProgress = getOverallProgress();
  const [todayStudyHours, setTodayStudyHours] = useState(0);
  const [totalQuestionsGenerated, setTotalQuestionsGenerated] = useState(0);

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

  // Simulate data loading
  useEffect(() => {
    const savedStudyTime = localStorage.getItem('todayStudyTime') || '0';
    const savedQuestions = localStorage.getItem('totalQuestionsGenerated') || '0';
    setTodayStudyHours(parseFloat(savedStudyTime));
    setTotalQuestionsGenerated(parseInt(savedQuestions));
  }, []);

  const dashboardCards = [
    {
      title: 'Questions Generated',
      value: totalQuestionsGenerated,
      icon: FileQuestion,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkBgColor: 'dark:bg-purple-900/20'
    },
    {
      title: 'Study Hours Today',
      value: `${todayStudyHours.toFixed(1)}h`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkBgColor: 'dark:bg-blue-900/20'
    },
    {
      title: 'Syllabus Progress',
      value: `${overallProgress}%`,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      darkBgColor: 'dark:bg-green-900/20'
    },
    {
      title: 'Chapters Done',
      value: `${completedChapters}/${totalChapters}`,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      darkBgColor: 'dark:bg-orange-900/20'
    },
    {
      title: 'Active Subjects',
      value: subjects.length,
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      darkBgColor: 'dark:bg-indigo-900/20'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Generate unlimited practice questions tailored to your syllabus',
      color: 'from-purple-400 to-pink-600'
    },
    {
      icon: Target,
      title: 'Smart Tracking',
      description: 'Track your progress across all subjects with detailed analytics',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      icon: Award,
      title: 'Marks Prediction',
      description: 'AI-powered predictions to help you achieve your target scores',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Complete Syllabus',
      description: 'Comprehensive CBSE Class 10 curriculum with all subjects',
      color: 'from-orange-400 to-red-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 scroll-smooth">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-6 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-primary font-medium">Welcome back, {profile?.name}!</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold gradient-text leading-tight">
          Your Smart Study
          <br />
          <span className="text-primary">Dashboard</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your progress, generate practice questions, and ace your board exams
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/questions">
            <Button size="lg" className="px-8 py-4 text-lg smooth-transition hover:scale-105">
              <Brain className="w-5 h-5 mr-2" />
              Generate Questions
            </Button>
          </Link>
          <Link to="/mcq-quiz">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg smooth-transition hover:scale-105">
              <Target className="w-5 h-5 mr-2" />
              Take Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="glass-card smooth-transition hover:shadow-lg hover:scale-105">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col space-y-2">
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.darkBgColor} self-start`}>
                  <card.icon className={`w-4 h-4 md:w-5 md:h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-lg md:text-xl font-bold">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card className="glass-card smooth-transition hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Your Learning Progress</span>
          </CardTitle>
          <CardDescription>Track your journey across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
              <p className="text-sm text-muted-foreground">Overall Completion</p>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{completedChapters}</div>
              <p className="text-sm text-muted-foreground">Chapters Completed</p>
              <Badge variant="outline">{totalChapters} Total</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">{subjects.length}</div>
              <p className="text-sm text-muted-foreground">Active Subjects</p>
              <Badge variant="secondary">CBSE Board</Badge>
            </div>
          </div>

          {recentlyStudied.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Recently Completed</h4>
              <div className="flex flex-wrap gap-2">
                {recentlyStudied.map((chapter, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{chapter.icon}</span>
                    <span className="text-xs">{chapter.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="glass-card smooth-transition hover:shadow-lg hover:scale-105 group">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass-card smooth-transition">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Jump into your study session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/questions" className="group">
              <div className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:border-primary group-hover:scale-105">
                <Brain className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-medium">Practice Questions</h4>
                <p className="text-sm text-muted-foreground">AI-generated practice</p>
                <ArrowRight className="w-4 h-4 mt-2 text-primary opacity-0 group-hover:opacity-100 smooth-transition" />
              </div>
            </Link>

            <Link to="/syllabus" className="group">
              <div className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:border-primary group-hover:scale-105">
                <BookOpen className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium">Syllabus Tracker</h4>
                <p className="text-sm text-muted-foreground">Track your progress</p>
                <ArrowRight className="w-4 h-4 mt-2 text-green-600 opacity-0 group-hover:opacity-100 smooth-transition" />
              </div>
            </Link>

            <Link to="/predictor" className="group">
              <div className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:border-primary group-hover:scale-105">
                <Target className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium">Marks Predictor</h4>
                <p className="text-sm text-muted-foreground">Predict your scores</p>
                <ArrowRight className="w-4 h-4 mt-2 text-blue-600 opacity-0 group-hover:opacity-100 smooth-transition" />
              </div>
            </Link>

            <Link to="/bookmarks" className="group">
              <div className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:border-primary group-hover:scale-105">
                <Star className="w-8 h-8 text-yellow-600 mb-2" />
                <h4 className="font-medium">Bookmarks</h4>
                <p className="text-sm text-muted-foreground">Saved questions</p>
                <ArrowRight className="w-4 h-4 mt-2 text-yellow-600 opacity-0 group-hover:opacity-100 smooth-transition" />
              </div>
            </Link>

            <Link to="/history" className="group">
              <div className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:border-primary group-hover:scale-105">
                <History className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium">History</h4>
                <p className="text-sm text-muted-foreground">View chat history</p>
                <ArrowRight className="w-4 h-4 mt-2 text-purple-600 opacity-0 group-hover:opacity-100 smooth-transition" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Subject Overview */}
      <Card className="glass-card smooth-transition">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Subject Overview</span>
          </CardTitle>
          <CardDescription>Your progress across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.slice(0, 6).map((subject) => {
              const completedCount = subject.chapters.filter(ch => ch.completed).length;
              const progress = (completedCount / subject.chapters.length) * 100;
              
              return (
                <div key={subject.id} className="p-4 border rounded-lg smooth-transition hover:shadow-md hover:scale-105">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{subject.name}</h4>
                      <p className="text-xs text-muted-foreground">{completedCount}/{subject.chapters.length} chapters</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
                </div>
              );
            })}
          </div>
          
          {subjects.length > 6 && (
            <div className="text-center mt-6">
              <Link to="/syllabus">
                <Button variant="outline" className="smooth-transition hover:scale-105">
                  View All Subjects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
