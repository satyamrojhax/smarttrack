
import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Star, BookOpen, Target, GraduationCap, Trophy, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const quotes = [
    "Master CBSE Class 10 with AI-powered learning",
    "Generate unlimited practice questions instantly",
    "Get step-by-step solutions for every problem",
    "Track your progress across all subjects",
    "Achieve excellence in your board exams",
    "Your personalized study companion awaits"
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 3500);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete, quotes.length]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex flex-col items-center justify-center transition-all duration-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-24 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-200"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/5 rounded-full animate-bounce delay-700"></div>
        
        {/* Floating Icons */}
        <BookOpen className="absolute top-32 left-1/3 w-8 h-8 text-white/20 animate-float" />
        <GraduationCap className="absolute top-24 right-1/3 w-10 h-10 text-white/25 animate-float delay-300" />
        <Trophy className="absolute bottom-40 left-1/4 w-8 h-8 text-white/20 animate-float delay-500" />
        <Target className="absolute bottom-28 right-1/4 w-6 h-6 text-white/15 animate-float delay-700" />
        <Zap className="absolute top-1/2 left-10 w-6 h-6 text-white/20 animate-float delay-1000" />
        <Star className="absolute top-1/2 right-12 w-7 h-7 text-white/25 animate-float delay-200" />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-6 max-w-2xl">
        {/* Logo with Enhanced Animation */}
        <div className="mb-10 relative">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl animate-pulse opacity-60"></div>
            <div className="relative p-8 bg-white/15 backdrop-blur-lg rounded-full border border-white/30 shadow-2xl animate-bounce">
              <Brain className="w-20 h-20 md:w-24 md:h-24 text-white animate-pulse" />
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                <Sparkles className="w-4 h-4 text-white animate-spin" />
              </div>
            </div>
          </div>
        </div>

        {/* App Title with Enhanced Typography */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in tracking-tight">
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Axiom Smart Track
          </span>
        </h1>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/90 font-semibold">
            AI Study Assistant
          </p>
          <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
        </div>

        {/* Enhanced Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-10">
          <GraduationCap className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-semibold text-lg">CBSE Class 10</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Rotating Quotes with Better Animation */}
        <div className="mb-12 h-20 flex items-center justify-center">
          <div className="max-w-lg mx-auto">
            <p className="text-xl md:text-2xl text-white/95 font-medium text-center leading-relaxed animate-fade-in">
              {quotes[currentQuote]}
            </p>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8 w-80 max-w-full mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/80 mt-3 text-sm font-medium">
            Loading your personalized learning experience... {progress}%
          </p>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-white/80 text-lg font-semibold">
            Powered By Axioms Product
          </p>
        </div>
        <p className="text-white/60 text-sm">
          Transforming education with artificial intelligence
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
