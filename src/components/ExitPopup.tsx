
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ExitPopup: React.FC = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if user has unsaved changes or is in middle of activity
      const hasUnsavedWork = localStorage.getItem('hasUnsavedWork') === 'true';
      
      if (hasUnsavedWork) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User is leaving the tab/app
        const hasUnsavedWork = localStorage.getItem('hasUnsavedWork') === 'true';
        if (hasUnsavedWork) {
          setShowExitDialog(true);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleStay = () => {
    setShowExitDialog(false);
  };

  const handleLeave = () => {
    localStorage.removeItem('hasUnsavedWork');
    setShowExitDialog(false);
    // Additional cleanup can be done here
  };

  return (
    <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <DialogTitle>Wait! Don't leave yet</DialogTitle>
          </div>
          <DialogDescription>
            You have unsaved progress that will be lost if you leave now. 
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleStay} className="w-full sm:w-auto">
            Stay & Continue
          </Button>
          <Button variant="destructive" onClick={handleLeave} className="w-full sm:w-auto">
            Leave Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitPopup;
