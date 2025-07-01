
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Smartphone, CheckCircle, Install, Globe } from 'lucide-react';
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
  const [installSupported, setInstallSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    };

    const checkInstallSupport = () => {
      return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
    };

    setIsStandalone(checkStandalone());
    setInstallSupported(checkInstallSupport());

    // Register service worker for better PWA support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('[PWA] New service worker available');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast({
                    title: "App Updated! 🎉",
                    description: "New features available. Refresh to update.",
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show a subtle notification that the app can be installed
      toast({
        title: "App Ready to Install! 📱",
        description: "Click the Download App button to install Axiom Smart Track",
      });
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstalling(false);
      setIsStandalone(true);
      
      toast({
        title: "Successfully Installed! 🎉",
        description: "Axiom Smart Track is now installed on your device",
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
      console.log('[PWA] Triggering install prompt');
      
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] Install outcome:', outcome);
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing App... ⚡",
          description: "Axiom Smart Track is being installed",
        });
      } else {
        setIsInstalling(false);
        toast({
          title: "Installation Cancelled",
          description: "You can install the app anytime using the Download button",
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
      setIsInstalling(false);
      setShowDialog(true);
    }
  };

  if (isStandalone) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-green-600 dark:text-green-400 cursor-default hover:bg-green-50 dark:hover:bg-green-900/20"
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
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        size="sm"
        disabled={isInstalling}
      >
        {isInstalling ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Installing...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {isInstallable ? 'Install App' : 'Download'}
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Install Axiom Smart Track
            </DialogTitle>
            <DialogDescription>
              Get the full app experience with offline access and faster performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Install className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Axiom Smart Track</h3>
                <p className="text-sm text-muted-foreground">AI Study Assistant for CBSE Class 10</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <p className="font-semibold text-center">How to install on your device:</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">On Chrome/Edge Mobile:</p>
                    <p className="text-muted-foreground">Tap the menu (⋮) → "Add to Home screen" or "Install app"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">On Safari (iOS):</p>
                    <p className="text-muted-foreground">Tap Share button → "Add to Home Screen"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">On Desktop:</p>
                    <p className="text-muted-foreground">Look for install icon in address bar or browser menu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-purple-500" />
                  <span>Native Experience</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWADownload;
