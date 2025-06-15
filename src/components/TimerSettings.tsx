
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RotateCcw, X } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import { useDeviceCapabilities } from '@/hooks/use-mobile';

interface TimerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ isOpen, onClose }) => {
  const { timerSettings, updateSettings } = useTimer();
  const [localSettings, setLocalSettings] = useState(timerSettings);
  const { isMobile, hasTouch } = useDeviceCapabilities();

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      studyDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartSessions: false,
      soundEnabled: true,
    };
    setLocalSettings(defaultSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className={`w-full shadow-2xl animate-scale-in ${
        isMobile ? 'max-w-sm max-h-[90vh] overflow-y-auto' : 'max-w-md'
      }`}>
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className={`flex items-center justify-between ${
            isMobile ? 'text-lg' : 'text-xl'
          }`}>
            <div className="flex items-center gap-2">
              <Settings className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              Timer Settings
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={hasTouch ? 'touch-manipulation' : ''}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studyDuration" className={isMobile ? 'text-sm' : ''}>
                Study Duration (minutes)
              </Label>
              <Input
                id="studyDuration"
                type="number"
                min="1"
                max="120"
                value={localSettings.studyDuration}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  studyDuration: parseInt(e.target.value) || 25
                }))}
                className={`mt-1 ${hasTouch ? 'touch-manipulation' : ''}`}
              />
            </div>

            <div>
              <Label htmlFor="shortBreak" className={isMobile ? 'text-sm' : ''}>
                Short Break (minutes)
              </Label>
              <Input
                id="shortBreak"
                type="number"
                min="1"
                max="30"
                value={localSettings.shortBreakDuration}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  shortBreakDuration: parseInt(e.target.value) || 5
                }))}
                className={`mt-1 ${hasTouch ? 'touch-manipulation' : ''}`}
              />
            </div>

            <div>
              <Label htmlFor="longBreak" className={isMobile ? 'text-sm' : ''}>
                Long Break (minutes)
              </Label>
              <Input
                id="longBreak"
                type="number"
                min="1"
                max="60"
                value={localSettings.longBreakDuration}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  longBreakDuration: parseInt(e.target.value) || 15
                }))}
                className={`mt-1 ${hasTouch ? 'touch-manipulation' : ''}`}
              />
            </div>

            <div>
              <Label htmlFor="longBreakInterval" className={isMobile ? 'text-sm' : ''}>
                Long Break Interval
              </Label>
              <Input
                id="longBreakInterval"
                type="number"
                min="2"
                max="10"
                value={localSettings.longBreakInterval}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  longBreakInterval: parseInt(e.target.value) || 4
                }))}
                className={`mt-1 ${hasTouch ? 'touch-manipulation' : ''}`}
              />
              <p className={`text-muted-foreground mt-1 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Long break after every N sessions
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartBreaks" className={`${
                isMobile ? 'text-sm' : ''
              } flex-1 pr-2`}>
                Auto-start breaks
              </Label>
              <Switch
                id="autoStartBreaks"
                checked={localSettings.autoStartBreaks}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  autoStartBreaks: checked
                }))}
                className={hasTouch ? 'touch-manipulation' : ''}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartSessions" className={`${
                isMobile ? 'text-sm' : ''
              } flex-1 pr-2`}>
                Auto-start sessions
              </Label>
              <Switch
                id="autoStartSessions"
                checked={localSettings.autoStartSessions}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  autoStartSessions: checked
                }))}
                className={hasTouch ? 'touch-manipulation' : ''}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="soundEnabled" className={`${
                isMobile ? 'text-sm' : ''
              } flex-1 pr-2`}>
                Sound notifications
              </Label>
              <Switch
                id="soundEnabled"
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  soundEnabled: checked
                }))}
                className={hasTouch ? 'touch-manipulation' : ''}
              />
            </div>
          </div>

          <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className={`${isMobile ? 'w-full' : 'flex-1'} gap-2 ${
                hasTouch ? 'touch-manipulation' : ''
              }`}
              size={isMobile ? 'default' : 'default'}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline" 
              className={`${isMobile ? 'w-full' : 'flex-1'} ${
                hasTouch ? 'touch-manipulation' : ''
              }`}
              size={isMobile ? 'default' : 'default'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className={`${isMobile ? 'w-full' : 'flex-1'} gap-2 ${
                hasTouch ? 'touch-manipulation' : ''
              }`}
              size={isMobile ? 'default' : 'default'}
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerSettings;
