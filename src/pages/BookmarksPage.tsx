
import React from 'react';
import { BookmarksView } from '@/components/BookmarksView';

const BookmarksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:ml-64 space-y-6 scroll-smooth">
      <BookmarksView />
    </div>
  );
};

export default BookmarksPage;
