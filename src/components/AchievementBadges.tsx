
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, BookOpen, Clock, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'study' | 'time' | 'streak' | 'milestone';
}

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-study',
      title: 'Getting Started',
      description: 'Complete your first study session',
      icon: <BookOpen className="w-6 h-6" />,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'time-master',
      title: 'Time Master',
      description: 'Study for 10 hours total',
      icon: <Clock className="w-6 h-6" />,
      progress: 0,
      maxProgress: 600, // 10 hours in minutes
      unlocked: false,
      category: 'time'
    },
    {
      id: 'streak-warrior',
      title: 'Streak Warrior',
      description: 'Study for 7 days in a row',
      icon: <Zap className="w-6 h-6" />,
      progress: 0,
      maxProgress: 7,
      unlocked: false,
      category: 'streak'
    },
    {
      id: 'chapter-champion',
      title: 'Chapter Champion',
      description: 'Complete 5 chapters',
      icon: <Target className="w-6 h-6" />,
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      category: 'study'
    },
    {
      id: 'dedication-master',
      title: 'Dedication Master',
      description: 'Study for 50 hours total',
      icon: <Trophy className="w-6 h-6" />,
      progress: 0,
      maxProgress: 3000, // 50 hours in minutes
      unlocked: false,
      category: 'time'
    },
    {
      id: 'consistency-king',
      title: 'Consistency King',
      description: 'Study for 30 days in a row',
      icon: <Award className="w-6 h-6" />,
      progress: 0,
      maxProgress: 30,
      unlocked: false,
      category: 'streak'
    }
  ]);

  // Simulate progress updates (in a real app, this would come from your study tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setAchievements(prev => prev.map(achievement => {
        // Randomly update progress for demo purposes
        if (!achievement.unlocked && Math.random() < 0.1) {
          const newProgress = Math.min(
            achievement.progress + Math.floor(Math.random() * 5) + 1,
            achievement.maxProgress
          );
          return {
            ...achievement,
            progress: newProgress,
            unlocked: newProgress >= achievement.maxProgress
          };
        }
        return achievement;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'study': return 'bg-blue-500';
      case 'time': return 'bg-green-500';
      case 'streak': return 'bg-orange-500';
      case 'milestone': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'study': return 'Study';
      case 'time': return 'Time';
      case 'streak': return 'Streak';
      case 'milestone': return 'Milestone';
      default: return 'General';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Achievements Unlocked</span>
                <span>{unlockedCount}/{achievements.length}</span>
              </div>
              <Progress value={(unlockedCount / achievements.length) * 100} className="h-3" />
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {unlockedCount}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`transition-all duration-300 ${
              achievement.unlocked 
                ? 'ring-2 ring-yellow-500 shadow-lg transform scale-105' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-full ${getCategoryColor(achievement.category)} text-white`}>
                  {achievement.icon}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline">
                    {getCategoryName(achievement.category)}
                  </Badge>
                  {achievement.unlocked && (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {achievement.description}
              </p>
              
              {!achievement.unlocked && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="text-center">
                  <Badge className="bg-yellow-500 text-white">
                    🎉 Unlocked!
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;
