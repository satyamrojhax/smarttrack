
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { loginUser, signupUser } from '@/services/authService';
import { LoginData, SignupData } from '@/types/auth';
import { Mail, KeyRound, User, Eye, EyeOff, GraduationCap } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sharedEmail, setSharedEmail] = useState(''); // Shared email between forms
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    class: 'class-10', // Default to class 10
    board: 'cbse',     // Default to CBSE
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'login' | 'signup') => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
      if (name === 'email') {
        setSharedEmail(value);
      }
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
      if (name === 'email') {
        setSharedEmail(value);
      }
    }
  };

  const handleFormToggle = (newIsLogin: boolean) => {
    setIsLogin(newIsLogin);
    // Persist email between forms
    if (newIsLogin) {
      setLoginData(prev => ({ ...prev, email: sharedEmail }));
    } else {
      setSignupData(prev => ({ ...prev, email: sharedEmail }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(loginData);
      if (result.success) {
        toast({
          title: "Welcome Back! 🎉",
          description: "Successfully signed in to your account",
        });
        navigate('/');
      } else {
        toast({
          title: "Sign In Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signupUser(signupData);
      if (result.success) {
        toast({
          title: "Account Created! 🎉",
          description: "Please check your email to verify your account",
        });
        navigate('/email-verification');
      } else {
        toast({
          title: "Sign Up Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Smart Study Tracker
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Your intelligent companion for Class 10th CBSE success
          </p>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handleFormToggle(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleFormToggle(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? 'Welcome Back!' : 'Join Smart Study'}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
                {isLogin 
                  ? 'Sign in to continue your CBSE Class 10th journey' 
                  : 'Create your account for CBSE Class 10th success'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => handleInputChange(e, 'signup')}
                      disabled={isLoading}
                      className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={isLogin ? loginData.email : signupData.email}
                    onChange={(e) => handleInputChange(e, isLogin ? 'login' : 'signup')}
                    disabled={isLoading}
                    className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={isLogin ? loginData.password : signupData.password}
                    onChange={(e) => handleInputChange(e, isLogin ? 'login' : 'signup')}
                    disabled={isLoading}
                    className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
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
                {!isLogin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Please wait...
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Sign In to Dashboard' : 'Create Account'}
                    <GraduationCap className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => handleFormToggle(!isLogin)}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400 dark:text-gray-500">
          <p>Designed specifically for CBSE Class 10th students</p>
          <p className="mt-1">Secure authentication powered by advanced encryption</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
