
import React from 'react';
import { CommunityChat } from '@/components/CommunityChat';

const CommunityPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 p-2 sm:p-4 md:p-6">
        <CommunityChat />
      </div>
    </div>
  );
};

export default CommunityPage;
