
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Brain, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { SyllabusTracker } from '@/components/SyllabusTracker';
import { QuestionGenerator } from '@/components/QuestionGenerator';
import { MarksPredictor } from '@/components/MarksPredictor';
import { BookmarksView } from '@/components/BookmarksView';

const Index = () => {
  const { user } = useAuth();
  const { getOverallProgress, getSubjectProgress, subjects } = useSyllabus();
  const [activeTab, setActiveTab] = useState('dashboard');

  const overallProgress = getOverallProgress();

  const getDailyTip = () => {
    const tips = [
      "Start your day with the most challenging subject for better focus",
      "Take 5-minute breaks between chapters to improve retention",
      "Create mind maps for complex topics to visualize connections",
      "Practice previous year questions to understand exam patterns",
      "Teach concepts to friends or family to reinforce your understanding"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const getMotivationalMessage = () => {
    if (overallProgress >= 80) return "Excellent! You're almost ready for the boards! 🎯";
    if (overallProgress >= 60) return "Great progress! Keep up the momentum! 📚";
    if (overallProgress >= 40) return "Good start! Stay consistent with your studies! 💪";
    return "Let's begin your journey to success! 🚀";
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">{getMotivationalMessage()}</p>
      </div>

      {/* Overall Progress */}
      <Card className="glass-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Target className="w-6 h-6 text-primary" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${overallProgress * 3.39} 339`}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{overallProgress}%</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Syllabus Completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject) => {
            const progress = getSubjectProgress(subject.id);
            return (
              <div key={subject.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{subject.icon}</span>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <Badge variant={progress >= 75 ? "default" : progress >= 50 ? "secondary" : "outline"}>
                    {progress}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Daily Tip */}
      <Card className="glass-card border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Daily Study Tip</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center italic">{getDailyTip()}</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => setActiveTab('syllabus')}
          variant="outline"
          className="h-20 flex flex-col space-y-2"
        >
          <BookOpen className="w-6 h-6" />
          <span>Track Syllabus</span>
        </Button>
        <Button
          onClick={() => setActiveTab('questions')}
          variant="outline"
          className="h-20 flex flex-col space-y-2"
        >
          <Brain className="w-6 h-6" />
          <span>Generate Questions</span>
        </Button>
        <Button
          onClick={() => setActiveTab('predictor')}
          variant="outline"
          className="h-20 flex flex-col space-y-2"
        >
          <TrendingUp className="w-6 h-6" />
          <span>Predict Marks</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Target },
          { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
          { id: 'questions', label: 'Questions', icon: Brain },
          { id: 'predictor', label: 'Predictor', icon: TrendingUp },
          { id: 'bookmarks', label: 'Bookmarks', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'syllabus' && <SyllabusTracker />}
      {activeTab === 'questions' && <QuestionGenerator />}
      {activeTab === 'predictor' && <MarksPredictor />}
      {activeTab === 'bookmarks' && <BookmarksView />}
    </div>
  );
};

export default Index;
