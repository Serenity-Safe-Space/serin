import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const GentleBadges = () => {
  const [showBadges, setShowBadges] = useState(true);

  const badges = [
    { 
      emoji: '💌', 
      title: 'Brave Soul', 
      description: 'Shared your first journal',
      earned: true,
      category: 'vulnerability'
    },
    { 
      emoji: '🔥', 
      title: 'Starter Glow', 
      description: '3-day check-in streak',
      earned: true,
      category: 'consistency'
    },
    { 
      emoji: '👯', 
      title: 'Support Squad', 
      description: 'Encouraged someone else',
      earned: false,
      category: 'community'
    },
    { 
      emoji: '🌱', 
      title: 'Fresh Start', 
      description: 'Began your journey with self-compassion',
      earned: true,
      category: 'growth'
    },
    { 
      emoji: '🧸', 
      title: 'Self-Care Sunday', 
      description: 'Took time for yourself today',
      earned: false,
      category: 'self-care'
    },
    { 
      emoji: '💜', 
      title: 'Heart Helper', 
      description: 'Showed kindness to yourself',
      earned: true,
      category: 'self-love'
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);

  return (
    <Card className="shadow-soft rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">✨ Your Gentle Badges</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowBadges(!showBadges)}
              className="flex items-center text-sm text-cozy-primary hover:text-cozy-primary/80 transition-colors"
            >
              {showBadges ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button className="flex items-center text-sm text-cozy-primary hover:text-cozy-primary/80 transition-colors">
              See All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Earned through behavior, not perfection 💜
        </p>
      </CardHeader>
      
      {showBadges && (
        <CardContent className="space-y-3">
          {earnedBadges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-2xl bg-muted/30">
              <div className="text-2xl">{badge.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{badge.title}</p>
                  <Badge className="bg-gradient-wellness text-white text-xs rounded-full px-2 py-0.5">
                    Earned
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
          
          {earnedBadges.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                You're just getting started ✨
              </p>
              <p className="text-xs text-muted-foreground">
                Badges will appear as you grow at your own pace
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default GentleBadges;