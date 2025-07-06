
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DataSyncManager = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!profile) return;

    // Sync offline data when coming back online
    const syncOfflineData = async () => {
      try {
        const offlineData = localStorage.getItem('offline-data');
        if (offlineData && navigator.onLine) {
          const data = JSON.parse(offlineData);
          
          // Sync todo tasks
          if (data.todos?.length > 0) {
            for (const todo of data.todos) {
              await supabase.from('todo_tasks').insert({
                title: todo.title,
                category: todo.category,
                user_id: profile.id,
              });
            }
            
            // Clear synced todos
            const remainingData = { ...data };
            delete remainingData.todos;
            localStorage.setItem('offline-data', JSON.stringify(remainingData));
          }

          // Sync study sessions
          if (data.studySessions?.length > 0) {
            for (const session of data.studySessions) {
              await supabase.from('study_sessions').insert({
                duration_seconds: session.duration,
                session_type: session.type,
                user_id: profile.id,
              });
            }
            
            // Clear synced sessions
            const remainingData = { ...data };
            delete remainingData.studySessions;
            localStorage.setItem('offline-data', JSON.stringify(remainingData));
          }

          toast({
            title: "Data Synced! ☁️",
            description: "Your offline data has been synchronized",
          });
        }
      } catch (error) {
        console.error('Data sync error:', error);
        toast({
          title: "Sync Error",
          description: "Some data couldn't be synchronized. We'll try again later.",
          variant: "destructive",
        });
      }
    };

    // Sync when app comes back online
    window.addEventListener('online', syncOfflineData);
    
    // Initial sync if online
    if (navigator.onLine) {
      syncOfflineData();
    }

    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, [profile, toast]);

  return null;
};

export default DataSyncManager;
