
import React from 'react';
import { MarksPredictor } from '@/components/MarksPredictor';

const PredictorPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:ml-64 space-y-6 scroll-smooth">
      <MarksPredictor />
    </div>
  );
};

export default PredictorPage;
