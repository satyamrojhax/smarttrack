
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, TrendingUp, Users, Sparkles, Target, Award, CheckCircle, Star } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mr-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Axiom Smart Track</span>
        </div>
        <div className="flex space-x-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            AI-Powered Learning
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-purple-200 font-medium tracking-wide">CBSE Class 10 Excellence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Board Exams
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            AI-powered learning platform designed specifically for Class 10 CBSE students. 
            Track progress, generate practice questions, and achieve your academic goals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-xl p-3 w-fit mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Smart Syllabus Tracking</h3>
            <p className="text-white/70 text-sm">Monitor your progress across all subjects with intelligent tracking</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl p-3 w-fit mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">AI Question Generator</h3>
            <p className="text-white/70 text-sm">Generate unlimited practice questions tailored to your needs</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="bg-gradient-to-br from-pink-500/40 to-pink-600/40 rounded-xl p-3 w-fit mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Performance Analytics</h3>
            <p className="text-white/70 text-sm">Get detailed insights and predictions for your board exams</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-10 border border-white/10 max-w-2xl w-full">
          <h3 className="text-white font-bold text-2xl mb-6 text-center">Why Choose Axiom Smart Track?</h3>
          <div className="space-y-4">
            <div className="flex items-center text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Personalized learning path for each student</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>AI-powered question generation and doubt resolution</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Complete CBSE Class 10 syllabus coverage</span>
            </div>
            <div className="flex items-center text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span>Real-time progress tracking and performance analytics</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start Your Journey
          </Button>
          <p className="text-white/60 text-sm">Free to use • No credit card required</p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/10">
          <p className="text-white/70 text-sm">
            Crafted with ❤️ by <span className="font-semibold text-white">Satyam Rojha</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
