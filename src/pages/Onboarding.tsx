
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, Brain, TrendingUp } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <BookOpen className="w-20 h-20 text-purple-600" />,
      title: "Welcome to Axiom Smart Track",
      subtitle: "Your AI-powered study companion for Class 10 CBSE",
      description: "Track your syllabus progress, get personalized study plans, and excel in your board exams!"
    },
    {
      icon: <Brain className="w-20 h-20 text-blue-600" />,
      title: "AI Question Generator",
      subtitle: "Powered by Axioms Product",
      description: "Generate unlimited practice questions tailored to your curriculum and difficulty level"
    },
    {
      icon: <TrendingUp className="w-20 h-20 text-green-600" />,
      title: "Smart Progress Tracking",
      subtitle: "Monitor your journey to success",
      description: "Get AI-powered insights, marks prediction, and personalized study recommendations"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Skip Button */}
      <button 
        onClick={skipOnboarding}
        className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors"
      >
        Skip
      </button>

      {/* Main Content */}
      <div className="text-center max-w-md w-full animate-fade-in">
        <div className="mb-8 flex justify-center">
          {slides[currentSlide].icon}
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {slides[currentSlide].title}
        </h1>
        
        <h2 className="text-xl text-purple-100 mb-6">
          {slides[currentSlide].subtitle}
        </h2>
        
        <p className="text-white/90 mb-12 leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button 
          onClick={nextSlide}
          size="lg"
          className="bg-white text-purple-600 hover:bg-purple-50 transition-colors px-8 py-3 rounded-full shadow-lg"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-white/60 text-sm">
        <p>Designed & Developed by Satyam Rojha</p>
        <p>📧 axiomsproduct@gmail.com | 📞 +91 8092710478</p>
      </div>
    </div>
  );
};

export default Onboarding;
