
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  content: string;
  note_type: string;
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
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Notes & Flashcards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="notes" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">Notes</TabsTrigger>
            <TabsTrigger value="flashcards" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Flashcards</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-6">
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder="📝 Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="border-purple-200 focus:border-purple-500"
                  />
                  <Textarea
                    placeholder="✍️ Write your note content here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="border-purple-200 focus:border-purple-500 min-h-[100px]"
                  />
                  <Button 
                    onClick={() => saveNote('note')} 
                    className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {notes.filter(note => note.note_type === 'note').map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-700 mb-2">{note.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-6">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder="❓ Flashcard question"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="border-blue-200 focus:border-blue-500"
                  />
                  <Textarea
                    placeholder="📚 Additional details (optional)"
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="border-blue-200 focus:border-blue-500"
                  />
                  <Textarea
                    placeholder="✅ Write the answer here..."
                    value={newNote.answer}
                    onChange={(e) => setNewNote(prev => ({ ...prev, answer: e.target.value }))}
                    className="border-blue-200 focus:border-blue-500"
                  />
                  <Button 
                    onClick={() => saveNote('flashcard')} 
                    className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Flashcard
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.filter(note => note.note_type === 'flashcard').map((note) => (
                <div key={note.id} className="relative group">
                  <Card 
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                      flippedCard === note.id 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:from-blue-100 hover:to-indigo-100'
                    }`}
                    onClick={() => flipCard(note.id)}
                  >
                    <CardContent className="p-6 h-48 flex flex-col justify-between relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                      
                      {/* Delete button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 bg-white/80"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Card content */}
                      <div className="relative z-10">
                        {flippedCard === note.id ? (
                          <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                              <p className="font-semibold text-green-700">Answer</p>
                            </div>
                            <p className="text-sm text-green-800 font-medium leading-relaxed">
                              {note.flashcard_answer}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <EyeOff className="w-4 h-4 text-white" />
                              </div>
                              <p className="font-semibold text-blue-700">Question</p>
                            </div>
                            <h4 className="font-semibold text-blue-900 text-lg leading-tight">{note.title}</h4>
                            {note.content && (
                              <p className="text-xs text-blue-600 opacity-80">{note.content}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Flip indicator */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                          <RotateCcw className="w-3 h-3" />
                          Click to {flippedCard === note.id ? 'show question' : 'reveal answer'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotesFlashcards;
