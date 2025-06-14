
import React from 'react';
import AchievementBadges from '@/components/AchievementBadges';

const BadgesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Achievement Badges</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock achievements as you study
        </p>
      </div>

      <AchievementBadges />
    </div>
  );
};

export default BadgesPage;
