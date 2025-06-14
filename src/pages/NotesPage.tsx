
import React from 'react';
import NotesFlashcards from '@/components/NotesFlashcards';

const NotesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Notes & Flashcards</h1>
        <p className="text-muted-foreground">
          Create and manage your study notes and flashcards
        </p>
      </div>

      <NotesFlashcards />
    </div>
  );
};

export default NotesPage;
