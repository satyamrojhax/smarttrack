
import React from 'react';
import { SyllabusTracker } from '@/components/SyllabusTracker';
import { useDeviceCapabilities } from '@/hooks/use-mobile';

const SyllabusPage: React.FC = () => {
  const { isMobile, isTablet, isStandalone } = useDeviceCapabilities();

  return (
    <div className={`w-full ${
      isMobile ? 'pb-safe-area-inset-bottom' : ''
    }`}>
      <div className={`container mx-auto p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 ${
        isStandalone ? 'pb-safe-area-inset-bottom' : ''
      }`}>
        <div className="text-center space-y-2 px-2">
          <h1 className={`font-bold gradient-text ${
            isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
          }`}>Syllabus Tracker</h1>
          <p className={`text-muted-foreground ${
            isMobile ? 'text-sm' : 'text-base'
          }`}>
            Track your progress across all subjects and chapters
          </p>
        </div>
        
        <div className="w-full">
          <SyllabusTracker />
        </div>
      </div>
    </div>
  );
};

export default SyllabusPage;
