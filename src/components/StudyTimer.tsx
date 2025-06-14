
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StudyTimerProps {
  onSessionComplete?: (duration: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          handleTimerComplete();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds]);

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

      if (error) {
        console.error('Error saving study session:', error);
      }
    } catch (error) {
      console.error('Error saving study session:', error);
    }
  };

  const handleTimerComplete = async () => {
    if (!isBreak) {
      // Study session completed
      setSessionCount(prev => prev + 1);
      await saveStudySession(25 * 60, 'study');
      onSessionComplete?.(25 * 60);
      toast({
        title: "Study Session Complete!",
        description: "Great job! Time for a break.",
      });
      // Start break timer
      setIsBreak(true);
      setMinutes(5);
      setSeconds(0);
    } else {
      // Break completed
      await saveStudySession(5 * 60, 'break');
      toast({
        title: "Break Complete!",
        description: "Ready for another study session?",
      });
      setIsBreak(false);
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Settings className="w-5 h-5" />
          {isBreak ? 'Break Time' : 'Study Timer'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${isBreak ? 'text-green-500' : 'text-blue-500'}`}>
            {formatTime(minutes, seconds)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isBreak ? 'Take a break!' : 'Focus time'}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={toggleTimer} size="lg" className="gap-2">
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Sessions completed: <span className="font-semibold">{sessionCount}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;
