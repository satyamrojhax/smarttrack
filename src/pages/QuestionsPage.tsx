
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator';

const QuestionsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:ml-64 space-y-6 scroll-smooth">
      <QuestionGenerator />
    </div>
  );
};

export default QuestionsPage;
