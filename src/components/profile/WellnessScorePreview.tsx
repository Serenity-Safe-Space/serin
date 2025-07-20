import { Progress } from '@/components/ui/progress';

// Updated wellness preview component

const WellnessScorePreview = () => {
  const wellnessAreas = [
    { emoji: '😌', label: 'Mood', strength: 'growing', message: 'Feeling more balanced' },
    { emoji: '🧘', label: 'Mindfulness', strength: 'strong', message: 'Present and aware' },
    { emoji: '🧴', label: 'Self-Care', strength: 'gentle', message: 'Being kind to yourself' },
    { emoji: '👯', label: 'Social', strength: 'blooming', message: 'Connecting with others' }
  ];

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'h-8 bg-gradient-wellness';
      case 'blooming': return 'h-6 bg-gradient-primary';
      case 'growing': return 'h-5 bg-gradient-warm';
      case 'gentle': return 'h-4 bg-gradient-to-r from-muted to-cozy-primary/30';
      default: return 'h-3 bg-muted';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {wellnessAreas.map((area, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-2xl">{area.emoji}</div>
            <div className="space-y-1">
              <div className="h-12 flex items-end justify-center">
                <div className={`w-4 rounded-t ${getStrengthColor(area.strength)} transition-all duration-500`}></div>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{area.label}</p>
              <p className="text-xs text-cozy-primary italic">{area.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-primary">
          Your aura is stronger today — you've been showing up for yourself 💜
        </p>
      </div>
    </div>
  );
};

export default WellnessScorePreview;