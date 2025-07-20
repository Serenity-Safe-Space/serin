import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';

const DailyGlowbox = () => {
  return (
    <Card className="shadow-soft hover:shadow-lg transition-all duration-300 rounded-3xl cursor-pointer bg-gradient-to-r from-cozy-primary/5 to-cozy-warm/5 border-2 border-dashed border-cozy-primary/20">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="text-3xl animate-bounce">🎁</div>
          <div>
            <p className="font-bold text-foreground">Your Daily Glowbox is ready!</p>
            <p className="text-sm text-muted-foreground">Tap to open your surprise</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGlowbox;