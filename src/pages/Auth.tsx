
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
import { Eye, EyeOff, Mail, Lock, User, Brain, Download, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

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

  const handleDownloadApp = async () => {
    try {
      toast({
        title: "Downloading App...",
        description: "Starting download of Axiom Smart Track APK",
      });

      const apkUrl = 'https://zlmemsesjpwtpxaznikg.supabase.co/storage/v1/object/sign/axiom-smart-track.apk/smarttrack.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MmQ1NTBmOS04YjIxLTQ4ZGItYWRjNy1iMDY2OWJjNjY4M2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJheGlvbS1zbWFydC10cmFjay5hcGsvc21hcnR0cmFjay5hcGsiLCJpYXQiOjE3NTE3OTAxNTYsImV4cCI6MTc4MzMyNjE1Nn0.M_Y-6arMzf8NGHPd1sC4uoMdAn7z7dcUVtHPPBLxCrY';

      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'axiom-smart-track.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started! 📱",
        description: "APK file is downloading. Install and enjoy the app!",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      const redirectUrl = `${window.location.origin}/email-verification`;
      
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
          title: "Account Created! 🚀",
          description: "Please check your email to verify your account.",
        });
        navigate('/email-verifying');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Axiom Smart Track
              </h1>
              <p className="text-xs text-muted-foreground">🤖 AI Study Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={handleDownloadApp}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <div className="text-xs text-muted-foreground font-medium hidden sm:block">
              🇮🇳 Made in India
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center p-4 pt-20 sm:pt-24">
        <div className="w-full max-w-md">
          {/* Enhanced Background Card */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-500/20 to-red-500/20 rounded-3xl blur-3xl transform -rotate-6 scale-110"></div>
          
          <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm relative z-10 rounded-2xl">
            <CardHeader className="space-y-4 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4 mx-auto">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome to Smart Learning
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  Your AI-powered study companion for CBSE Class 10
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl h-12">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium text-sm sm:text-base h-10"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium text-sm sm:text-base h-10"
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
                          className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl text-sm sm:text-base"
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
                          className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 rounded-xl text-sm sm:text-base"
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
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-sm sm:text-base"
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
                          className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl text-sm sm:text-base"
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
                          className="pl-10 h-12 border-2 focus:border-purple-500 rounded-xl text-sm sm:text-base"
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
                          className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 rounded-xl text-sm sm:text-base"
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
                      className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-sm sm:text-base"
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

              {/* Enhanced Footer */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure & Privacy Protected</span>
                </div>
                
                {/* Enhanced Download Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleDownloadApp}
                    variant="outline"
                    className="w-full bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 text-orange-700 hover:text-orange-800 h-12 rounded-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Mobile App
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
