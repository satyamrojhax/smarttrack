
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, BookOpen, Target, TrendingUp, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Generate unlimited practice questions tailored to CBSE Class 10 syllabus',
      color: 'from-purple-400 to-pink-600'
    },
    {
      icon: Target,
      title: 'Smart Progress Tracking',
      description: 'Track your learning journey with detailed analytics and insights',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Marks Prediction',
      description: 'AI-powered predictions to help you achieve your target scores',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Complete Syllabus',
      description: 'Comprehensive coverage of all CBSE Class 10 subjects',
      color: 'from-orange-400 to-red-600'
    }
  ];

  const benefits = [
    'Unlimited AI-generated practice questions',
    'Real-time progress tracking',
    'Personalized study recommendations',
    'Exam-focused preparation',
    'Mobile-friendly interface',
    'Completely free to use'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-ping"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mr-3 shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg md:text-xl">Axiom Smart Track</span>
            <p className="text-white/70 text-xs hidden sm:block">AI Study Assistant</p>
          </div>
        </div>
        <div className="text-white/60 text-sm hidden md:block">
          Class 10 CBSE Preparation
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Achievement Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">Trusted by 10,000+ Students</span>
        </div>

        {/* Main Heading */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Master Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Board Exams
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-6">
            AI-powered learning platform designed specifically for Class 10 CBSE students. 
            Generate unlimited practice questions, track progress, and boost your exam scores.
          </p>
          
          {/* Quick Benefits */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Free Forever', 'AI-Powered', 'CBSE Aligned', 'Mobile Ready'].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="space-y-6 mb-8">
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 group"
          >
            <Sparkles className="w-5 md:w-6 h-5 md:h-6 mr-2 group-hover:animate-spin" />
            Start Learning Now
            <ArrowRight className="w-5 md:w-6 h-5 md:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-white/60 text-sm">Free to use • No registration required • Start immediately</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div key={index} className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 delay-${index * 100}`}>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Why Choose Axiom Smart Track?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="relative z-10 text-center py-6 md:py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-4 md:px-6 py-3 md:py-4 inline-block border border-white/10 mx-4">
          <p className="text-white/70 text-sm mb-2">
            Crafted with ❤️ by <span className="font-semibold text-white">Satyam Rojha</span>
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-white/50">
            <span>© 2024 Axioms Product</span>
            <span>•</span>
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
