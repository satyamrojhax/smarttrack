
import React from 'react';
import { QuestionGenerator } from '@/components/QuestionGenerator/index';

const QuestionsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Question Generator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate practice questions tailored to your syllabus
          </p>
        </div>
        
        <div className="w-full">
          <QuestionGenerator />
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
