
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailVerifying: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show verification success after 4 seconds
    const verificationTimer = setTimeout(() => {
      setIsVerified(true);
    }, 4000);

    // Redirect to homepage after 7 seconds total (3 seconds after showing success)
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 7000);

    return () => {
      clearTimeout(verificationTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            ) : (
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerified ? 'Email Verified!' : 'Verifying Your Email...'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {isVerified ? (
            <div className="space-y-2">
              <p className="text-green-600 dark:text-green-400 font-medium">
                Your email has been successfully verified!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting in a few seconds...
              </p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerifying;
