
import React from 'react';
import { Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary/20 border-t-primary`}></div>
        <Brain className={`absolute inset-0 m-auto ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-primary animate-pulse`} />
      </div>
      <p className="text-muted-foreground animate-pulse font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
