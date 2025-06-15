
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
  sessionCount: number;
  totalStudyTime: number;
  currentSession: number;
  isPaused: boolean;
}

interface TimerSettings {
  studyDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
  soundEnabled: boolean;
}

interface TimerContextType {
  timerState: TimerState;
  timerSettings: TimerSettings;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
}

const defaultTimerState: TimerState = {
  minutes: 25,
  seconds: 0,
  isActive: false,
  isBreak: false,
  sessionCount: 0,
  totalStudyTime: 0,
  currentSession: 0,
  isPaused: false,
};

const defaultTimerSettings: TimerSettings = {
  studyDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartSessions: false,
  soundEnabled: true,
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timerState, setTimerState] = useState<TimerState>(defaultTimerState);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(defaultTimerSettings);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      setTimerSettings(JSON.parse(savedSettings));
    }

    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setTimerState(state);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(timerSettings));
  }, [timerSettings]);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [timerState]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isActive && !timerState.isPaused) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            handleTimerComplete();
            return { ...prev, isActive: false };
          }
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isActive, timerState.isPaused]);

  const saveStudySession = async (duration: number, sessionType: 'study' | 'break') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          duration_seconds: duration,
          session_type: sessionType
        });

      if (error) console.error('Error saving study session:', error);
    } catch (error) {
      console.error('Error saving study session:', error);
    }
  };

  const playNotificationSound = () => {
    if (timerSettings.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBjet2O7SeSYELYTC7eSRQw==');
      audio.play().catch(() => {});
    }
  };

  const handleTimerComplete = async () => {
    playNotificationSound();

    if (!timerState.isBreak) {
      // Study session completed
      const studyDuration = timerSettings.studyDuration * 60;
      await saveStudySession(studyDuration, 'study');
      
      setTimerState(prev => ({
        ...prev,
        sessionCount: prev.sessionCount + 1,
        totalStudyTime: prev.totalStudyTime + studyDuration,
        currentSession: prev.currentSession + 1,
        isBreak: true,
        minutes: prev.currentSession % timerSettings.longBreakInterval === 0 
          ? timerSettings.longBreakDuration 
          : timerSettings.shortBreakDuration,
        seconds: 0,
        isActive: timerSettings.autoStartBreaks
      }));

      toast({
        title: "Study Session Complete! 🎉",
        description: `Great job! You've completed ${timerState.sessionCount + 1} session${timerState.sessionCount + 1 > 1 ? 's' : ''}.`,
      });
    } else {
      // Break completed
      const breakDuration = timerState.currentSession % timerSettings.longBreakInterval === 0 
        ? timerSettings.longBreakDuration * 60 
        : timerSettings.shortBreakDuration * 60;
      
      await saveStudySession(breakDuration, 'break');
      
      setTimerState(prev => ({
        ...prev,
        isBreak: false,
        minutes: timerSettings.studyDuration,
        seconds: 0,
        isActive: timerSettings.autoStartSessions
      }));

      toast({
        title: "Break Complete! ☕",
        description: "Ready for another productive study session?",
      });
    }
  };

  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: false, isPaused: true }));
  };

  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      minutes: prev.isBreak 
        ? (prev.currentSession % timerSettings.longBreakInterval === 0 
          ? timerSettings.longBreakDuration 
          : timerSettings.shortBreakDuration)
        : timerSettings.studyDuration,
      seconds: 0
    }));
  };

  const skipSession = () => {
    handleTimerComplete();
  };

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...newSettings }));
    
    // Reset timer with new settings if not active
    if (!timerState.isActive) {
      setTimerState(prev => ({
        ...prev,
        minutes: prev.isBreak 
          ? (prev.currentSession % (newSettings.longBreakInterval || prev.currentSession) === 0 
            ? newSettings.longBreakDuration || timerSettings.longBreakDuration
            : newSettings.shortBreakDuration || timerSettings.shortBreakDuration)
          : newSettings.studyDuration || timerSettings.studyDuration,
        seconds: 0
      }));
    }
  };

  return (
    <TimerContext.Provider value={{
      timerState,
      timerSettings,
      startTimer,
      pauseTimer,
      resetTimer,
      skipSession,
      updateSettings
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
