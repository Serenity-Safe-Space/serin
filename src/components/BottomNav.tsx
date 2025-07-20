import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Users, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/feed', icon: Sparkles, label: 'Feed', emoji: '✨' },
    { path: '/communities', icon: Users, label: 'Communities', emoji: '🤝' },
    { path: '/chat', icon: MessageCircle, label: 'Chat', emoji: '💬' },
    { path: '/profile', icon: User, label: 'Profile', emoji: '👤' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t z-20 rounded-t-3xl">
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, emoji }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(path)}
                className={`flex flex-col items-center space-y-2 h-auto py-3 px-4 transition-all duration-300 rounded-2xl ${
                  isActive
                    ? 'text-primary bg-gradient-primary/10 shadow-soft'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {emoji}
                </div>
                {!isActive && (
                  <span className="text-xs font-medium">{label}</span>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-scale-in" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;