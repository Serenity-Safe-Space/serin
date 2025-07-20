import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, BookOpen, TrendingUp, Users } from 'lucide-react';
import ChatbotFloat from '@/components/ChatbotFloat';
import SerinHelper from '@/components/SerinHelper';
import BottomNav from '@/components/BottomNav';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  type: 'user' | 'bot' | 'tip';
  likes: number;
  comments: number;
  timestamp: string;
  tags?: string[];
}

const Feed = () => {
  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Serin AI',
      avatar: 'SA',
      content: "🧘‍♀️ Pause. Breathe in 5x. I got you. ✨ Your nervous system is chillin' now.",
      type: 'bot',
      likes: 127,
      comments: 23,
      timestamp: '2h ago',
      tags: ['mindfulness', 'breathing', 'wellness', 'selfcare', 'peace']
    },
    {
      id: '2',
      author: 'Anonymous Butterfly',
      avatar: 'AB',
      content: "Had my first panic attack in months today, but I used the breathing technique from this community and it helped so much. Thank you all for being here ❤️",
      type: 'user',
      likes: 89,
      comments: 31,
      timestamp: '4h ago',
      tags: ['support', 'anxiety', 'victory', 'community', 'grateful']
    },
    {
      id: '3',
      author: 'Serin AI',
      avatar: 'SA',
      content: "🌞 Gratitude check! Drop 1 thing that made you smile today ⬇️",
      type: 'tip',
      likes: 156,
      comments: 18,
      timestamp: '6h ago',
      tags: ['gratitude', 'positivity', 'joy', 'mindful']
    },
    {
      id: '4',
      author: 'Mindful Sage',
      avatar: 'MS',
      content: "Created a new support group for night owls dealing with insomnia. Sometimes 3am thoughts need 3am friends. Join us in 'Midnight Minds' 🌙",
      type: 'user',
      likes: 67,
      comments: 12,
      timestamp: '8h ago',
      tags: ['insomnia', 'support-group', 'community', 'nightowls']
    }
  ]);

  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const handleLike = (postId: string) => {
    // Handle like functionality
    console.log('Liked post:', postId);
  };

  const toggleTags = (postId: string) => {
    setExpandedTags(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getPostIcon = (type: Post['type']) => {
    switch (type) {
      case 'bot':
        return <TrendingUp className="h-4 w-4" />;
      case 'tip':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getPostBg = (type: Post['type']) => {
    switch (type) {
      case 'bot':
        return 'bg-gradient-primary';
      case 'tip':
        return 'bg-gradient-wellness';
      default:
        return 'bg-gradient-warm';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Wellness Feed
          </h1>
          <p className="text-sm text-muted-foreground">Discover, share, and grow together</p>
        </div>
      </header>

      <SerinHelper page="feed" />

      <main className="max-w-lg mx-auto px-6 py-6 space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-soft animate-fade-in hover:shadow-glow transition-all duration-300 rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`text-white ${getPostBg(post.type)}`}>
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-1 -right-1 p-1 rounded-full ${getPostBg(post.type)}`}>
                      {getPostIcon(post.type)}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-5">
              <p className="text-base leading-relaxed">{post.content}</p>
              
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {(expandedTags[post.id] ? post.tags : post.tags.slice(0, 2)).map((tag) => (
                    <Badge 
                      key={tag} 
                      className="text-xs bg-gradient-hashtag text-primary-foreground border-0 rounded-full px-3 py-1 font-medium"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTags(post.id)}
                      className="text-xs text-muted-foreground hover:text-primary h-6 px-2 rounded-full"
                    >
                      {expandedTags[post.id] ? 'Less' : `+${post.tags.length - 2} Tags`}
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary rounded-full px-3 py-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-xs font-medium">{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary rounded-full px-3 py-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">{post.comments}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary rounded-full p-2"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-wellness transition-all duration-300 z-20">
        <span className="text-2xl">✨</span>
      </Button>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Feed;