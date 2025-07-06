
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, ArrowLeft, ExternalLink } from 'lucide-react';

const EmailVerifying: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenGmail = () => {
    window.open('https://gmail.com', '_blank');
  };

  const handleBackToSignIn = () => {
    navigate('/auth');
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
                Check Your Email
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                We've sent you a verification link
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Verify Your Email Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We've sent a verification link to your email address. Please click the link in your email to verify your account and complete the signup process.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleOpenGmail}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <Mail className="w-4 h-4 mr-2" />
                Open Gmail
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={handleBackToSignIn}
                variant="outline"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                📧 Didn't receive the email?
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes and refresh your inbox</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerifying;
