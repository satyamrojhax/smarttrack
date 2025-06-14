
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ChevronLeft, Brain, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthProps {
  onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    className: '',
    board: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login({ email: formData.email, password: formData.password });
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to Axiom Smart Track",
          });
        } else {
          toast({
            title: "Login Failed",
            description: result.error || "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        if (!formData.name || !formData.className || !formData.board) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return;
        }
        
        const result = await signup({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          class: formData.className, 
          board: formData.board 
        });
        
        if (result.success) {
          setShowVerificationMessage(true);
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account before logging in.",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: result.error || "Failed to create account. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 4) return { strength: 'weak', color: 'text-red-500' };
    if (password.length < 8) return { strength: 'medium', color: 'text-yellow-500' };
    return { strength: 'strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white rounded-3xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a verification link to {formData.email}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Click the verification link in your email to activate your account, then return here to sign in.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => {
                setShowVerificationMessage(false);
                setIsLogin(true);
                setFormData(prev => ({ ...prev, password: '' }));
              }}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
            >
              Back to Sign In
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the email?{' '}
                <button
                  type="button"
                  onClick={() => setShowVerificationMessage(false)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col">
      {/* Header with centered logo */}
      <div className="flex items-center justify-center p-6 text-white relative">
        {onBack && (
          <button onClick={onBack} className="absolute left-6 p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <div className="flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-3">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Axiom Smart Track</h1>
        </div>
        <div className="absolute right-6">
          {!isLogin && (
            <button 
              onClick={() => setIsLogin(true)}
              className="text-white/80 hover:text-white text-sm hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
            >
              Sign in
            </button>
          )}
          {isLogin && (
            <button 
              onClick={() => setIsLogin(false)}
              className="text-white/80 hover:text-white text-sm hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
            >
              Sign up
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Card className="bg-white rounded-3xl border-0 shadow-2xl overflow-hidden backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Get started free.'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? 'Enter your details below' 
                  : 'Free forever. No credit card needed.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isLogin && formData.password && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.strength === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength.strength === 'medium' ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="class" className="text-sm font-medium text-gray-700">Class</Label>
                      <Select value={formData.className} onValueChange={(value) => handleInputChange('className', value)}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors">
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class-9">Class 9</SelectItem>
                          <SelectItem value="class-10">Class 10</SelectItem>
                          <SelectItem value="class-11">Class 11</SelectItem>
                          <SelectItem value="class-12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="board" className="text-sm font-medium text-gray-700">Board</Label>
                      <Select value={formData.board} onValueChange={(value) => handleInputChange('board', value)}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors">
                          <SelectValue placeholder="Select your board" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbse">CBSE</SelectItem>
                          <SelectItem value="icse">ICSE</SelectItem>
                          <SelectItem value="state">State Board</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg mt-6 transform hover:scale-105 transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
