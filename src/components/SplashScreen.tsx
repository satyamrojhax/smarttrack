
import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const quotes = [
    "Knowledge is power, education is freedom.",
    "The future belongs to those who learn today.",
    "Smart learning, smarter results.",
    "Your success journey starts here.",
    "AI-powered education for tomorrow's leaders."
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 1000);

    const splashTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4000);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(splashTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Logo Animation */}
      <div className="flex flex-col items-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          <div className="relative bg-white/30 backdrop-blur-sm rounded-full p-8 shadow-2xl">
            <Brain className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight animate-scale-in">
            Axiom Smart Track
          </h1>
          <p className="text-lg text-white/80 font-medium animate-fade-in">
            AI Study Assistant
          </p>
        </div>

        {/* Animated Quote */}
        <div className="text-center max-w-md px-4">
          <p className="text-white/90 text-base md:text-lg italic animate-fade-in min-h-[50px] flex items-center justify-center">
            "{quotes[currentQuote]}"
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Powered By Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/60 text-sm font-medium">
          Powered By Axioms Product
        </p>
        <div className="w-16 h-0.5 bg-white/30 mx-auto mt-2"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
