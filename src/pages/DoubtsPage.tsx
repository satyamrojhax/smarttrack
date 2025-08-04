
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';

const DoubtsPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <DoubtAssistant />
      </div>
    </div>
  );
};

export default DoubtsPage;
