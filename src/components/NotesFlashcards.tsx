
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit3, Trash2, RotateCcw } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  createdAt: Date;
}

const NotesFlashcards: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '' });
  const [newFlashcard, setNewFlashcard] = useState({ front: '', back: '', subject: '' });
  const [showCardBack, setShowCardBack] = useState<string | null>(null);

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        ...newNote,
        createdAt: new Date(),
      };
      setNotes(prev => [note, ...prev]);
      setNewNote({ title: '', content: '', subject: '' });
    }
  };

  const addFlashcard = () => {
    if (newFlashcard.front && newFlashcard.back) {
      const flashcard: Flashcard = {
        id: Date.now().toString(),
        ...newFlashcard,
        createdAt: new Date(),
      };
      setFlashcards(prev => [flashcard, ...prev]);
      setNewFlashcard({ front: '', back: '', subject: '' });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const flipCard = (id: string) => {
    setShowCardBack(showCardBack === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                placeholder="Subject"
                value={newNote.subject}
                onChange={(e) => setNewNote(prev => ({ ...prev, subject: e.target.value }))}
              />
              <Textarea
                placeholder="Note content"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
              <Button onClick={addNote} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      {note.subject && (
                        <Badge variant="secondary" className="mt-1">
                          {note.subject}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {note.createdAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Flashcard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Subject"
                value={newFlashcard.subject}
                onChange={(e) => setNewFlashcard(prev => ({ ...prev, subject: e.target.value }))}
              />
              <Textarea
                placeholder="Front of card (question)"
                value={newFlashcard.front}
                onChange={(e) => setNewFlashcard(prev => ({ ...prev, front: e.target.value }))}
                rows={3}
              />
              <Textarea
                placeholder="Back of card (answer)"
                value={newFlashcard.back}
                onChange={(e) => setNewFlashcard(prev => ({ ...prev, back: e.target.value }))}
                rows={3}
              />
              <Button onClick={addFlashcard} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Flashcard
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {flashcards.map((card) => (
              <Card key={card.id} className="cursor-pointer transition-transform hover:scale-105">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {card.subject && (
                      <Badge variant="secondary">
                        {card.subject}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFlashcard(card.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent onClick={() => flipCard(card.id)}>
                  <div className="min-h-[100px] flex items-center justify-center text-center">
                    <p className="text-sm">
                      {showCardBack === card.id ? card.back : card.front}
                    </p>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Click to {showCardBack === card.id ? 'show question' : 'reveal answer'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotesFlashcards;
