
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, X, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AppRating = () => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const hasRated = localStorage.getItem('app-rated');
    const installDate = localStorage.getItem('app-install-date') || Date.now().toString();
    const daysSinceInstall = (Date.now() - parseInt(installDate)) / (1000 * 60 * 60 * 24);

    if (!hasRated && daysSinceInstall > 3) {
      setTimeout(() => setShowRating(true), 60000); // Show after 1 minute
    }
  }, []);

  const handleRating = (stars: number) => {
    setRating(stars);
    localStorage.setItem('app-rated', 'true');
    
    if (stars >= 4) {
      toast({
        title: "Thank you! ⭐",
        description: "We appreciate your feedback! Consider rating us on the app store.",
      });
    } else {
      toast({
        title: "Thanks for the feedback! 💭",
        description: "We're working hard to improve your experience.",
      });
    }
    
    setShowRating(false);
  };

  const handleDismiss = () => {
    setShowRating(false);
    localStorage.setItem('app-rating-dismissed', Date.now().toString());
  };

  if (!showRating) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-80">
      <Card className="shadow-2xl border-2 border-yellow-500/20 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">Enjoying the app?</CardTitle>
                <CardDescription className="text-xs">
                  Rate your experience with us
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDismiss}
              className="flex-1 text-xs"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppRating;
