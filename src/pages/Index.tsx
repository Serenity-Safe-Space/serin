import SerinMiniChat from '@/components/SerinMiniChat';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <SerinMiniChat />
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-6 space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Hey you 💜 I'm Serin. Let's get you feeling better, yeah?
            </h1>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <button className="w-full bg-gradient-warm rounded-2xl p-4 shadow-soft text-left hover:shadow-lg transition-all">
                <p className="text-lg font-bold text-primary">I'm not okay rn</p>
              </button>
              
              <button className="w-full bg-gradient-warm rounded-2xl p-4 shadow-soft text-left hover:shadow-lg transition-all">
                <p className="text-lg font-bold text-primary">I need someone to talk to</p>
              </button>
              
              <button className="w-full bg-gradient-warm rounded-2xl p-4 shadow-soft text-left hover:shadow-lg transition-all">
                <p className="text-lg font-bold text-primary">Idk, just vibing</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
