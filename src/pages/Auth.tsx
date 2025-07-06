
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Brain, Sparkles, BookOpen, Trophy, Zap, ArrowRight, CheckCircle, Star } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign In Failed",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and click the verification link.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome Back! 🎉",
          description: "Successfully signed in to your account.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/verify-email`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
          setActiveTab('signin');
        } else {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome to Axiom Smart Track! 🚀",
          description: "Please check your email to verify your account before signing in.",
        });
        setActiveTab('signin');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Brain, title: "AI Study Assistant", desc: "Get instant answers to your doubts" },
    { icon: BookOpen, title: "Smart Questions", desc: "Generate practice questions instantly" },
    { icon: Trophy, title: "Track Progress", desc: "Monitor your learning journey" },
    { icon: Zap, title: "Study Timer", desc: "Focus with Pomodoro technique" }
  ];

  const testimonials = [
    { name: "Priya S.", grade: "Class 10", text: "Improved my Math scores by 40%!", rating: 5 },
    { name: "Arjun K.", grade: "Class 10", text: "The AI tutor is incredibly helpful!", rating: 5 },
    { name: "Sneha M.", grade: "Class 10", text: "Best study app for CBSE students!", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Axiom Smart Track
              </h1>
              <p className="text-xs text-muted-foreground">AI Study Assistant</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            🇮🇳 Made in India
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Features & Testimonials */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 space-y-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full">
                <Sparkles className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Trusted by 10,000+ students
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Master Class 10 CBSE with
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  AI-Powered Learning
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get personalized study assistance, instant doubt resolution, and smart practice questions tailored for CBSE Class 10 curriculum.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What students say:</h3>
              <div className="space-y-3">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{testimonial.text}"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      - {testimonial.name}, {testimonial.grade}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="space-y-4 pb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    Continue your learning journey
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <TabsTrigger 
                      value="signin" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 rounded-xl"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 rounded-xl"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure & Privacy Protected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Features - Show only on mobile */}
      <div className="lg:hidden px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <feature.icon className="w-6 h-6 text-purple-500 mb-2" />
              <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auth;
