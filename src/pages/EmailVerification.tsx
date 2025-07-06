
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, Brain, ArrowRight } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (token_hash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          });

          if (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            toast({
              title: "Verification Failed",
              description: error.message,
              variant: "destructive"
            });
          } else {
            setVerificationStatus('success');
            toast({
              title: "Email Verified Successfully! 🎉",
              description: "Your account has been verified. Welcome to Axiom Smart Track!",
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
          }
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast({
          title: "Verification Error",
          description: "An unexpected error occurred during verification.",
          variant: "destructive"
        });
      } finally {
        setIsVerifying(false);
      }
    };

    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/', { replace: true });
      return;
    }

    handleEmailVerification();
  }, [searchParams, navigate, user]);

  const handleReturnToDashboard = () => {
    navigate('/', { replace: true });
  };

  const handleGoToAuth = () => {
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mx-auto">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Email Verification
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Verifying your account
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {verificationStatus === 'loading' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Verifying your email...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please wait while we verify your account
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Email Verified Successfully! 🎉
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your account has been verified. Redirecting to dashboard...
                  </p>
                </div>
                <Button
                  onClick={handleReturnToDashboard}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The verification link may be invalid or expired. Please try signing up again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleGoToAuth}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <span>Back to Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
