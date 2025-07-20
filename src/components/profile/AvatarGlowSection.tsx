import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, Flame } from 'lucide-react';

const AvatarGlowSection = () => {
  const userLevel = 7;
  const userXP = 2150;
  const nextLevelXP = 2500;
  const streak = 6;

  const levelNames = [
    "Just Vibin' 🌱",
    "Lowkey Glow 😶‍🌫️", 
    "Soft Mode 🧸",
    "Lil Spark ✨",
    "Inner Peace-ish 😌",
    "Small Wins 🧃",
    "Main Character 🎬",
    "Butterfly Era 🦋",
    "Too Zen 2 Care 🧘‍♀️",
    "Glowed Up 💅",
    "No Cringe Zone 🚫😬",
    "Real Ones Only 🤝",
    "Mentally Beach 🌊",
    "10/10 Recommend ⭐",
    "Soft Flex 🧚‍♀️"
  ];

  const currentLevelName = levelNames[userLevel - 1] || "Soft Flex 🧚‍♀️";

  return (
    <div className="text-center space-y-6">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-28 w-28 mx-auto cursor-pointer hover:scale-105 transition-transform">
          <AvatarFallback className="bg-gradient-primary text-white text-4xl font-bold">
            🧑‍🎤
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2 bg-gradient-warm text-white rounded-full p-2">
          <Star className="h-4 w-4" />
        </div>
      </div>

      {/* Glow Level */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Level {userLevel} – {currentLevelName}
        </h2>
        
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">{userXP.toLocaleString()} / {nextLevelXP.toLocaleString()} Glow Points</span>
            <span className="text-2xl">✨</span>
          </div>
          <Progress value={(userXP / nextLevelXP) * 100} className="h-3 rounded-full" />
        </div>

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