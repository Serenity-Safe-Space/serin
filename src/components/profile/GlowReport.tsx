import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const GlowReport = () => {
  const weeklyReport = [
    { 
      emoji: '😌', 
      label: 'Mood Stability', 
      change: 12, 
      direction: 'up',
      message: 'Your emotional balance is growing stronger'
    },
    { 
      emoji: '🧘', 
      label: 'Mindfulness', 
      change: 8, 
      direction: 'up',
      message: 'You\'re becoming more present'
    },
    { 
      emoji: '🧴', 
      label: 'Self-Care', 
      change: 0, 
      direction: 'stable',
      message: 'Gentle reminder: you deserve care too'
    },
    { 
      emoji: '👯', 
      label: 'Social Connection', 
      change: 15, 
      direction: 'up',
      message: 'You focused more on connection this week'
    }
  ];

  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeText = (direction: string, change: number) => {
    if (direction === 'up') return `+${change}%`;
    if (direction === 'down') return `-${change}%`;
    return '—';
  };

  const getChangeColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-orange-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="shadow-soft rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">📊 This Week's Glow Report</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Visual feedback, no grades or pressure 💜
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {weeklyReport.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center space-x-1">
                {getChangeIcon(item.direction)}
                <span className={`text-sm font-semibold ${getChangeColor(item.direction)}`}>
                  {getChangeText(item.direction, item.change)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <Progress 
                value={item.direction === 'up' ? 70 + item.change : item.direction === 'down' ? 70 - item.change : 70} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground italic">
                {item.message}
              </p>
            </div>
          </div>
        ))}
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm font-medium text-cozy-primary">
            "You focused more on social connection this week – we love that for you 🫶"
          </p>
          <p className="text-xs text-muted-foreground">
            All scores reset gently each week for fresh starts 🌱
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlowReport;