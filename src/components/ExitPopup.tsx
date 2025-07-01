
import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LogOut, Home } from 'lucide-react';

const ExitPopup: React.FC = () => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      
      if (backPressCount === 0) {
        setBackPressCount(1);
        // Reset counter after 2 seconds
        timer = setTimeout(() => {
          setBackPressCount(0);
        }, 2000);
      } else if (backPressCount === 1) {
        setShowExitDialog(true);
        setBackPressCount(0);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    // Add a dummy history entry to catch back button
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timer) clearTimeout(timer);
    };
  }, [backPressCount]);

  const handleExit = () => {
    try {
      // For PWA apps
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          window.close();
        });
      }
      
      // For regular browsers
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Try to close the window/tab
        window.close();
      }
      
      // If nothing works, redirect to a blank page
      setTimeout(() => {
        window.location.href = 'about:blank';
      }, 1000);
    } catch (error) {
      console.log('Exit failed:', error);
      // Fallback: navigate to home
      window.location.href = '/';
    }
  };

  const handleStay = () => {
    setShowExitDialog(false);
    // Push a new state to maintain the back button behavior
    window.history.pushState(null, '', window.location.href);
  };

  return (
    <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <AlertDialogContent className="w-[90%] max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-red-500" />
            Exit Axiom Smart Track?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave? Your progress will be saved automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleStay} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Stay & Study
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExit} className="bg-red-500 hover:bg-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Exit App
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitPopup;
