
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History, MessageCircle, HelpCircle, Clock } from 'lucide-react';

interface DoubtHistory {
  id: string;
  subject: string;
  question: string;
  status: string;
  created_at: string;
}

const HistoryPage: React.FC = () => {
  const [doubts, setDoubts] = useState<DoubtHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDoubtHistory();
    }
  }, [user]);

  const fetchDoubtHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doubts')
        .select('id, subject, question, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doubt history:', error);
      } else {
        setDoubts(data || []);
      }
    } catch (error) {
      console.error('Error fetching doubt history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
          <History className="w-8 h-8" />
          Chat & Doubt History
        </h1>
        <p className="text-muted-foreground">
          View your past conversations and doubt submissions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Doubt History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {doubts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Doubts Yet</h3>
                <p className="text-muted-foreground">
                  Start asking questions to see your doubt history here!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {doubts.map((doubt, index) => (
                    <div key={doubt.id}>
                      <div className="flex items-start justify-between p-4 rounded-lg border bg-card">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doubt.subject}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(doubt.status)}`}>
                              {doubt.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">
                            {doubt.question}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(doubt.created_at)}
                          </div>
                        </div>
                      </div>
                      {index < doubts.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chat History Coming Soon</h3>
              <p className="text-muted-foreground">
                Chat history functionality will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
