
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Clock, Target, Book, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description: string;
  earned_at: string;
}

interface AchievementTemplate {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const achievementTemplates: AchievementTemplate[] = [
    {
      type: 'first_session',
      name: 'First Steps',
      description: 'Complete your first study session',
      icon: <Star className="w-4 h-4" />,
      color: 'bg-yellow-500'
    },
    {
      type: 'study_streak_3',
      name: 'Getting Started',
      description: 'Study for 3 days in a row',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-orange-500'
    },
    {
      type: 'study_streak_7',
      name: 'Week Warrior',
      description: 'Study for 7 days in a row',
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      type: 'total_time_10h',
      name: 'Time Master',
      description: 'Study for 10 total hours',
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-green-500'
    },
    {
      type: 'notes_created_10',
      name: 'Note Taker',
      description: 'Create 10 notes or flashcards',
      icon: <Book className="w-4 h-4" />,
      color: 'bg-purple-500'
    },
    {
      type: 'sessions_50',
      name: 'Dedicated Student',
      description: 'Complete 50 study sessions',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-red-500'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchAchievements();
      checkAndCreateAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
      } else {
        setAchievements(data || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndCreateAchievements = async () => {
    if (!user) return;

    try {
      // Check study statistics
      const { data: stats } = await supabase
        .from('study_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        // Check for achievements based on stats
        const achievementsToCreate = [];

        if (stats.total_sessions >= 1) {
          achievementsToCreate.push({
            user_id: user.id,
            achievement_type: 'first_session',
            achievement_name: 'First Steps',
            achievement_description: 'Complete your first study session'
          });
        }

        if (stats.total_sessions >= 50) {
          achievementsToCreate.push({
            user_id: user.id,
            achievement_type: 'sessions_50',
            achievement_name: 'Dedicated Student',
            achievement_description: 'Complete 50 study sessions'
          });
        }

        if (stats.total_study_time >= 36000) { // 10 hours in seconds
          achievementsToCreate.push({
            user_id: user.id,
            achievement_type: 'total_time_10h',
            achievement_name: 'Time Master',
            achievement_description: 'Study for 10 total hours'
          });
        }

        if (stats.notes_created >= 10) {
          achievementsToCreate.push({
            user_id: user.id,
            achievement_type: 'notes_created_10',
            achievement_name: 'Note Taker',
            achievement_description: 'Create 10 notes or flashcards'
          });
        }

        // Insert achievements (ignore conflicts for already earned achievements)
        if (achievementsToCreate.length > 0) {
          await supabase
            .from('user_achievements')
            .upsert(achievementsToCreate, {
              onConflict: 'user_id,achievement_type',
              ignoreDuplicates: true
            });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const getAchievementTemplate = (type: string) => {
    return achievementTemplates.find(template => template.type === type);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievement Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievementTemplates.map((template) => {
            const earned = achievements.find(a => a.achievement_type === template.type);
            const isEarned = !!earned;

            return (
              <Card key={template.type} className={`${isEarned ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' : 'opacity-60'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isEarned ? template.color : 'bg-gray-300'} flex items-center justify-center text-white`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      {isEarned && (
                        <Badge variant="secondary" className="mt-1">
                          Earned {new Date(earned.earned_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
            <p className="text-muted-foreground">Start studying to unlock your first achievement!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
