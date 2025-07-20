import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

const GlowQuests = () => {
  const quests = [
    { emoji: '🔥', title: 'Mindful Streaker', progress: 3, total: 7, earned: false },
    { emoji: '💌', title: 'Helper Heart', progress: 50, total: 50, earned: true },
    { emoji: '🎨', title: 'Customize your Avatar', progress: 0, total: 1, earned: false, isBonus: true }
  ];

  return (
    <Card className="shadow-soft rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">🏆 Glow Quests</span>
          <button className="flex items-center text-sm text-cozy-primary hover:text-cozy-primary/80 transition-colors">
            See All Quests
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.map((quest, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-2xl bg-muted/30">
            <div className="text-2xl">{quest.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">{quest.title}</p>
                {quest.isBonus && (
                  <Badge className="bg-gradient-warm text-white text-xs rounded-full px-2 py-0.5">
                    1st time
                  </Badge>
                )}
                {quest.earned && (
                  <Badge className="bg-gradient-wellness text-white text-xs rounded-full px-2 py-0.5">
                    Earned!
                  </Badge>
                )}
              </div>
              {!quest.earned && (
                <div className="mt-2">
                  <Progress value={(quest.progress / quest.total) * 100} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {quest.progress}/{quest.total}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GlowQuests;