import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Heart, Shield, Ear } from 'lucide-react';

const CommunityBadges = () => {
  const communityBadges = [
    {
      emoji: '🧡',
      title: 'Listener',
      description: 'Reacted to 10 stories with care',
      progress: 8,
      total: 10,
      earned: false,
      icon: Heart,
      message: 'Your reactions bring comfort to others'
    },
    {
      emoji: '👂',
      title: 'Safe Space Keeper',
      description: 'Helped maintain community safety',
      progress: 1,
      total: 1,
      earned: true,
      icon: Shield,
      message: 'Thank you for protecting our community'
    },
    {
      emoji: '💛',
      title: 'Heart Connector',
      description: 'Stories resonated with 25+ people',
      progress: 12,
      total: 25,
      earned: false,
      icon: Ear,
      message: 'Your vulnerability creates connection'
    },
    {
      emoji: '🌱',
      title: 'Growth Supporter',
      description: 'Encouraged others on their journey',
      progress: 3,
      total: 5,
      earned: false,
      icon: Heart,
      message: 'Your support helps others bloom'
    }
  ];

  const earnedBadges = communityBadges.filter(badge => badge.earned);
  const inProgressBadges = communityBadges.filter(badge => !badge.earned);

  return (
    <Card className="shadow-soft rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">🤝 Community Impact</span>
          <button className="flex items-center text-sm text-cozy-primary hover:text-cozy-primary/80 transition-colors">
            Community
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          No comparison, no pressure. Just gentle community reflection 💜
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-cozy-primary">Your Impact</p>
            {earnedBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-2xl bg-gradient-to-r from-cozy-primary/5 to-cozy-warm/5">
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
                  <p className="text-xs text-cozy-primary italic mt-1">
                    {badge.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* In Progress Badges */}
        {inProgressBadges.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Growing Together</p>
            {inProgressBadges.slice(0, 2).map((badge, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-2xl bg-muted/20">
                <div className="text-xl opacity-60">{badge.emoji}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-muted-foreground">{badge.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-primary h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {badge.progress}/{badge.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Message */}
        <div className="text-center pt-2">
          <p className="text-xs text-cozy-primary italic">
            "Every gentle reaction creates ripples of healing in our community 🌊"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityBadges;