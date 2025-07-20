import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, BookOpen, TrendingUp, Users } from 'lucide-react';
import ChatbotFloat from '@/components/ChatbotFloat';
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
      content: "💫 Daily wellness tip: Take 5 deep breaths right now. Notice how your body feels more relaxed? That's the power of mindful breathing! Your nervous system just shifted into a calmer state.",
      type: 'bot',
      likes: 127,
      comments: 23,
      timestamp: '2h ago',
      tags: ['mindfulness', 'breathing', 'wellness']
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
      tags: ['support', 'anxiety', 'victory']
    },
    {
      id: '3',
      author: 'Serin AI',
      avatar: 'SA',
      content: "🧠 Did you know? Your brain forms new neural pathways every time you practice a positive habit. That meditation session, gratitude journal, or kind act? You're literally rewiring your brain for happiness!",
      type: 'tip',
      likes: 156,
      comments: 18,
      timestamp: '6h ago',
      tags: ['neuroscience', 'habits', 'positivity']
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
      tags: ['insomnia', 'support-group', 'community']
    }
  ]);

  const handleLike = (postId: string) => {
    // Handle like functionality
    console.log('Liked post:', postId);
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
    <div className="min-h-screen bg-gradient-bg pb-20">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto p-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Wellness Feed
          </h1>
          <p className="text-sm text-muted-foreground">Discover, share, and grow together</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-soft animate-fade-in hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-white ${getPostBg(post.type)}`}>
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -top-1 -right-1 p-1 rounded-full ${getPostBg(post.type)}`}>
                      {getPostIcon(post.type)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{post.content}</p>
              
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Feed;