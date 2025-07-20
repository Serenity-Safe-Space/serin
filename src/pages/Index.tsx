import SerinMiniChat from '@/components/SerinMiniChat';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-bg pb-28">
      <SerinMiniChat />
      
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Serin
          </h1>
          <p className="text-xl text-muted-foreground">
            Your wellness companion is here to support your journey ✨
          </p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Index;
