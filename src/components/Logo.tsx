
import React from 'react';
import { Brain } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      container: 'p-1',
      text: 'text-sm',
      spacing: 'space-x-1.5'
    },
    md: {
      icon: 'w-5 h-5',
      container: 'p-1.5 sm:p-2',
      text: 'text-sm sm:text-base',
      spacing: 'space-x-2'
    },
    lg: {
      icon: 'w-6 h-6',
      container: 'p-2',
      text: 'text-lg',
      spacing: 'space-x-3'
    },
    xl: {
      icon: 'w-8 h-8',
      container: 'p-3',
      text: 'text-xl',
      spacing: 'space-x-4'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${classes.spacing} ${className}`}>
      <div className={`${classes.container} bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg`}>
        <Brain className={`${classes.icon} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${classes.text} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            Axiom Smart Track
          </h1>
          {size === 'lg' || size === 'xl' ? (
            <p className="text-xs text-muted-foreground">AI Study Assistant</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Logo;
