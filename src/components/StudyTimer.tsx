
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, SkipForward, Clock, Target, Trophy } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';
import TimerSettings from './TimerSettings';

interface StudyTimerProps {
  onSessionComplete?: (duration: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const { timerState, timerSettings, startTimer, pauseTimer, resetTimer, skipSession } = useTimer();
  const [showSettings, setShowSettings] = useState(false);
  const { isMobile, isTablet, hasTouch } = useDeviceCapabilities();

  // Trigger callback when session completes
  useEffect(() => {
    if (onSessionComplete && timerState.sessionCount > 0) {
      const duration = timerSettings.studyDuration * 60;
      onSessionComplete(duration);
    }
  }, [timerState.sessionCount, onSessionComplete, timerSettings.studyDuration]);

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

  // Responsive button sizing
  const buttonSize = isMobile ? 'default' : 'lg';
  const iconSize = isMobile ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className={`text-center flex items-center justify-between ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={iconSize} />
              <span className={isMobile ? 'text-base' : 'text-xl'}>
                {timerState.isBreak ? 'Break Time' : 'Focus Time'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className={hasTouch ? 'touch-manipulation' : ''}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Timer Display */}
          <div className="text-center space-y-3">
            <div className={`font-mono font-bold transition-colors duration-300 ${
              isMobile ? 'text-5xl sm:text-6xl' : isTablet ? 'text-6xl' : 'text-7xl'
            } ${timerState.isBreak ? 'text-green-500' : 'text-blue-500'}`}>
              {formatTime(timerState.minutes, timerState.seconds)}
            </div>
            <Progress 
              value={getProgress()} 
              className={`h-2 sm:h-3 transition-all duration-300 ${
                timerState.isBreak ? 'text-green-500' : 'text-blue-500'
              }`}
            />
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
              {timerState.isBreak 
                ? `${getNextBreakType()} break - Take a rest!` 
                : 'Stay focused and productive'}
            </p>
          </div>

          {/* Control Buttons */}
          <div className={`flex justify-center gap-2 sm:gap-3 ${
            isMobile ? 'flex-wrap' : ''
          }`}>
            <Button 
              onClick={timerState.isActive ? pauseTimer : startTimer} 
              size={buttonSize} 
              className={`gap-2 min-w-0 ${
                isMobile ? 'flex-1 min-w-[120px]' : ''
              } ${hasTouch ? 'touch-manipulation' : ''}`}
            >
              {timerState.isActive ? <Pause className={iconSize} /> : <Play className={iconSize} />}
              <span className={isMobile ? 'text-sm' : 'text-base'}>
                {timerState.isActive ? 'Pause' : 'Start'}
              </span>
            </Button>
            <Button 
              onClick={resetTimer} 
              variant="outline" 
              size={buttonSize} 
              className={`gap-2 ${
                isMobile ? 'flex-1 min-w-[100px]' : ''
              } ${hasTouch ? 'touch-manipulation' : ''}`}
            >
              <RotateCcw className={iconSize} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Reset</span>
            </Button>
            <Button 
              onClick={skipSession} 
              variant="outline" 
              size={buttonSize} 
              className={`gap-2 ${
                isMobile ? 'flex-1 min-w-[100px]' : ''
              } ${hasTouch ? 'touch-manipulation' : ''}`}
            >
              <SkipForward className={iconSize} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>Skip</span>
            </Button>
          </div>

          {/* Statistics */}
          <div className={`grid grid-cols-2 gap-3 sm:gap-4`}>
            <div className={`text-center p-3 sm:p-4 rounded-lg bg-muted transition-all duration-200 ${
              hasTouch ? 'active:scale-95' : 'hover:bg-muted/80'
            }`}>
              <div className={`font-bold text-blue-500 ${
                isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'
              }`}>
                {timerState.sessionCount}
              </div>
              <p className={`text-muted-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Sessions Today
              </p>
            </div>
            <div className={`text-center p-3 sm:p-4 rounded-lg bg-muted transition-all duration-200 ${
              hasTouch ? 'active:scale-95' : 'hover:bg-muted/80'
            }`}>
              <div className={`font-bold text-green-500 ${
                isMobile ? 'text-xl sm:text-2xl' : 'text-3xl'
              }`}>
                {formatTotalTime(timerState.totalStudyTime)}
              </div>
              <p className={`text-muted-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Total Study Time
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className={`flex flex-wrap gap-2 justify-center ${
            isMobile ? 'text-xs' : 'text-sm'
          }`}>
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
            <Badge variant="outline" className={isMobile ? 'text-xs' : ''}>
              {timerSettings.studyDuration}m / {timerSettings.shortBreakDuration}m / {timerSettings.longBreakDuration}m
            </Badge>
          </div>

          {/* Next Session Info */}
          {!timerState.isBreak && timerState.sessionCount > 0 && (
            <div className={`text-center p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 ${
              isMobile ? 'mx-2' : ''
            }`}>
              <p className={`text-blue-700 dark:text-blue-300 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
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
