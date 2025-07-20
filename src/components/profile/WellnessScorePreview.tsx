import { Progress } from '@/components/ui/progress';

const WellnessScorePreview = () => {
  const scores = [
    { emoji: '😌', label: 'Mood', value: 78, color: 'bg-gradient-primary' },
    { emoji: '🧘', label: 'Mindfulness', value: 91, color: 'bg-gradient-wellness' },
    { emoji: '🧴', label: 'Self-Care', value: 62, color: 'bg-gradient-warm' },
    { emoji: '👯', label: 'Social', value: 85, color: 'bg-gradient-primary' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {scores.map((score, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-2xl">{score.emoji}</div>
            <div className="space-y-1">
              <Progress value={score.value} className="h-2" />
              <p className="text-xs font-medium text-muted-foreground">{score.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-primary">
          +5% this week! Keep going 💜
        </p>
      </div>
    </div>
  );
};

export default WellnessScorePreview;