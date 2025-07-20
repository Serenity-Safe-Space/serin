import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/communities', icon: Users, label: 'Communities' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t z-20">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(path)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-in' : ''}`} />
                <span className="text-xs">{label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full animate-scale-in" />
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