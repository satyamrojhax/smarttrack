
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, LogOut, BookOpen, Award, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { profile, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateProfile({
        name: editData.name,
        class: 'class-10',
        board: 'cbse'
      });

      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-lg text-muted-foreground">Class 10 CBSE Student</p>
          <div className="flex justify-center space-x-2 mt-3">
            <Badge variant="secondary" className="px-3 py-1">
              <Award className="w-4 h-4 mr-1" />
              Student
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Information</span>
            </CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-10"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-lg font-medium">{profile.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Address</Label>
                <div className="p-3 bg-muted rounded-lg flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Class</Label>
                  <div className="p-3 bg-muted rounded-lg flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Class 10</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Board</Label>
                  <div className="p-3 bg-muted rounded-lg flex items-center space-x-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">CBSE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Member Since</Label>
                <div className="p-3 bg-muted rounded-lg flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ name: profile.name });
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Account Settings</span>
            </CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your account settings and preferences here.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
