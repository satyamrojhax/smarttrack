
import React from 'react';
import { DoubtAssistant } from '@/components/DoubtAssistant';

const DoubtsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 lg:ml-64 space-y-6 scroll-smooth">
      <DoubtAssistant />
    </div>
  );
};

export default DoubtsPage;
