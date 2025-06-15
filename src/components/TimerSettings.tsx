
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';

interface TimerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ isOpen, onClose }) => {
  const { timerSettings, updateSettings } = useTimer();
  const [localSettings, setLocalSettings] = useState(timerSettings);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Timer Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="studyDuration">Study Duration (minutes)</Label>
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
              />
            </div>

            <div>
              <Label htmlFor="shortBreak">Short Break (minutes)</Label>
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
              />
            </div>

            <div>
              <Label htmlFor="longBreak">Long Break (minutes)</Label>
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
              />
            </div>

            <div>
              <Label htmlFor="longBreakInterval">Long Break Interval</Label>
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
              />
              <p className="text-xs text-muted-foreground mt-1">
                Long break after every N sessions
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
              <Switch
                id="autoStartBreaks"
                checked={localSettings.autoStartBreaks}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  autoStartBreaks: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoStartSessions">Auto-start sessions</Label>
              <Switch
                id="autoStartSessions"
                checked={localSettings.autoStartSessions}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  autoStartSessions: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="soundEnabled">Sound notifications</Label>
              <Switch
                id="soundEnabled"
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  soundEnabled: checked
                }))}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerSettings;
