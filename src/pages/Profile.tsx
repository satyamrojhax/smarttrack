
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } = '@/hooks/use-toast';
import { User, Mail, GraduationCap, School, Calendar, LogOut, Save, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    class: profile?.class || '',
    board: profile?.board || '',
  });

  const handleSave = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatClass = (className: string) => {
    return className.replace('class-', 'Class ');
  };

  const formatBoard = (board: string) => {
    return board.toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      setFormData({
                        name: profile.name,
                        class: profile.class,
                        board: profile.board,
                      });
                    }
                    setIsEditing(!isEditing);
                  }}
                  disabled={isLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                  {user.email_confirmed_at && (
                    <Badge variant="secondary" className="ml-auto">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {!user.email_confirmed_at && (
                  <Alert>
                    <AlertDescription>
                      Please verify your email address to secure your account.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Class</Label>
                  {isEditing ? (
                    <Select
                      value={formData.class}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class-9">Class 9</SelectItem>
                        <SelectItem value="class-10">Class 10</SelectItem>
                        <SelectItem value="class-11">Class 11</SelectItem>
                        <SelectItem value="class-12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span>{formatClass(profile.class)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Board</Label>
                  {isEditing ? (
                    <Select
                      value={formData.board}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, board: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cbse">CBSE</SelectItem>
                        <SelectItem value="icse">ICSE</SelectItem>
                        <SelectItem value="state">State Board</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
                      <School className="w-4 h-4 text-muted-foreground" />
                      <span>{formatBoard(profile.board)}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Type</span>
                <Badge variant="secondary">
                  {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Status</span>
                <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                  {user.email_confirmed_at ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Subjects Available</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
