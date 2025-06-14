
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!conversationId || !user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doubt_responses')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const formattedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.response_text,
        role: msg.is_ai_response ? 'assistant' : 'user',
        timestamp: new Date(msg.created_at!).getTime()
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: Message) => {
    if (!conversationId || !user) return;

    // Add to local state immediately
    setMessages(prev => [...prev, message]);

    try {
      // Save to database
      await supabase
        .from('doubt_responses')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          response_text: message.content,
          is_ai_response: message.role === 'assistant'
        });

      // Update conversation timestamp
      await supabase
        .from('doubt_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      setMessages([]); // Clear previous messages
      fetchMessages();
    }
  }, [conversationId, user]);

  return {
    messages,
    loading,
    addMessage
  };
};
