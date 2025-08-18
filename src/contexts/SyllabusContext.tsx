
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Chapter {
  id: string;
  name: string;
  completed: boolean;
  order_index: number;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
  subject_type: string;
}

interface SyllabusContextType {
  subjects: Subject[];
  loading: boolean;
  toggleChapterCompletion: (subjectId: string, chapterId: string) => Promise<void>;
  getSubjectProgress: (subjectId: string) => number;
  getOverallProgress: () => number;
  resetProgress: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const SyllabusContext = createContext<SyllabusContextType>({
  subjects: [],
  loading: false,
  toggleChapterCompletion: async () => {},
  getSubjectProgress: () => 0,
  getOverallProgress: () => 0,
  resetProgress: async () => {},
  refreshData: async () => {},
});

export const SyllabusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects and chapters with user progress
  const fetchSyllabusData = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      // Fetch subjects for user's class and board
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects_old')
        .select('*')
        .eq('class', profile.class as 'class-9' | 'class-10' | 'class-11' | 'class-12')
        .eq('board', profile.board as 'cbse' | 'icse' | 'state')
        .order('name');

      if (subjectsError) {
        console.error('Error fetching subjects:', subjectsError);
        return;
      }

      // Fetch all chapters for these subjects
      const subjectIds = subjectsData.map(s => s.id);
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .in('subject_id', subjectIds)
        .order('order_index');

      if (chaptersError) {
        console.error('Error fetching chapters:', chaptersError);
        return;
      }

      // Fetch user progress
      const chapterIds = chaptersData.map(c => c.id);
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('chapter_id', chapterIds);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return;
      }

      // Combine data
      const subjectsWithChapters = subjectsData.map(subject => ({
        id: subject.id.toString(), // Convert to string to match interface
        name: subject.name,
        icon: subject.icon,
        color: subject.color,
        subject_type: subject.subject_type,
        chapters: chaptersData
          .filter(chapter => chapter.subject_id === subject.id.toString())
          .map(chapter => {
            const progress = progressData.find(p => p.chapter_id === chapter.id);
            return {
              id: chapter.id,
              name: chapter.name,
              completed: progress?.completed || false,
              order_index: chapter.order_index,
            };
          })
          .sort((a, b) => a.order_index - b.order_index),
      }));

      setSubjects(subjectsWithChapters);
    } catch (error) {
      console.error('Error fetching syllabus data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle chapter completion
  const toggleChapterCompletion = async (subjectId: string, chapterId: string) => {
    if (!user) return;

    try {
      // Find current completion status
      const subject = subjects.find(s => s.id === subjectId);
      const chapter = subject?.chapters.find(c => c.id === chapterId);
      const isCompleted = chapter?.completed || false;

      if (isCompleted) {
        // Remove progress entry
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId);

        if (error) {
          console.error('Error removing progress:', error);
          return;
        }
      } else {
        // Add or update progress entry
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            chapter_id: chapterId,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error updating progress:', error);
          return;
        }
      }

      // Update local state
      setSubjects(prevSubjects =>
        prevSubjects.map(subject =>
          subject.id === subjectId
            ? {
                ...subject,
                chapters: subject.chapters.map(chapter =>
                  chapter.id === chapterId
                    ? { ...chapter, completed: !isCompleted }
                    : chapter
                ),
              }
            : subject
        )
      );
    } catch (error) {
      console.error('Error toggling chapter completion:', error);
    }
  };

  // Calculate subject progress
  const getSubjectProgress = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject || subject.chapters.length === 0) return 0;
    
    const completedChapters = subject.chapters.filter(c => c.completed).length;
    return Math.round((completedChapters / subject.chapters.length) * 100);
  };

  // Calculate overall progress
  const getOverallProgress = () => {
    if (subjects.length === 0) return 0;
    
    const totalChapters = subjects.reduce((total, subject) => total + subject.chapters.length, 0);
    const completedChapters = subjects.reduce(
      (total, subject) => total + subject.chapters.filter(c => c.completed).length,
      0
    );
    
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  // Reset all progress
  const resetProgress = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error resetting progress:', error);
        return;
      }

      // Update local state
      setSubjects(prevSubjects =>
        prevSubjects.map(subject => ({
          ...subject,
          chapters: subject.chapters.map(chapter => ({
            ...chapter,
            completed: false,
          })),
        }))
      );
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  // Refresh data
  const refreshData = async () => {
    await fetchSyllabusData();
  };

  // Fetch data when user or profile changes
  useEffect(() => {
    if (user && profile) {
      fetchSyllabusData();
    } else {
      setSubjects([]);
    }
  }, [user, profile]);

  return (
    <SyllabusContext.Provider
      value={{
        subjects,
        loading,
        toggleChapterCompletion,
        getSubjectProgress,
        getOverallProgress,
        resetProgress,
        refreshData,
      }}
    >
      {children}
    </SyllabusContext.Provider>
  );
};

export const useSyllabus = () => {
  const context = useContext(SyllabusContext);
  if (!context) {
    throw new Error('useSyllabus must be used within a SyllabusProvider');
  }
  return context;
};
