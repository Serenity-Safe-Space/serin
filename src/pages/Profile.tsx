import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  TrendingUp, 
  Heart, 
  Users, 
  MessageSquare, 
  Award, 
  Calendar,
  Settings,
  HelpCircle,
  Star
} from 'lucide-react';
import ChatbotFloat from '@/components/ChatbotFloat';
import BottomNav from '@/components/BottomNav';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

interface WellnessMetric {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

const Profile = () => {
  const [userLevel] = useState(7);
  const [userXP] = useState(2150);
  const [nextLevelXP] = useState(2500);
  
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Post',
      description: 'Shared your first wellness post',
      icon: '📝',
      earned: true
    },
    {
      id: '2',
      title: 'Community Builder',
      description: 'Created your first support group',
      icon: '🏗️',
      earned: true
    },
    {
      id: '3',
      title: 'Helper Heart',
      description: 'Supported 50 community members',
      icon: '💝',
      earned: true
    },
    {
      id: '4',
      title: 'Mindful Streaker',
      description: 'Used the app for 7 days straight',
      icon: '🔥',
      earned: false,
      progress: 5
    },
    {
      id: '5',
      title: 'Wisdom Seeker',
      description: 'Read 100 wellness tips',
      icon: '📚',
      earned: false,
      progress: 73
    }
  ]);

  const [wellnessMetrics] = useState<WellnessMetric[]>([
    { label: 'Mood Stability', value: 78, maxValue: 100, color: 'bg-gradient-primary' },
    { label: 'Social Connection', value: 85, maxValue: 100, color: 'bg-gradient-wellness' },
    { label: 'Self-Care Habits', value: 62, maxValue: 100, color: 'bg-gradient-warm' },
    { label: 'Mindfulness Practice', value: 91, maxValue: 100, color: 'bg-gradient-primary' }
  ]);

  const [stats] = useState({
    postsCreated: 23,
    communitiesJoined: 5,
    helpfulInteractions: 147,
    daysActive: 45
  });

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile
            </h1>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-6 text-center">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                AB
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-1">Anonymous Butterfly</h2>
            <p className="text-muted-foreground text-sm mb-4">Wellness Journey Since March 2024</p>
            
            <div className="bg-gradient-primary p-4 rounded-lg text-white">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="h-5 w-5" />
                <span className="text-lg font-bold">Level {userLevel}</span>
              </div>
              <Progress value={(userXP / nextLevelXP) * 100} className="mb-2" />
              <p className="text-sm opacity-90">
                {userXP} / {nextLevelXP} XP to Level {userLevel + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Metrics */}
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-wellness" />
              <span>Wellness Evolution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wellnessMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span className="text-muted-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-soft animate-fade-in text-center">
            <CardContent className="p-4">
              <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stats.postsCreated}</p>
              <p className="text-xs text-muted-foreground">Posts Created</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center">
            <CardContent className="p-4">
              <Users className="h-6 w-6 text-wellness mx-auto mb-2" />
              <p className="text-2xl font-bold text-wellness">{stats.communitiesJoined}</p>
              <p className="text-xs text-muted-foreground">Communities</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center">
            <CardContent className="p-4">
              <Heart className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{stats.helpfulInteractions}</p>
              <p className="text-xs text-muted-foreground">Helpful Actions</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center">
            <CardContent className="p-4">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stats.daysActive}</p>
              <p className="text-xs text-muted-foreground">Days Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-accent" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  achievement.earned
                    ? 'bg-gradient-wellness/10 border border-wellness/20'
                    : 'bg-muted/50'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-1">
                      <Progress value={achievement.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
                {achievement.earned && (
                  <Badge className="bg-gradient-wellness text-white">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              App Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </Button>
          </CardContent>
        </Card>
      </main>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Profile;