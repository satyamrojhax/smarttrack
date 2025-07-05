
import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Star, BookOpen, Target, Zap, Trophy, Rocket } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const quotes = [
    "Master CBSE Class 10 with AI-powered learning",
    "Previous Year Questions at your fingertips",
    "Smart practice for smarter results",
    "Your personal study companion",
    "Excellence through intelligent preparation",
    "Transform your learning journey today",
    "AI-driven insights for academic success",
    "Practice smart, score higher"
  ];

  const features = [
    { icon: Brain, text: "AI-Powered Learning" },
    { icon: BookOpen, text: "CBSE Pattern Questions" },
    { icon: Target, text: "Targeted Practice" },
    { icon: Trophy, text: "Track Progress" }
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Quote rotation
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 1200);

    // Complete after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 4000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete, quotes.length]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center transition-all duration-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400/10 rounded-full animate-bounce blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-400/5 rounded-full animate-pulse delay-1000 blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 bg-indigo-400/10 rounded-full animate-bounce delay-500 blur-lg"></div>
        
        {/* Floating Icons */}
        <Sparkles className="absolute top-32 left-1/2 w-6 h-6 text-yellow-300/30 animate-spin slow-spin" />
        <Star className="absolute bottom-48 left-1/4 w-4 h-4 text-white/40 animate-pulse" />
        <Zap className="absolute top-48 right-1/4 w-5 h-5 text-blue-300/30 animate-bounce" />
        <Rocket className="absolute bottom-60 right-1/3 w-6 h-6 text-purple-300/30 animate-pulse delay-300" />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-6 max-w-2xl mx-auto">
        {/* Logo with Enhanced Animation */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl animate-pulse opacity-30"></div>
            <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl animate-bounce-slow">
              <Brain className="w-20 h-20 md:w-24 md:h-24 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin-slow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* App Title with Gradient */}
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 mb-4 animate-fade-in">
          Axiom Smart Track
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-semibold animate-fade-in delay-200">
          AI Study Assistant for CBSE Class 10
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in delay-300">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <feature.icon className="w-6 h-6 text-white/80 mb-2" />
              <span className="text-xs text-white/70 text-center">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Quotes */}
        <div className="mb-8 h-20 flex items-center justify-center animate-fade-in delay-400">
          <div className="max-w-lg mx-auto">
            <p className="text-lg md:text-xl text-white/90 font-medium text-center leading-relaxed transform transition-all duration-500">
              "{quotes[currentQuote]}"
            </p>
          </div>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="mb-8 animate-fade-in delay-500">
          <div className="flex justify-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce delay-200"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-white/70 mt-3 text-sm md:text-base">
            Preparing your smart study environment... {loadingProgress}%
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center animate-fade-in delay-600">
        <p className="text-white/60 text-sm md:text-base font-medium">
          Powered By Axioms Product
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
