
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, TrendingUp, Users } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Axiom Smart Track</h1>
          <div className="w-12 h-1 bg-white/60 mx-auto rounded-full"></div>
        </div>

        {/* Illustration area */}
        <div className="mb-8 relative">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="bg-white/30 rounded-2xl p-4">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div className="bg-white/30 rounded-2xl p-4">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="bg-white/30 rounded-2xl p-4">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Add button in center */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-purple-500 rounded-full p-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className="text-sm text-purple-100 mb-4 uppercase tracking-wide">Axiom Smart Track</p>
          <h2 className="text-2xl font-bold text-white mb-4">
            AI-powered learning platform for Class 10 CBSE
          </h2>
          <p className="text-white/80 leading-relaxed">
            Track your syllabus progress, generate practice questions, and excel in your board exams with personalized AI assistance.
          </p>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full bg-white text-purple-600 hover:bg-purple-50 py-4 rounded-2xl font-semibold text-lg shadow-lg"
        >
          Get Started
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-white/60 text-sm">
        <p>Designed & Developed by Satyam Rojha</p>
      </div>
    </div>
  );
};

export default Landing;
