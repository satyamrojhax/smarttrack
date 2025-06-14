
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, TrendingUp, Users, Sparkles, Target, Award } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md w-full animate-fade-in">
        {/* Enhanced Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Axiom Smart Track</h1>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced illustration area */}
        <div className="mb-8 relative">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6 border border-white/30">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500/40 to-purple-600/40 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-indigo-500/40 to-indigo-600/40 backdrop-blur-sm rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Enhanced center button */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-4 shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex justify-center space-x-2">
              <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
                AI-Powered
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
                CBSE Focused
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-5 h-5 text-purple-200 mr-2" />
            <p className="text-sm text-purple-100 uppercase tracking-wide font-semibold">
              Axiom Smart Track
            </p>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
            AI-powered learning platform for <span className="text-purple-200">Class 10 CBSE</span>
          </h2>
          <p className="text-white/80 leading-relaxed mb-6">
            Track your syllabus progress, generate practice questions, and excel in your board exams with personalized AI assistance.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-left">
              <Users className="w-5 h-5 text-purple-200 mb-2" />
              <p className="text-sm text-white font-medium">Progress Tracking</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-left">
              <Brain className="w-5 h-5 text-blue-200 mb-2" />
              <p className="text-sm text-white font-medium">AI Questions</p>
            </div>
          </div>
        </div>

        {/* Enhanced Get Started Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-white to-purple-50 text-purple-600 hover:from-purple-50 hover:to-white py-4 rounded-2xl font-semibold text-lg shadow-xl border-2 border-white/20 transform hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Get Started
        </Button>
      </div>

      {/* Enhanced Footer */}
      <div className="absolute bottom-6 text-center text-white/60 text-sm">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
          <p>Designed & Developed by <span className="font-semibold text-white/80">Satyam Rojha</span></p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
