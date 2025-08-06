
import { supabase } from '@/integrations/supabase/client';

export interface CommunityMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export const sendCommunityMessage = async (message: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('community_messages')
      .insert([{
        user_id: user.id,
        message: message.trim()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    console.log('Message sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendCommunityMessage:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getCommunityMessages = async (limit: number = 50): Promise<CommunityMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('community_messages')
      .select(`
        id,
        user_id,
        message,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    console.log('Messages fetched successfully:', data?.length || 0);
    return (data || []) as CommunityMessage[];
  } catch (error) {
    console.error('Error in getCommunityMessages:', error);
    return [];
  }
};
