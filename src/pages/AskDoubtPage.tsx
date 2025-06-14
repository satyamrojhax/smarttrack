
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';

const AskDoubtPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 lg:ml-64 space-y-4 sm:space-y-6 scroll-smooth">
      <DoubtAssistant />
    </div>
  );
};

export default AskDoubtPage;
