
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
import { User, Settings, BookOpen, Award, Brain, Info, LogOut, RotateCcw, Sun, Moon, Edit } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
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
    if (updateUser) {
      updateUser(editedUser);
    }
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile has been successfully updated",
    });
    setIsEditing(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all syllabus progress? This action cannot be undone.')) {
      resetProgress();
      toast({
        title: "Progress Reset ↻",
        description: "All syllabus progress has been reset",
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast({
        title: "Logged Out 👋",
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with Smart Track Branding */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Axiom Smart Track
            </h1>
            <p className="text-sm text-muted-foreground">AI Study Assistant</p>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">Manage your profile and track your learning progress</p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <Badge variant={progressBadge.variant} className={`${progressBadge.color} text-xs mt-2`}>
              {progressBadge.text}
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedChapters}</div>
            <p className="text-sm text-muted-foreground">Chapters Completed</p>
            <Badge variant="outline" className="text-xs mt-2">{totalChapters} Total</Badge>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{subjects.length}</div>
            <p className="text-sm text-muted-foreground">Subjects</p>
            <Badge variant="secondary" className="text-xs mt-2">CBSE Curriculum</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                  <p className="text-lg font-medium break-all">{user?.email}</p>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Subject Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const subjectCompleted = subject.chapters.filter(chapter => chapter.completed).length;
              const subjectProgress = (subjectCompleted / subject.chapters.length) * 100;
              
              return (
                <div key={subject.id} className="flex items-center space-x-3">
                  <span className="text-lg">{subject.icon}</span>
                  <span className="text-sm font-medium w-20 truncate">{subject.name}</span>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
            </div>
            <Button variant="outline" onClick={toggleTheme} size="sm">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5" />
              <div>
                <p className="font-medium">Reset Progress</p>
                <p className="text-sm text-muted-foreground">Clear all syllabus completion data</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleResetProgress}
              className="text-red-600 hover:text-red-700"
              size="sm"
            >
              Reset
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>About</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Powered by Axioms Product for intelligent question generation and study recommendations
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="font-medium">Designed & Developed by Satyam Rojha</p>
              <p>📧 axiomsproduct@gmail.com | 📞 +91 8092710478</p>
              <p>© 2025 Axiom Smart Track. All rights reserved.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
