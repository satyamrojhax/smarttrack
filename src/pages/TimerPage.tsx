
import React from 'react';
import StudyTimer from '@/components/StudyTimer';
import { useDeviceCapabilities } from '@/hooks/use-mobile';

const TimerPage: React.FC = () => {
  const { isMobile, isTablet } = useDeviceCapabilities();

  const handleSessionComplete = (duration: number) => {
    console.log(`Study session completed: ${duration} seconds`);
  };

  return (
    <div className={`container mx-auto p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 ${
      isMobile ? 'pb-safe-area-inset-bottom' : ''
    }`}>
      <div className="text-center space-y-2 px-2">
        <h1 className={`font-bold gradient-text ${
          isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
        }`}>Study Timer</h1>
        <p className={`text-muted-foreground ${
          isMobile ? 'text-sm' : 'text-base'
        }`}>
          Focus and track your study sessions with the Pomodoro technique
        </p>
      </div>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-md">
          <StudyTimer onSessionComplete={handleSessionComplete} />
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
