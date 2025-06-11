import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, BookOpen, Award, Brain, Info, LogOut, RotateCcw, Sun, Moon } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { subjects, getOverallProgress, resetProgress } = useSyllabus();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    class: user?.class || '',
    board: user?.board || ''
  });

  const overallProgress = getOverallProgress();
  const totalChapters = subjects.reduce((total, subject) => total + subject.chapters.length, 0);
  const completedChapters = subjects.reduce(
    (total, subject) => total + subject.chapters.filter(chapter => chapter.completed).length,
    0
  );

  const handleSaveProfile = () => {
    // In a real app, this would update the user in the backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
    setIsEditing(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all syllabus progress? This action cannot be undone.')) {
      resetProgress();
      toast({
        title: "Progress Reset",
        description: "All syllabus progress has been reset",
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    }
  };

  const getProgressBadge = (progress: number) => {
    if (progress >= 90) return { variant: 'default' as const, text: 'Excellent', color: 'text-green-600' };
    if (progress >= 75) return { variant: 'default' as const, text: 'Good', color: 'text-blue-600' };
    if (progress >= 50) return { variant: 'secondary' as const, text: 'Average', color: 'text-yellow-600' };
    return { variant: 'outline' as const, text: 'Needs Work', color: 'text-red-600' };
  };

  const progressBadge = getProgressBadge(overallProgress);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:ml-64 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center space-x-2">
          <User className="w-8 h-8" />
          <span>Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account and track your learning progress
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Your personal details and academic information
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={editedUser.class} onValueChange={(value) => setEditedUser(prev => ({ ...prev, class: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Class 10">Class 10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="board">Board</Label>
                <Select value={editedUser.board} onValueChange={(value) => setEditedUser(prev => ({ ...prev, board: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button onClick={handleSaveProfile} className="w-full">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="text-lg font-medium">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="text-lg font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Class</Label>
                  <p className="text-lg font-medium">{user?.class}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Board</Label>
                  <p className="text-lg font-medium">{user?.board}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Study Progress</span>
          </CardTitle>
          <CardDescription>
            Your overall learning progress and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <Badge variant={progressBadge.variant} className={progressBadge.color}>
                {progressBadge.text}
              </Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{completedChapters}</div>
              <p className="text-sm text-muted-foreground">Chapters Completed</p>
              <Badge variant="outline">{totalChapters} Total</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">{subjects.length}</div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <Badge variant="secondary">CBSE Curriculum</Badge>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Subject-wise Progress</h4>
            {subjects.map((subject) => {
              const subjectCompleted = subject.chapters.filter(chapter => chapter.completed).length;
              const subjectProgress = (subjectCompleted / subject.chapters.length) * 100;
              
              return (
                <div key={subject.id} className="flex items-center space-x-3">
                  <span className="text-lg">{subject.icon}</span>
                  <span className="text-sm font-medium w-20">{subject.name}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                      style={{ width: `${subjectProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {Math.round(subjectProgress)}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
          <CardDescription>
            Customize your app experience and manage your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5" />
              <div>
                <p className="font-medium">Reset Progress</p>
                <p className="text-sm text-muted-foreground">
                  Clear all syllabus completion data
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleResetProgress}
              className="text-red-600 hover:text-red-700"
            >
              Reset
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About & Credits */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>About Axiom Smart Track</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold gradient-text">Axiom Smart Track - AI Study Assistant</h3>
            <p className="text-muted-foreground">
              Powered by Axioms Product for intelligent question generation and study recommendations
            </p>
          </div>

          <div className="border-t pt-4 space-y-2 text-center text-sm text-muted-foreground">
            <p className="font-medium">Designed & Developed by Satyam Rojha</p>
            <div className="space-y-1">
              <p>📧 axiomsproduct@gmail.com</p>
              <p>📞 +91 8092710478</p>
            </div>
            <p className="text-xs">© 2024 Axiom Smart Track. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
