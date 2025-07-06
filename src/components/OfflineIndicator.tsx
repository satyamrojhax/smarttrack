
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';
import { useDeviceCapabilities } from '@/hooks/use-mobile';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const { isStandalone } = useDeviceCapabilities();

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isStandalone ? 'pt-safe-area-inset-top' : ''}`}>
      <Card className="bg-orange-500 text-white border-none rounded-none shadow-lg">
        <CardContent className="py-2 px-4">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineIndicator;
