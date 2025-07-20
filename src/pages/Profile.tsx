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
    <div className="min-h-screen bg-gradient-bg pb-28">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile
            </h1>
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6 space-y-6">
        {/* User Info Card */}
        <Card className="shadow-soft animate-fade-in rounded-3xl">
          <CardContent className="p-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-6">
              <AvatarFallback className="bg-gradient-primary text-white text-3xl font-bold">
                AB
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2">Anonymous Butterfly</h2>
            <p className="text-muted-foreground text-sm mb-6">Wellness Journey Since March 2024</p>
            
            <div className="bg-gradient-primary p-6 rounded-2xl text-white">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Star className="h-6 w-6" />
                <span className="text-xl font-bold">Level {userLevel}</span>
              </div>
              <Progress value={(userXP / nextLevelXP) * 100} className="mb-3" />
              <p className="text-sm opacity-90">
                {userXP} / {nextLevelXP} XP to Level {userLevel + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Metrics */}
        <Card className="shadow-soft animate-fade-in rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-wellness" />
              <span>Wellness Evolution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {wellnessMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span className="text-muted-foreground font-medium">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-soft animate-fade-in text-center rounded-3xl">
            <CardContent className="p-6">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-primary mb-1">{stats.postsCreated}</p>
              <p className="text-xs text-muted-foreground font-medium">Posts Created</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center rounded-3xl">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-wellness mx-auto mb-3" />
              <p className="text-2xl font-bold text-wellness mb-1">{stats.communitiesJoined}</p>
              <p className="text-xs text-muted-foreground font-medium">Communities</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center rounded-3xl">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
              <p className="text-2xl font-bold text-accent mb-1">{stats.helpfulInteractions}</p>
              <p className="text-xs text-muted-foreground font-medium">Helpful Actions</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in text-center rounded-3xl">
            <CardContent className="p-6">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-2xl font-bold text-primary mb-1">{stats.daysActive}</p>
              <p className="text-xs text-muted-foreground font-medium">Days Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="shadow-soft animate-fade-in rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-accent" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 ${
                  achievement.earned
                    ? 'bg-gradient-wellness/10 border border-wellness/20'
                    : 'bg-muted/50'
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-2">
                      <Progress value={achievement.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
                {achievement.earned && (
                  <Badge className="bg-gradient-wellness text-white rounded-full px-3 py-1">
                    Earned
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft animate-fade-in rounded-3xl">
          <CardContent className="p-6 space-y-3">
            <Button variant="outline" className="w-full justify-start h-12 rounded-2xl">
              <User className="h-5 w-5 mr-3" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 rounded-2xl">
              <Settings className="h-5 w-5 mr-3" />
              App Settings
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 rounded-2xl">
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-wellness transition-all duration-300 z-20">
        <span className="text-2xl">👤</span>
      </Button>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Profile;