
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject_id?: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DoubtResponse {
  id: string;
  doubt_id: string;
  conversation_id: string;
  user_id: string;
  response_text: string;
  is_ai_response: boolean;
  created_at: string;
}

export interface DoubtConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const createConversation = async (title: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a conversation.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('doubt_conversations')
      .insert({
        title: title.length > 100 ? title.substring(0, 100) + '...' : title,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating conversation:', error);
      toast({
        title: "Error Creating Conversation",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const saveDoubtResponseToDatabase = async (
  conversationId: string,
  responseText: string, 
  isAiResponse: boolean = true
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save responses.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('doubt_responses')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        response_text: responseText,
        is_ai_response: isAiResponse
      })
      .select()
      .single();

    if (error) {
      console.error('Database error saving response:', error);
      toast({
        title: "Error Saving Response",
        description: "Failed to save the response. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving doubt response:', error);
    throw error;
  }
};

export const getUserDoubts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase
      .from('doubts')
      .select(`
        *,
        doubt_responses (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching doubts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user doubts:', error);
    return [];
  }
};

export const getConversationHistory = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('doubt_responses')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Database error fetching conversation history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
};

export const getUserConversations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase
      .from('doubt_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Database error fetching conversations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};
