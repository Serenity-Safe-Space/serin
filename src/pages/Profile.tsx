import { Button } from '@/components/ui/button';
import { Settings, User, HelpCircle } from 'lucide-react';
import ChatbotFloat from '@/components/ChatbotFloat';
import BottomNav from '@/components/BottomNav';
import AvatarGlowSection from '@/components/profile/AvatarGlowSection';
import WellnessScorePreview from '@/components/profile/WellnessScorePreview';
import DailyGlowbox from '@/components/profile/DailyGlowbox';
import GentleBadges from '@/components/profile/GentleBadges';
import GlowReport from '@/components/profile/GlowReport';
import CommunityBadges from '@/components/community/CommunityBadges';
import MyStats from '@/components/profile/MyStats';
import AnonymousLeaderboard from '@/components/profile/AnonymousLeaderboard';

const Profile = () => {

  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile
            </h1>
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8 space-y-8">
        {/* Avatar & Glow Level */}
        <AvatarGlowSection />

        {/* Wellness Score Preview */}
        <WellnessScorePreview />

        {/* Daily Glowbox */}
        <DailyGlowbox />

        {/* Weekly Glow Report */}
        <GlowReport />

        {/* Gentle Badges */}
        <GentleBadges />

        {/* Community Impact */}
        <CommunityBadges />

        {/* My Stats */}
        <MyStats />

        {/* Community Support */}
        <AnonymousLeaderboard />

        {/* Quick Actions */}
        <div className="space-y-3 pt-4">
          <Button variant="outline" className="w-full justify-start h-12 rounded-3xl">
            <User className="h-5 w-5 mr-3" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start h-12 rounded-3xl">
            <Settings className="h-5 w-5 mr-3" />
            App Settings
          </Button>
          <Button variant="outline" className="w-full justify-start h-12 rounded-3xl">
            <HelpCircle className="h-5 w-5 mr-3" />
            Help & Support
          </Button>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-wellness transition-all duration-300 z-20">
        <span className="text-2xl">👤</span>
      </Button>

      <ChatbotFloat />
      <BottomNav />
    </div>
  );
};

export default Profile;