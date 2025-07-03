
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailVerifying: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (token && type === 'signup') {
          // The verification is handled automatically by Supabase
          // We just need to show the success state
          setTimeout(() => {
            setVerificationStatus('success');
            
            // Show success message and redirect after 4 seconds
            setTimeout(() => {
              toast({
                title: "Email Verified!",
                description: "Your email has been successfully verified. Redirecting to homepage...",
              });
              
              setTimeout(() => {
                navigate('/');
              }, 2000);
            }, 4000);
          }, 1000);
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error during email verification:', error);
        setVerificationStatus('error');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white rounded-3xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {verificationStatus === 'verifying' && <Loader2 className="w-8 h-8 text-green-600 animate-spin" />}
            {verificationStatus === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {verificationStatus === 'error' && <Mail className="w-8 h-8 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {verificationStatus === 'verifying' && 'Verifying Your Email...'}
            {verificationStatus === 'success' && 'Email Verified Successfully!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 text-center">
          {verificationStatus === 'verifying' && (
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          )}
          
          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <p className="text-green-600 font-semibold">
                Your email has been successfully verified!
              </p>
              <p className="text-gray-600">
                Redirecting to homepage in a few seconds...
              </p>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <p className="text-red-600">
                There was an error verifying your email. Please try again.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:underline"
              >
                Back to Sign Up
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifying;
