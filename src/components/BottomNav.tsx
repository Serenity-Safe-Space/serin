import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Users, MessageCircle, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/useAppState';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appState } = useAppState();

  // Only show navigation if features are available - with fallback safety
  const hasAvailableFeatures = appState?.availableFeatures?.feed || 
                               appState?.availableFeatures?.communities || 
                               appState?.availableFeatures?.profile;

  // Don't render if no features are available (pure chat mode)
  if (!hasAvailableFeatures) {
    return null;
  }

  const navItems = [
    { 
      path: '/feed', 
      icon: Sparkles, 
      label: 'What\'s Helping', 
      emoji: '✨',
      available: appState?.availableFeatures?.feed || false 
    },
    { 
      path: '/communities', 
      icon: Users, 
      label: 'Community', 
      emoji: '🤝',
      available: appState?.availableFeatures?.communities || false 
    },
    { 
      path: '/', 
      icon: MessageCircle, 
      label: 'Serin', 
      emoji: '💜',
      available: true 
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Journey', 
      emoji: '🌱',
      available: appState?.availableFeatures?.profile || false 
    }
  ].filter(item => item.available); // Only show available features

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-primary/10 z-20 rounded-t-3xl">
      <div className="max-w-lg mx-auto px-6 py-4">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, emoji, available }) => {
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