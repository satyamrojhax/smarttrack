
import React from 'react';
import { SyllabusTracker } from '@/components/SyllabusTracker';

const SyllabusPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:ml-64 space-y-6 scroll-smooth">
      <SyllabusTracker />
    </div>
  );
};

export default SyllabusPage;
