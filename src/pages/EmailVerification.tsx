
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailVerificationProps {
  email?: string;
  onBack?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onBack }) => {
  const navigate = useNavigate();
  
  const openGmail = () => {
    // Try to open Gmail app first, fallback to web version
    const gmailAppUrl = 'googlegmail://';
    const gmailWebUrl = 'https://mail.google.com';
    
    // Create a hidden link to test if Gmail app is available
    const link = document.createElement('a');
    link.href = gmailAppUrl;
    
    // Try to open Gmail app
    window.location.href = gmailAppUrl;
    
    // Fallback to web version after a short delay
    setTimeout(() => {
      window.open(gmailWebUrl, '_blank');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white rounded-3xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Check Your Email
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We've sent a verification link to {email || 'your email'}
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            <Button 
              onClick={openGmail}
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Open Gmail
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Click the verification link in your email to activate your account
              </p>
              
              {onBack && (
                <Button 
                  variant="outline"
                  onClick={onBack}
                  className="w-full h-12 rounded-xl"
                >
                  Back to Sign Up
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
