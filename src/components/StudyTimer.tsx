
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, SkipForward, Clock, Target, Trophy } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import TimerSettings from './TimerSettings';

interface StudyTimerProps {
  onSessionComplete?: (duration: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const { timerState, timerSettings, startTimer, pauseTimer, resetTimer, skipSession } = useTimer();
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalMinutes = () => {
    return timerState.isBreak 
      ? (timerState.currentSession % timerSettings.longBreakInterval === 0 
        ? timerSettings.longBreakDuration 
        : timerSettings.shortBreakDuration)
      : timerSettings.studyDuration;
  };

  const getCurrentMinutes = () => {
    return timerState.minutes + (timerState.seconds / 60);
  };

  const getProgress = () => {
    const total = getTotalMinutes();
    const current = getCurrentMinutes();
    return ((total - current) / total) * 100;
  };

  const getNextBreakType = () => {
    return (timerState.currentSession + 1) % timerSettings.longBreakInterval === 0 ? 'Long' : 'Short';
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {timerState.isBreak ? 'Break Time' : 'Focus Time'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-2">
            <div className={`text-7xl font-mono font-bold ${
              timerState.isBreak ? 'text-green-500' : 'text-blue-500'
            }`}>
              {formatTime(timerState.minutes, timerState.seconds)}
            </div>
            <Progress 
              value={getProgress()} 
              className={`h-2 ${timerState.isBreak ? 'text-green-500' : 'text-blue-500'}`}
            />
            <p className="text-sm text-muted-foreground">
              {timerState.isBreak 
                ? `${getNextBreakType()} break - Take a rest!` 
                : 'Stay focused and productive'}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            <Button 
              onClick={timerState.isActive ? pauseTimer : startTimer} 
              size="lg" 
              className="gap-2"
            >
              {timerState.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {timerState.isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={skipSession} variant="outline" size="lg" className="gap-2">
              <SkipForward className="w-4 h-4" />
              Skip
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-blue-500">{timerState.sessionCount}</div>
              <p className="text-xs text-muted-foreground">Sessions Today</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold text-green-500">
                {formatTotalTime(timerState.totalStudyTime)}
              </div>
              <p className="text-xs text-muted-foreground">Total Study Time</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant={timerState.isActive ? "default" : "secondary"} className="gap-1">
              <Target className="w-3 h-3" />
              {timerState.isActive ? 'Active' : 'Paused'}
            </Badge>
            {timerState.sessionCount > 0 && (
              <Badge variant="outline" className="gap-1">
                <Trophy className="w-3 h-3" />
                {timerState.sessionCount} completed
              </Badge>
            )}
            <Badge variant="outline">
              {timerSettings.studyDuration}m / {timerSettings.shortBreakDuration}m / {timerSettings.longBreakDuration}m
            </Badge>
          </div>

          {/* Next Session Info */}
          {!timerState.isBreak && timerState.sessionCount > 0 && (
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Next: {getNextBreakType()} break ({
                  (timerState.currentSession + 1) % timerSettings.longBreakInterval === 0 
                    ? timerSettings.longBreakDuration 
                    : timerSettings.shortBreakDuration
                } minutes)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <TimerSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default StudyTimer;
