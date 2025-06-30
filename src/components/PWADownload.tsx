
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Smartphone, Monitor, Chrome, Safari, Firefox, Plus } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    };

    setIsStandalone(checkStandalone());

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing App...",
          description: "Axiom Smart Track is being installed on your device",
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Installation failed:', error);
      setShowDialog(true);
    }
  };

  const getBrowserIcon = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return Chrome;
    if (userAgent.includes('safari')) return Safari;
    if (userAgent.includes('firefox')) return Firefox;
    return Monitor;
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) return 'Chrome';
    if (userAgent.includes('safari')) return 'Safari';
    if (userAgent.includes('firefox')) return 'Firefox';
    return 'your browser';
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      return {
        icon: Safari,
        steps: [
          "1. Tap the Share button at the bottom of Safari",
          "2. Scroll down and tap 'Add to Home Screen'",
          "3. Tap 'Add' to confirm",
          "4. The app will appear on your home screen"
        ]
      };
    }

    if (isAndroid) {
      return {
        icon: Chrome,
        steps: [
          "1. Tap the three dots (⋮) in the top right corner",
          "2. Select 'Add to Home screen' or 'Install app'",
          "3. Tap 'Add' or 'Install' to confirm",
          "4. The app will appear on your home screen"
        ]
      };
    }

    return {
      icon: Monitor,
      steps: [
        "1. Look for the install icon in your address bar",
        "2. Click the install button when it appears",
        "3. Follow the prompts to install the app",
        "4. The app will be added to your applications"
      ]
    };
  };

  // Don't show the button if already installed
  if (isStandalone) {
    return null;
  }

  const BrowserIcon = getBrowserIcon();
  const instructions = getInstallInstructions();
  const InstructionIcon = instructions.icon;

  return (
    <>
      <Button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
        size="sm"
      >
        <Download className="w-4 h-4" />
        Download App
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Install Axiom Smart Track
            </DialogTitle>
            <DialogDescription>
              Install our app for the best experience with offline access and faster loading.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Axiom Smart Track</h3>
                <p className="text-sm text-muted-foreground">AI Study Assistant</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <InstructionIcon className="w-4 h-4" />
                How to install in {getBrowserName()}:
              </div>
              
              <div className="space-y-2">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{step.replace(/^\d+\.\s/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Plus className="w-3 h-3" />
                <span>Free • No app store required • Works offline</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWADownload;
