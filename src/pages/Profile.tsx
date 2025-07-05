
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  Award, 
  Mail, 
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

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
          title: "Profile Updated Successfully! ✨",
          description: "Your profile information has been saved.",
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
      title: "Logged Out Successfully",
      description: "See you next time! 👋",
    });
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Profile Header */}
        <div className="relative">
          <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            <CardContent className="p-0">
              <div className="relative p-8 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border-4 border-white/30">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-xl text-white/90 mb-4">Class 10 CBSE Student</p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Award className="w-3 h-3 mr-1" />
                        Active Learner
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Progress Tracker
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                      <CardDescription>Manage your account details and preferences</CardDescription>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="h-11 border-2 focus:border-primary"
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg font-medium border-2 border-transparent">
                        {profile.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      Email Address
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border-2 border-transparent flex items-center">
                      <span className="text-sm">{profile.email}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">Verified</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                      Class
                    </Label>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 flex items-center">
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Class 10</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center">
                      <Award className="w-4 h-4 mr-2 text-muted-foreground" />
                      Board
                    </Label>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 flex items-center">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">CBSE</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      Member Since
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border-2 border-transparent flex items-center">
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator />
                    <div className="flex gap-3 pt-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={isLoading} 
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditData({ name: profile.name });
                        }}
                        disabled={isLoading}
                        className="flex-1 border-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-xs text-muted-foreground">Study Hours</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-muted-foreground">Notes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-xl border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-2 hover:bg-muted/50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-2 hover:bg-muted/50"
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Privacy & Security
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
