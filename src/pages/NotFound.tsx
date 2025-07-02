
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="pb-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">404</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              The page you're looking for doesn't exist.
            </p>
            <p className="text-sm text-gray-500">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Looking for something specific?</p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              <Search className="w-4 h-4 mr-1" />
              Explore Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
