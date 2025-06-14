
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  content: string;
  note_type: 'note' | 'flashcard';
  flashcard_answer?: string;
  created_at: string;
}

const NotesFlashcards: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', answer: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: "Error",
          description: "Failed to load notes",
          variant: "destructive"
        });
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (type: 'note' | 'flashcard') => {
    if (!user || !newNote.title.trim()) return;

    try {
      const noteData = {
        user_id: user.id,
        title: newNote.title,
        content: newNote.content,
        note_type: type,
        flashcard_answer: type === 'flashcard' ? newNote.answer : null
      };

      const { error } = await supabase
        .from('user_notes')
        .insert(noteData);

      if (error) {
        console.error('Error saving note:', error);
        toast({
          title: "Error",
          description: "Failed to save note",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `${type === 'note' ? 'Note' : 'Flashcard'} saved!`
        });
        setNewNote({ title: '', content: '', answer: '' });
        fetchNotes();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        toast({
          title: "Error",
          description: "Failed to delete note",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Note deleted"
        });
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const flipCard = (id: string) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading notes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Notes & Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Note content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                />
                <Button onClick={() => saveNote('note')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-2">
                {notes.filter(note => note.note_type === 'note').map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{note.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{note.content}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Flashcard question"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Additional details (optional)"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                />
                <Textarea
                  placeholder="Answer"
                  value={newNote.answer}
                  onChange={(e) => setNewNote(prev => ({ ...prev, answer: e.target.value }))}
                />
                <Button onClick={() => saveNote('flashcard')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Flashcard
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {notes.filter(note => note.note_type === 'flashcard').map((note) => (
                  <Card key={note.id} className="cursor-pointer" onClick={() => flipCard(note.id)}>
                    <CardContent className="p-4 h-32 flex items-center justify-center relative">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {flippedCard === note.id ? (
                        <div className="text-center">
                          <p className="font-medium text-green-600">Answer:</p>
                          <p className="text-sm mt-1">{note.flashcard_answer}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <h4 className="font-semibold">{note.title}</h4>
                          {note.content && (
                            <p className="text-xs text-muted-foreground mt-1">{note.content}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">Click to reveal answer</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotesFlashcards;
