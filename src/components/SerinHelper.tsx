import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Sparkles, Heart, MessageCircle } from 'lucide-react';

interface SerinHelperProps {
  page: 'feed' | 'communities';
}

const SerinHelper = ({ page }: SerinHelperProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const feedMessages = [
    "❤️ Feeling some type of way?",
    "🌿 Wanna breathe it out?", 
    "🔍 Lost? Let's find your way.",
    "💫 Your vibe attracts your tribe ✨"
  ];

  const communitiesMessages = [
    "🤗 Looking for your tribe? These communities are full of caring souls like you!",
    "💬 Feeling nervous about joining? Remember, everyone here started where you are now.",
    "🎯 Pro tip: The most supportive communities are often the smaller, focused ones!",
    "🌈 Different communities, same goal: supporting each other's wellness journey."
  ];

  const messages = page === 'feed' ? feedMessages : communitiesMessages;
  const currentMessage = messages[currentTipIndex];

  const cycleTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % messages.length);
  };

  if (!isVisible) return null;

  return (
    <div className="max-w-lg mx-auto px-6 py-4">
      <Card className="bg-gradient-wellness border border-wellness/20 shadow-wellness animate-fade-in rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                SA
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm font-semibold text-wellness-foreground">Serin AI</p>
                <Sparkles className="h-4 w-4 text-wellness-foreground animate-pulse" />
              </div>
              <p className="text-sm text-wellness-foreground leading-relaxed">
                {currentMessage}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0 hover:bg-white/20 rounded-full text-wellness-foreground"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
            <div className="flex space-x-1">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTipIndex ? 'bg-wellness-foreground' : 'bg-wellness-foreground/30'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleTip}
                className="text-xs h-7 px-3 text-wellness-foreground hover:bg-white/20 rounded-full font-medium"
              >
                Next tip
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/20 rounded-full text-wellness-foreground"
                title="Chat with me"
              >
                💬
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SerinHelper;