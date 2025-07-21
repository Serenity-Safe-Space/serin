import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Users, MessageCircle, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/useAppState';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appState } = useAppState();

  const navItems = [
    { 
      path: '/feed', 
      icon: Sparkles, 
      label: 'Feed', 
      emoji: '✨',
      unlocked: appState.unlockedFeatures.feed 
    },
    { 
      path: '/communities', 
      icon: Users, 
      label: 'Communities', 
      emoji: '🤝',
      unlocked: appState.unlockedFeatures.communities 
    },
    { 
      path: '/', 
      icon: MessageCircle, 
      label: 'Chat', 
      emoji: '💜',
      unlocked: true 
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile', 
      emoji: '👤',
      unlocked: appState.unlockedFeatures.profile 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-primary/10 z-20 rounded-t-3xl">
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, emoji, unlocked }) => {
            const isActive = location.pathname === path;
            const canNavigate = unlocked;
            
            return (
              <Button
                key={path}
                variant="ghost"
                size="sm"
                onClick={() => canNavigate && navigate(path)}
                disabled={!canNavigate}
                className={`flex flex-col items-center space-y-2 h-auto py-3 px-4 transition-all duration-300 rounded-2xl relative ${
                  !canNavigate
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : isActive
                      ? 'text-primary bg-gradient-primary/10 shadow-soft'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <div className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''} ${!canNavigate ? 'grayscale opacity-50' : ''}`}>
                  {canNavigate ? emoji : '🔒'}
                </div>
                {!isActive && (
                  <span className="text-xs font-medium">{canNavigate ? label : 'Locked'}</span>
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