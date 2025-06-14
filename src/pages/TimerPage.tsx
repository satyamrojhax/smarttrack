
import React from 'react';
import StudyTimer from '@/components/StudyTimer';

const TimerPage: React.FC = () => {
  const handleSessionComplete = (duration: number) => {
    console.log(`Study session completed: ${duration} seconds`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Study Timer</h1>
        <p className="text-muted-foreground">
          Focus and track your study sessions with the Pomodoro technique
        </p>
      </div>

      <div className="flex justify-center">
        <StudyTimer onSessionComplete={handleSessionComplete} />
      </div>
    </div>
  );
};

export default TimerPage;
