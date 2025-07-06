
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenGmail = () => {
    // Try to open Gmail app on mobile first
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // Try Gmail app on iOS
      window.location.href = 'googlegmail://';
      // Fallback to web Gmail after a short delay
      setTimeout(() => {
        window.open('https://mail.google.com', '_blank');
      }, 1000);
    } else if (isAndroid) {
      // Try Gmail app on Android
      window.location.href = 'intent://mail.google.com#Intent;scheme=https;package=com.google.android.gm;end';
      // Fallback to web Gmail
      setTimeout(() => {
        window.open('https://mail.google.com', '_blank');
      }, 1000);
    } else {
      // Desktop - open web Gmail
      window.open('https://mail.google.com', '_blank');
    }
  };

  const handleBackToSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={handleOpenGmail}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Open Gmail
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Didn't receive the email? Check your spam folder or</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleBackToSignIn}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
