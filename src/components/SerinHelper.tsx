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
    "🌟 How's your wellness journey going today? Share a positive moment!",
    "💙 Remember: Small steps lead to big changes. What small win can you celebrate?",
    "✨ Feeling inspired? Your story might help someone else feel less alone.",
    "🌱 Take a deep breath with me... In for 4, hold for 4, out for 4. How do you feel?",
    "💫 What's one thing you're grateful for right now? Gratitude is powerful medicine!"
  ];

  const communitiesMessages = [
    "🤗 Looking for your tribe? These communities are full of caring souls like you!",
    "💬 Feeling nervous about joining? Remember, everyone here started where you are now.",
    "🎯 Pro tip: The most supportive communities are often the smaller, focused ones!",
    "🌈 Different communities, same goal: supporting each other's wellness journey.",
    "✨ Live rooms are magical! Jump in when you're ready - no pressure, just connection."
  ];

  const messages = page === 'feed' ? feedMessages : communitiesMessages;
  const currentMessage = messages[currentTipIndex];

  const cycleTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % messages.length);
  };

  if (!isVisible) return null;

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <Card className="bg-gradient-wellness/10 border border-wellness/20 shadow-soft animate-fade-in">
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-wellness text-white text-xs font-bold">
                S
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 mb-1">
                <p className="text-xs font-medium text-wellness">Serin AI</p>
                <Sparkles className="h-3 w-3 text-wellness animate-pulse" />
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {currentMessage}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleTip}
                className="h-6 w-6 p-0 hover:bg-wellness/20"
                title="Next tip"
              >
                <MessageCircle className="h-3 w-3 text-wellness" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 hover:bg-muted"
                title="Dismiss"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-wellness/20">
            <div className="flex space-x-1">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentTipIndex ? 'bg-wellness' : 'bg-wellness/30'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-5 px-2 text-wellness hover:bg-wellness/20"
            >
              <Heart className="h-3 w-3 mr-1" />
              Chat with me
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SerinHelper;