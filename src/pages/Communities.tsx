import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, MessageSquare, Clock, Search, Plus, Zap } from 'lucide-react';
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

interface Room {
  id: string;
  title: string;
  participants: number;
  isLive: boolean;
  community: string;
  host: string;
}

const Communities = () => {
  const [activeTab, setActiveTab] = useState<'communities' | 'rooms'>('communities');
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

  const [rooms] = useState<Room[]>([
    {
      id: '1',
      title: 'Deep Breathing Session',
      participants: 23,
      isLive: true,
      community: 'Mindful Living',
      host: 'Zen Master'
    },
    {
      id: '2',
      title: 'Share Your Wins Today',
      participants: 15,
      isLive: true,
      community: 'Anxiety Support Circle',
      host: 'Peaceful Warrior'
    },
    {
      id: '3',
      title: 'Late Night Check-in',
      participants: 8,
      isLive: true,
      community: 'Night Owls Unite',
      host: 'Midnight Moon'
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
    <div className="min-h-screen bg-gradient-bg pb-20">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Communities
            </h1>
            <Button size="sm" className="bg-gradient-wellness">
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities and rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'communities'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Communities
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'rooms'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Live Rooms
            </button>
          </div>
        </div>
      </header>

      <SerinHelper page="communities" />

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {activeTab === 'communities' ? (
          <>
            {communities.map((community) => (
              <Card key={community.id} className="shadow-soft animate-fade-in hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCommunityIcon(community.type)}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {community.name}
                          {community.isLive && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{community.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{community.lastActivity}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {rooms.map((room) => (
              <Card key={room.id} className="shadow-soft animate-fade-in hover:shadow-glow transition-all duration-300 border-l-4 border-l-wellness">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-wellness" />
                        {room.title}
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          LIVE
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">in {room.community}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{room.participants} active</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs bg-gradient-warm text-white">
                            {room.host.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{room.host}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="bg-gradient-wellness hover:shadow-wellness">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Join Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </main>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Communities;