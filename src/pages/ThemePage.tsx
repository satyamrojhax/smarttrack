
import React from 'react';
import EnhancedThemeToggle from '@/components/EnhancedThemeToggle';

const ThemePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Theme Settings</h1>
        <p className="text-muted-foreground">
          Customize your app appearance and theme preferences
        </p>
      </div>

      <div className="flex justify-center">
        <EnhancedThemeToggle />
      </div>
    </div>
  );
};

export default ThemePage;
