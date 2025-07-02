
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, LogOut, BookOpen, Award, Mail, CheckCircle, Star, Trophy, Clock, Target, TrendingUp, Calendar, Users, Zap } from 'lucide-react';

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

  const achievements = [
    { name: "Study Streak", description: "7 days in a row", icon: CheckCircle, color: "bg-green-500" },
    { name: "Quick Learner", description: "Completed 10 topics", icon: Star, color: "bg-yellow-500" },
    { name: "Quiz Master", description: "Scored 90%+ in 5 quizzes", icon: Trophy, color: "bg-purple-500" },
    { name: "Time Manager", description: "Used study timer 20 times", icon: Clock, color: "bg-blue-500" },
    { name: "Consistent", description: "Login streak 30 days", icon: Calendar, color: "bg-indigo-500" },
    { name: "Social Learner", description: "Helped 10 students", icon: Users, color: "bg-pink-500" }
  ];

  const stats = [
    { label: "Study Sessions", value: "47", icon: Target, color: "text-blue-600", trend: "+12%" },
    { label: "Questions Solved", value: "234", icon: CheckCircle, color: "text-green-600", trend: "+8%" },
    { label: "Topics Completed", value: "18", icon: BookOpen, color: "text-purple-600", trend: "+23%" },
    { label: "Study Hours", value: "38", icon: Clock, color: "text-orange-600", trend: "+15%" }
  ];

  const recentActivity = [
    { action: "Completed Mathematics Quiz", time: "2 hours ago", score: "85%" },
    { action: "Generated Science Questions", time: "5 hours ago", count: "15 questions" },
    { action: "Study Session - Physics", time: "1 day ago", duration: "45 min" },
    { action: "Doubt Resolved - Chemistry", time: "2 days ago", topic: "Organic Compounds" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-gray-700">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Zap className="w-4 h-4 text-yellow-800" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">{profile.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">Class 10 CBSE Student</p>
          <div className="flex justify-center space-x-2">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              Active Learner
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm border-green-500 text-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Rising Star
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Enhanced Profile Information */}
        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
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
                    className="h-12"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-lg font-medium border">{profile.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="p-3 bg-muted rounded-lg flex items-center space-x-3 border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{profile.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Class</Label>
                  <div className="p-3 bg-muted rounded-lg flex items-center space-x-2 border">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Class 10</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Board</Label>
                  <div className="p-3 bg-muted rounded-lg flex items-center space-x-2 border">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">CBSE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Member Since</Label>
                <div className="p-3 bg-muted rounded-lg flex items-center space-x-2 border">
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
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1 h-11">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ name: profile.name });
                    }}
                    disabled={isLoading}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="flex-1 h-11">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Achievements */}
        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-accent/50 transition-colors group">
                  <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1">{activity.action}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs">{activity.score}</Badge>
                      )}
                      {activity.count && (
                        <Badge variant="outline" className="text-xs">{activity.count}</Badge>
                      )}
                      {activity.duration && (
                        <Badge variant="outline" className="text-xs">{activity.duration}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Actions */}
      <Card className="glass-card hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Account Settings</span>
          </CardTitle>
          <CardDescription>Manage your account preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex-1 sm:flex-none h-11"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
