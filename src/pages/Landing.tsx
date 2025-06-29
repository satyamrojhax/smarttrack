
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Sparkles } from 'lucide-react';

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
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <Logo size="lg" className="text-white" />
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {/* Logo in hero section */}
        <div className="mb-8">
          <Logo size="xl" className="text-white justify-center" />
        </div>

        {/* Main Heading */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Board Exams
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            AI-powered learning platform for Class 10 CBSE students
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Get Started
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
