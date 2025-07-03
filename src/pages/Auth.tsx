
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ChevronLeft, Brain } from 'lucide-react';
import EmailVerification from './EmailVerification';

interface AuthProps {
  onBack?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
        if (!formData.name) {
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
          class: 'class-10',
          board: 'cbse'
        });
        
        if (result.success) {
          setUserEmail(formData.email);
          setShowVerificationMessage(true);
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
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
      <EmailVerification 
        email={userEmail}
        onBack={() => {
          setShowVerificationMessage(false);
          setFormData(prev => ({ ...prev, password: '' }));
        }}
      />
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
              {!isLogin && (
                <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
                  For Class 10 CBSE students
                </div>
              )}
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
