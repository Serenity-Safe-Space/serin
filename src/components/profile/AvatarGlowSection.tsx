import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, Flame } from 'lucide-react';

const AvatarGlowSection = () => {
  const emotionalGrowth = 7; // 1-10 scale based on emotional progress
  const glowStreak = 6;
  const auraStrength = 78; // percentage of emotional stability

  const avatarEvolution = [
    { growth: 1, posture: "sitting", glow: "soft", accessories: [], message: "Starting your journey 🌱" },
    { growth: 2, posture: "sitting", glow: "gentle", accessories: ["tiny_sparkles"], message: "Finding your inner light ✨" },
    { growth: 3, posture: "standing", glow: "warm", accessories: ["gentle_halo"], message: "Growing with self-compassion 🧸" },
    { growth: 4, posture: "standing", glow: "bright", accessories: ["soft_aura"], message: "Embracing your authentic self 😌" },
    { growth: 5, posture: "confident", glow: "radiant", accessories: ["peace_badge", "warm_glow"], message: "Radiating inner peace 💗" },
    { growth: 6, posture: "confident", glow: "luminous", accessories: ["small_crown", "golden_trail"], message: "Your energy is magnetic 🧃" },
    { growth: 7, posture: "floating", glow: "golden", accessories: ["confidence_crown", "star_trail"], message: "Living your main character era 🎬" },
    { growth: 8, posture: "floating", glow: "ethereal", accessories: ["butterfly_wings", "rainbow_aura"], message: "Beautiful transformation 🦋" },
    { growth: 9, posture: "meditating", glow: "cosmic", accessories: ["zen_halo", "ethereal_glow"], message: "Pure inner wisdom 🧘‍♀️" },
    { growth: 10, posture: "ascending", glow: "prismatic", accessories: ["light_wings", "rainbow_trail"], message: "Completely glowed up 💅" }
  ];

  const currentState = avatarEvolution.find(state => state.growth === emotionalGrowth) || avatarEvolution[6];
  const recentUnlocks = avatarEvolution.filter(state => state.growth <= emotionalGrowth && state.accessories.length > 0).slice(-2);

  return (
    <div className="text-center space-y-6">
      {/* Evolving Avatar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary/20 rounded-full blur-xl animate-pulse"></div>
        <Avatar className="h-28 w-28 mx-auto cursor-pointer hover:scale-105 transition-transform relative z-10 ring-4 ring-cozy-primary/30">
          <AvatarFallback className="bg-gradient-primary text-white text-4xl font-bold">
            🧘‍♀️
          </AvatarFallback>
        </Avatar>
        {/* Accessories indicator */}
        <div className="absolute -bottom-2 -right-2 bg-gradient-warm text-white rounded-full p-2 z-20">
          <Star className="h-4 w-4" />
        </div>
      </div>

      {/* Emotional Growth Message */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Your Aura Today</p>
          <h2 className="text-lg font-semibold text-foreground">
            {currentState.message}
          </h2>
          <p className="text-sm text-cozy-primary font-medium">
            Your aura is {auraStrength}% stronger this week 💜
          </p>
        </div>
        
        {/* Aura Strength Visual */}
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Emotional Growth</span>
            <span className="text-xl">✨</span>
          </div>
          <Progress value={auraStrength} className="h-3 rounded-full" />
        </div>

        {/* Recent Growth */}
        {recentUnlocks.length > 0 && (
          <div className="bg-gradient-to-r from-cozy-primary/10 to-cozy-warm/10 rounded-2xl p-4 space-y-2">
            <p className="text-sm font-bold text-cozy-primary">New Accessories Unlocked</p>
            <div className="flex flex-wrap gap-2">
              {recentUnlocks.flatMap(state => state.accessories).map((accessory, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm text-xs px-3 py-1 rounded-full border border-cozy-primary/20">
                  {accessory.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Glow Streak */}
        <div className="flex items-center justify-center space-x-2 bg-gradient-warm/10 rounded-full px-4 py-2 w-fit mx-auto">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-bold text-orange-600">{glowStreak}-Day Glow Streak</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarGlowSection;