import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, X, Sparkles, Zap, Star, ArrowRight } from 'lucide-react';

interface DomainMigrationPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  variant?: 'general' | 'questions' | 'quiz';
}

const DomainMigrationPopup: React.FC<DomainMigrationPopupProps> = ({
  isOpen,
  onClose,
  showCloseButton = true,
  title,
  description,
  variant = 'general'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const newDomainUrl = 'https://boardstrack.netlify.app';
  const downloadUrl = 'https://zlmemsesjpwtpxaznikg.supabase.co/storage/v1/object/sign/axiom-smart-track.apk/smarttrack.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MmQ1NTBmOS04YjIxLTQ4ZGItYWRjNy1iMDY2OWJjNjY4M2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJheGlvbS1zbWFydC10cmFjay5hcGsvc21hcnR0cmFjay5hcGsiLCJpYXQiOjE3NTM0NTE5NDUsImV4cCI6MTc4NDk4Nzk0NX0.XtMdHSF7_Exb-PFeVOKVqK4dtCoaRb2B2BvHpLY7oi0';

  const handleVisitNewDomain = () => {
    window.open(newDomainUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadApp = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'smarttrack.apk';
    link.click();
  };

  const getContent = () => {
    switch (variant) {
      case 'questions':
        return {
          title: title || '🎯 Want More CBSE Questions?',
          description: description || 'Generate unlimited CBSE-focused questions and access advanced features on our new domain!',
          features: [
            'CBSE-Specific Question Bank',
            'Advanced AI Analysis',
            'Exam Pattern Practice',
            'Performance Analytics'
          ],
          icon: <Sparkles className="w-6 h-6" />,
          gradient: 'from-purple-500 to-blue-500'
        };
      case 'quiz':
        return {
          title: title || '⚡ Enhanced Quiz Experience',
          description: description || 'Get the ultimate MCQ quiz experience with advanced features and better performance!',
          features: [
            'Instant Results',
            'Smart Difficulty Scaling',
            'Detailed Explanations',
            'Progress Tracking'
          ],
          icon: <Zap className="w-6 h-6" />,
          gradient: 'from-orange-500 to-red-500'
        };
      default:
        return {
          title: title || '🚀 We\'ve Moved to a New Domain!',
          description: description || 'Experience better performance and new features on our upgraded platform.',
          features: [
            'Faster Loading',
            'Better Performance',
            'New Features',
            'Enhanced Security'
          ],
          icon: <Star className="w-6 h-6" />,
          gradient: 'from-green-500 to-teal-500'
        };
    }
  };

  const content = getContent();

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={showCloseButton ? onClose : undefined}
    >
      <DialogContent className="max-w-lg mx-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
        
        <DialogHeader className="text-center space-y-4">
          <div className={`mx-auto p-3 bg-gradient-to-r ${content.gradient} rounded-full shadow-lg`}>
            {content.icon}
          </div>
          
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {content.title}
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {content.features.map((feature, index) => (
              <Card key={index} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* New Badge */}
          <div className="flex justify-center">
            <Badge className={`bg-gradient-to-r ${content.gradient} text-white px-4 py-1 text-sm font-semibold shadow-lg`}>
              🎉 Available Now
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVisitNewDomain}
              className={`w-full bg-gradient-to-r ${content.gradient} hover:shadow-lg text-white font-semibold py-3 text-base transition-all duration-200 hover:scale-105`}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit New Domain
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              onClick={handleDownloadApp}
              variant="outline"
              className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 text-base transition-all duration-200 hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Mobile App
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Secure • ⚡ Fast • 🎯 Better Experience
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DomainMigrationPopup;