
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Palette, Monitor } from 'lucide-react';

const EnhancedThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Light Mode</p>
              <p className="text-sm text-muted-foreground">Bright and clean interface</p>
            </div>
          </div>
          <Switch 
            checked={theme === 'light'} 
            onCheckedChange={() => theme === 'dark' && toggleTheme()}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Easy on the eyes</p>
            </div>
          </div>
          <Switch 
            checked={theme === 'dark'} 
            onCheckedChange={() => theme === 'light' && toggleTheme()}
          />
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={toggleTheme} 
            variant="outline" 
            className="w-full gap-2"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Current theme: <span className="font-medium capitalize">{theme}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedThemeToggle;
