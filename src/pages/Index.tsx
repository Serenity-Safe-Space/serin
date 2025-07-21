import SerinMiniChat from '@/components/SerinMiniChat';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <SerinMiniChat />
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-6 space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Welcome to Serin
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Your wellness companion is here to support your journey ✨
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-warm rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-bold text-primary mb-2">✨ Get Started</h3>
              <p className="text-sm text-muted-foreground">Join a supportive community focused on mental wellness and growth</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-soft text-center">
                <div className="text-2xl mb-1">🧘‍♀️</div>
                <p className="text-xs font-semibold text-primary">Mindfulness</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-soft text-center">
                <div className="text-2xl mb-1">💜</div>
                <p className="text-xs font-semibold text-primary">Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
