
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MessageCircleQuestion, Brain, BookOpen, Users, TrendingUp, Plus } from 'lucide-react';

const DoubtsPage: React.FC = () => {
  const recentDoubts = [
    {
      id: 1,
      question: "How to solve quadratic equations using factorization method?",
      subject: "Mathematics",
      chapter: "Polynomial",
      status: "answered",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      question: "Explain the process of photosynthesis in detail",
      subject: "Science",
      chapter: "Life Processes",
      status: "pending",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      question: "What are the main causes of World War 1?",
      subject: "Social Science",
      chapter: "The Making of Global World",
      status: "answered",
      timestamp: "1 day ago"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 lg:ml-64 space-y-4 sm:space-y-6 scroll-smooth">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center justify-center space-x-2">
          <MessageCircleQuestion className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <span>Doubts & Questions</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-lg">Get help with your studies and track your questions 📚</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/ask-doubt" className="block">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ask New Doubt</h3>
                  <p className="text-sm text-muted-foreground">Get instant AI-powered help</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Brain className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">24/7 study support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Doubts */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Recent Doubts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentDoubts.map((doubt) => (
            <div
              key={doubt.id}
              className="p-4 rounded-lg border bg-secondary/5 hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm sm:text-base line-clamp-2">{doubt.question}</h4>
                <Badge
                  variant={doubt.status === 'answered' ? 'default' : 'secondary'}
                  className="ml-2 flex-shrink-0"
                >
                  {doubt.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{doubt.subject}</span>
                <span>•</span>
                <span>{doubt.chapter}</span>
                <span>•</span>
                <span>{doubt.timestamp}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Study Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-muted-foreground">Doubts Asked</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">9</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">3</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">85%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoubtsPage;
