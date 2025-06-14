
import React from 'react';
import ExportProgress from '@/components/ExportProgress';

const ExportPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Export Progress</h1>
        <p className="text-muted-foreground">
          Export your study data and progress reports
        </p>
      </div>

      <ExportProgress />
    </div>
  );
};

export default ExportPage;
