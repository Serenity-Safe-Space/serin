import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, X, Heart, Zap, Navigation } from 'lucide-react';

const ChatbotFloat = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showQuickChat, setShowQuickChat] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const quickMessages = [
    { 
      text: "How are you feeling today?", 
      icon: Heart, 
      type: "mood-check" 
    },
    { 
      text: "Want a quick mindfulness tip?", 
      icon: Zap, 
      type: "tip" 
    },
    { 
      text: "Need help navigating the app?", 
      icon: Navigation, 
      type: "help" 
    }
  ];

  const getContextualMessage = () => {
    switch (location.pathname) {
      case '/feed':
        return "Loving the wellness vibes in your feed! 🌟";
      case '/communities':
        return "Great communities here! Need help finding the right one? 💙";
      case '/profile':
        return "You're doing amazing on your wellness journey! 🎉";
      default:
        return "I'm here if you need anything! 😊";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30">
      {showQuickChat && (
        <Card className="mb-4 w-64 shadow-glow animate-slide-up">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Quick Chat</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickChat(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {getContextualMessage()}
            </p>
            
            <div className="space-y-2">
              {quickMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate('/chat');
                    setShowQuickChat(false);
                  }}
                  className="w-full justify-start text-xs h-8 hover:bg-primary/10"
                >
                  <message.icon className="h-3 w-3 mr-2" />
                  {message.text}
                </Button>
              ))}
            </div>
            
            <Button
              onClick={() => {
                navigate('/chat');
                setShowQuickChat(false);
              }}
              className="w-full bg-gradient-primary text-xs h-8"
            >
              Open Full Chat
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col items-end space-y-2">
        <Button
          onClick={() => setShowQuickChat(!showQuickChat)}
          className="h-14 w-14 rounded-full bg-gradient-wellness shadow-wellness hover:shadow-glow transition-all duration-300 animate-glow"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-transparent text-white font-bold">
              S
            </AvatarFallback>
          </Avatar>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-xs text-muted-foreground h-6 w-6 p-0 opacity-60 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ChatbotFloat;