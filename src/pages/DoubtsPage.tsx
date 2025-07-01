
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';

const DoubtsPage: React.FC = () => {
  return (
    <div className="h-full w-full p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
            AI Doubt Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ask any question and get instant AI-powered help with your studies
          </p>
        </div>
        <DoubtAssistant />
      </div>
    </div>
  );
};

export default DoubtsPage;
