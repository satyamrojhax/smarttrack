
import { supabase } from '@/integrations/supabase/client';

export interface TodoTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const todoService = {
  async getTasks(): Promise<TodoTask[]> {
    const { data, error } = await supabase
      .from('todo_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createTask(title: string, category: string): Promise<TodoTask> {
    const { data, error } = await supabase
      .from('todo_tasks')
      .insert({ title, category })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: Partial<Pick<TodoTask, 'title' | 'completed' | 'category'>>): Promise<TodoTask> {
    const { data, error } = await supabase
      .from('todo_tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('todo_tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
