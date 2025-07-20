import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, Flame } from 'lucide-react';

const AvatarGlowSection = () => {
  const userLevel = 7;
  const userXP = 2150;
  const nextLevelXP = 2500;
  const streak = 6;

  const levelVibes = [
    { level: 1, name: "Just Vibin'", emoji: "🌱", unlocks: ["Basic Avatar", "Soft Green Glow"] },
    { level: 2, name: "Lowkey Glow", emoji: "😶‍🌫️", unlocks: [] },
    { level: 3, name: "Soft Mode", emoji: "🧸", unlocks: ["Cozy Pose", "Warm Pink Glow"] },
    { level: 4, name: "Lil Spark", emoji: "✨", unlocks: [] },
    { level: 5, name: "Inner Peace-ish", emoji: "😌", unlocks: ["Zen Pose", "Lavender Glow", "Peace Badge 💗"] },
    { level: 6, name: "Small Wins", emoji: "🧃", unlocks: [] },
    { level: 7, name: "Main Character", emoji: "🎬", unlocks: ["Confident Pose", "Golden Glow"] },
    { level: 8, name: "Butterfly Era", emoji: "🦋", unlocks: [] },
    { level: 9, name: "Too Zen 2 Care", emoji: "🧘‍♀️", unlocks: ["Meditation Pose", "Ethereal Glow"] },
    { level: 10, name: "Glowed Up", emoji: "💅", unlocks: ["Iconic Pose", "Rainbow Glow", "Glow Badge 💗"] },
    { level: 11, name: "No Cringe Zone", emoji: "🚫😬", unlocks: [] },
    { level: 12, name: "Real Ones Only", emoji: "🤝", unlocks: ["Power Pose", "Pure White Glow"] },
    { level: 13, name: "Mentally Beach", emoji: "🌊", unlocks: [] },
    { level: 14, name: "10/10 Recommend", emoji: "⭐", unlocks: ["Star Pose", "Cosmic Glow"] },
    { level: 15, name: "Soft Flex", emoji: "🧚‍♀️", unlocks: ["Fairy Pose", "Prismatic Glow", "Legendary Badge 💗"] }
  ];

  const currentVibe = levelVibes.find(vibe => vibe.level === userLevel) || levelVibes[6];
  const recentUnlocks = levelVibes.filter(vibe => vibe.level <= userLevel && vibe.unlocks.length > 0).slice(-2);

  return (
    <div className="text-center space-y-6">
      {/* Avatar with current vibe glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary/20 rounded-full blur-xl animate-pulse"></div>
        <Avatar className="h-28 w-28 mx-auto cursor-pointer hover:scale-105 transition-transform relative z-10 ring-4 ring-cozy-primary/30">
          <AvatarFallback className="bg-gradient-primary text-white text-4xl font-bold">
            {currentVibe.emoji}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2 bg-gradient-warm text-white rounded-full p-2 z-20">
          <Star className="h-4 w-4" />
        </div>
      </div>

      {/* Current Vibe */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Current Vibe</p>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Level {userLevel}: {currentVibe.name} {currentVibe.emoji}
          </h2>
        </div>
        
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">{userXP.toLocaleString()} / {nextLevelXP.toLocaleString()} Glow Points</span>
            <span className="text-2xl">✨</span>
          </div>
          <Progress value={(userXP / nextLevelXP) * 100} className="h-3 rounded-full" />
        </div>

        {/* Recent Unlocks */}
        {recentUnlocks.length > 0 && (
          <div className="bg-gradient-to-r from-cozy-primary/10 to-cozy-warm/10 rounded-2xl p-4 space-y-2">
            <p className="text-sm font-bold text-cozy-primary">Recent Unlocks</p>
            <div className="flex flex-wrap gap-2">
              {recentUnlocks.flatMap(vibe => vibe.unlocks).map((unlock, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm text-xs px-3 py-1 rounded-full border border-cozy-primary/20">
                  {unlock}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak */}
        <div className="flex items-center justify-center space-x-2 bg-gradient-warm/10 rounded-full px-4 py-2 w-fit mx-auto">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-bold text-orange-600">{streak}-Day Streak</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarGlowSection;