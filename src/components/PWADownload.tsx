
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Smartphone, Monitor, Chrome, Globe, Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWADownload: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    };

    setIsStandalone(checkStandalone());

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstalling(false);
      toast({
        title: "App Installed Successfully! 🎉",
        description: "Axiom Smart Track has been added to your device",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowDialog(true);
      return;
    }

    try {
      setIsInstalling(true);
      console.log('Triggering PWA install prompt');
      
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA install outcome:', outcome);
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing App...",
          description: "Axiom Smart Track is being installed automatically",
        });
      } else {
        setIsInstalling(false);
        toast({
          title: "Installation Cancelled",
          description: "You can install the app later using this button",
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('PWA installation failed:', error);
      setIsInstalling(false);
      setShowDialog(true);
    }
  };

  if (isStandalone) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-green-600 cursor-default"
      >
        <CheckCircle className="w-4 h-4" />
        <span className="hidden sm:inline">App Installed</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
        size="sm"
        disabled={isInstalling}
      >
        <Download className="w-4 h-4" />
        {isInstalling ? 'Installing...' : 'Download App'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Install Axiom Smart Track
            </DialogTitle>
            <DialogDescription>
              Install our app for offline access and better performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Download className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Axiom Smart Track</h3>
                <p className="text-sm text-muted-foreground">AI Study Assistant</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-medium">How to install:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <span className="text-muted-foreground">Look for "Install" or "Add to Home Screen" in your browser menu</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <span className="text-muted-foreground">Tap "Install" or "Add" when prompted</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <span className="text-muted-foreground">The app will appear on your home screen</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Plus className="w-3 h-3" />
                <span>Free • Works offline • No app store required</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWADownload;
