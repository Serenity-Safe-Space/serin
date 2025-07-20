import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, Clock, Search, Plus } from 'lucide-react';
import ChatbotFloat from '@/components/ChatbotFloat';
import SerinHelper from '@/components/SerinHelper';
import BottomNav from '@/components/BottomNav';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  type: 'support' | 'discussion' | 'activity';
  isLive?: boolean;
  lastActivity: string;
  tags: string[];
}

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'A safe space to share experiences and coping strategies for anxiety',
      members: 1247,
      type: 'support',
      lastActivity: '5 min ago',
      tags: ['anxiety', 'support', 'coping']
    },
    {
      id: '2',
      name: 'Mindful Living',
      description: 'Daily mindfulness practices and meditation discussions',
      members: 892,
      type: 'discussion',
      lastActivity: '12 min ago',
      tags: ['mindfulness', 'meditation', 'wellness']
    },
    {
      id: '3',
      name: 'Night Owls Unite',
      description: 'For those who find comfort in the quiet hours',
      members: 634,
      type: 'support',
      isLive: true,
      lastActivity: 'now',
      tags: ['insomnia', 'night', 'community']
    },
    {
      id: '4',
      name: 'Creative Therapy',
      description: 'Art, music, and writing as healing tools',
      members: 456,
      type: 'activity',
      lastActivity: '1h ago',
      tags: ['art', 'creativity', 'therapy']
    }
  ]);


  const getCommunityIcon = (type: Community['type']) => {
    switch (type) {
      case 'support':
        return '💙';
      case 'discussion':
        return '🧠';
      case 'activity':
        return '🎨';
      default:
        return '💬';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Communities
            </h1>
            <Button size="sm" className="bg-gradient-wellness rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl"
            />
          </div>
        </div>
      </header>

      <SerinHelper page="communities" />

      <main className="max-w-lg mx-auto px-6 py-6 space-y-6">
        {communities.map((community) => (
          <Card key={community.id} className="shadow-soft animate-fade-in hover:shadow-glow transition-all duration-300 rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{getCommunityIcon(community.type)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {community.name}
                      {community.isLive && (
                        <Badge className="text-xs animate-pulse bg-gradient-warm text-white border-0 rounded-full">
                          LIVE
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    className="text-xs bg-gradient-hashtag text-primary-foreground border-0 rounded-full px-3 py-1 font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border/50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{community.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{community.lastActivity}</span>
                  </div>
                </div>
                
                <Button size="sm" className="bg-gradient-primary hover:shadow-glow rounded-full px-6">
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-wellness shadow-glow hover:shadow-wellness transition-all duration-300 z-20">
        <span className="text-2xl">🤝</span>
      </Button>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Communities;