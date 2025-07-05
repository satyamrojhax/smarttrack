
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  MessageSquare, 
  Brain, 
  Lightbulb, 
  BookOpen, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  icon: string;
}

interface Doubt {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  status: string;
  created_at: string;
}

interface DoubtResponse {
  id: string;
  response_text: string;
  is_ai_response: boolean;
  created_at: string;
  user_id: string;
}

const DoubtAssistant: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [responses, setResponses] = useState<DoubtResponse[]>([]);
  const [isCreatingDoubt, setIsCreatingDoubt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    subject_id: ''
  });
  const [newResponse, setNewResponse] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSubjects();
    fetchDoubts();
  }, []);

  useEffect(() => {
    if (selectedDoubt) {
      fetchResponses(selectedDoubt.id);
    }
  }, [selectedDoubt]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      });
    }
  };

  const fetchDoubts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('doubts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoubts(data || []);
    } catch (error) {
      console.error('Error fetching doubts:', error);
      toast({
        title: "Error",
        description: "Failed to load doubts",
        variant: "destructive"
      });
    }
  };

  const fetchResponses = async (doubtId: string) => {
    try {
      const { data, error } = await supabase
        .from('doubt_responses')
        .select('*')
        .eq('doubt_id', doubtId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResponses(data || []);
      
      // Scroll to bottom after responses load
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast({
        title: "Error",
        description: "Failed to load responses",
        variant: "destructive"
      });
    }
  };

  const createDoubt = async () => {
    if (!user || !newDoubt.title.trim() || !newDoubt.description.trim() || !newDoubt.subject_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('doubts')
        .insert([{
          title: newDoubt.title.trim(),
          description: newDoubt.description.trim(),
          subject_id: newDoubt.subject_id,
          user_id: user.id,
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;

      setDoubts([data, ...doubts]);
      setSelectedDoubt(data);
      setNewDoubt({ title: '', description: '', subject_id: '' });
      setIsCreatingDoubt(false);
      
      toast({
        title: "Doubt Created! 🎯",
        description: "Your doubt has been submitted successfully."
      });

      // Generate AI response
      generateAIResponse(data.id, newDoubt.description);
    } catch (error) {
      console.error('Error creating doubt:', error);
      toast({
        title: "Error",
        description: "Failed to create doubt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (doubtId: string, question: string) => {
    try {
      // First, add user's question as a response
      await supabase
        .from('doubt_responses')
        .insert([{
          doubt_id: doubtId,
          response_text: question,
          is_ai_response: false,
          user_id: user?.id
        }]);

      // Call AI service (using a simple mock response for now)
      const aiResponse = `Thank you for your question! This is an AI-generated response to help with your doubt about: "${question}". 

I understand you're looking for clarification on this topic. Let me break this down:

1. **Key Concept**: This appears to be related to your CBSE Class 10 curriculum
2. **Important Points**: Focus on understanding the fundamental concepts
3. **Study Tips**: Practice similar problems and refer to your textbook examples

Would you like me to explain any specific part in more detail? Feel free to ask follow-up questions!`;

      await supabase
        .from('doubt_responses')
        .insert([{
          doubt_id: doubtId,
          response_text: aiResponse,
          is_ai_response: true,
          user_id: user?.id
        }]);

      // Refresh responses
      fetchResponses(doubtId);

      toast({
        title: "AI Response Generated! 🤖",
        description: "Check out the AI assistant's helpful response."
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "AI Response Failed",
        description: "Could not generate AI response. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addUserResponse = async () => {
    if (!selectedDoubt || !newResponse.trim() || !user) return;

    setIsLoading(true);
    try {
      await supabase
        .from('doubt_responses')
        .insert([{
          doubt_id: selectedDoubt.id,
          response_text: newResponse.trim(),
          is_ai_response: false,
          user_id: user.id
        }]);

      setNewResponse('');
      fetchResponses(selectedDoubt.id);
      
      toast({
        title: "Response Added! 💬",
        description: "Your message has been added to the discussion."
      });
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: "Error",
        description: "Failed to add response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Doubt Assistant
              </h1>
              <p className="text-lg text-muted-foreground">Get instant help with your CBSE Class 10 doubts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doubts List */}
          <Card className="lg:col-span-1 shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  My Doubts
                </CardTitle>
                <Button 
                  onClick={() => setIsCreatingDoubt(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-3">
                  {doubts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No doubts yet</p>
                      <p className="text-sm">Create your first doubt to get started!</p>
                    </div>
                  ) : (
                    doubts.map((doubt) => (
                      <Card 
                        key={doubt.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedDoubt?.id === doubt.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedDoubt(doubt)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-sm line-clamp-2">{doubt.title}</h3>
                              <Badge className={`text-xs ${getStatusColor(doubt.status)}`}>
                                {doubt.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{doubt.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{getSubjectName(doubt.subject_id)}</span>
                              <span>{new Date(doubt.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            {selectedDoubt ? (
              <>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedDoubt.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedDoubt.status)}>
                          {selectedDoubt.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getSubjectName(selectedDoubt.subject_id)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fetchResponses(selectedDoubt.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[600px]">
                  {/* Messages */}
                  <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                    <div className="space-y-4">
                      {responses.map((response) => (
                        <div 
                          key={response.id}
                          className={`flex gap-3 ${response.is_ai_response ? '' : 'flex-row-reverse'}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            response.is_ai_response 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                              : 'bg-gradient-to-r from-green-500 to-teal-500'
                          }`}>
                            {response.is_ai_response ? (
                              <Bot className="w-4 h-4 text-white" />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className={`max-w-[80%] ${response.is_ai_response ? '' : 'text-right'}`}>
                            <div className={`p-3 rounded-lg ${
                              response.is_ai_response 
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' 
                                : 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{response.response_text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(response.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Type your follow-up question..."
                        onKeyPress={(e) => e.key === 'Enter' && addUserResponse()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={addUserResponse}
                        disabled={!newResponse.trim() || isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-muted-foreground">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">Select a doubt to view discussion</h3>
                  <p className="text-sm">Choose a doubt from the list or create a new one</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Create Doubt Modal */}
        {isCreatingDoubt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Create New Doubt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={newDoubt.subject_id} onValueChange={(value) => setNewDoubt({...newDoubt, subject_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center gap-2">
                            <span>{subject.icon}</span>
                            <span>{subject.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newDoubt.title}
                    onChange={(e) => setNewDoubt({...newDoubt, title: e.target.value})}
                    placeholder="Brief title for your doubt"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newDoubt.description}
                    onChange={(e) => setNewDoubt({...newDoubt, description: e.target.value})}
                    placeholder="Describe your doubt in detail..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={createDoubt}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Doubt
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreatingDoubt(false);
                      setNewDoubt({ title: '', description: '', subject_id: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export { DoubtAssistant };
