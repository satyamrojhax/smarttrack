
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';

const DoubtsPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="h-full w-full max-w-7xl mx-auto">
        <DoubtAssistant />
      </div>
    </div>
  );
};

export default DoubtsPage;
