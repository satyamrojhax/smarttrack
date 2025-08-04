
import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Star, BookOpen, Target } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const quotes = [
    "Excellence is not a skill, it's an attitude.",
    "Learning never exhausts the mind.",
    "Education is the passport to the future.",
    "Success is the sum of small efforts repeated daily.",
    "Knowledge is power, but enthusiasm pulls the switch.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Study hard, dream big, achieve greatness.",
    "Every expert was once a beginner."
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 1500);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(timer);
    };
  }, [onComplete, quotes.length]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white/5 rounded-full animate-bounce delay-500"></div>
        <Sparkles className="absolute top-20 left-1/2 w-8 h-8 text-white/20 animate-spin" />
        <Star className="absolute bottom-40 left-1/4 w-6 h-6 text-white/30 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-6">
        {/* Logo with Animation */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl animate-bounce">
              <Brain className="w-16 h-16 md:w-20 md:h-20 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 animate-fade-in">
          Smart Track
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 font-medium animate-fade-in delay-200">
          AI Study Assistant
        </p>

        {/* Rotating Quotes */}
        <div className="mb-12 h-16 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <p className="text-lg md:text-xl text-white/90 font-medium text-center leading-relaxed animate-fade-in">
              "{quotes[currentQuote]}"
            </p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-white/70 mt-4 text-sm md:text-base">Loading your smart study space...</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/60 text-sm md:text-base font-medium">
          Powered By Axioms Product
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
