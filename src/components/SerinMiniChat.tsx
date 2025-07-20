import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Serin AI Mini Chat Component

const SerinMiniChat = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [tone, setTone] = useState<'chill' | 'funny' | 'deep'>('chill');
  const [isBlinking, setIsBlinking] = useState(false);
  const navigate = useNavigate();

  const messages = {
    chill: [
      "Hey you 🫶 Have you drunk water today?",
      "Mood check: 🌧 or ☀️? Wanna talk about it?",
      "You've been glowing lately ✨ Proud of you",
      "Need a vibe boost? I'm always here",
      "Want a tip to help chill out right now?",
      "You're safe here. Like, seriously 🧸"
    ],
    funny: [
      "Bestie, drink some water before I make you 💀",
      "Your phone battery: 📱💀 Your wellness: 📈✨",
      "Manifesting good vibes for you rn 🔮",
      "Plot twist: you're the main character today",
      "Mental health check: are we thriving or just surviving? 👀",
      "Sending virtual hugs because I can't give real ones yet 🤖💕"
    ],
    deep: [
      "Your feelings are valid, even the messy ones 🌊",
      "Growth isn't linear, and that's perfectly okay",
      "What would you tell your younger self right now?",
      "You're exactly where you need to be in this moment",
      "Healing happens in waves, not straight lines",
      "Your presence here matters more than you know 💙"
    ]
  };

  // Cycle through messages every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages[tone].length);
      setShowBubble(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [tone, messages]);

  // Random blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleTap = () => {
    navigate('/chat');
  };

  const handleLongPress = () => {
    const tones: Array<'chill' | 'funny' | 'deep'> = ['chill', 'funny', 'deep'];
    const currentIndex = tones.indexOf(tone);
    const nextTone = tones[(currentIndex + 1) % tones.length];
    setTone(nextTone);
    setCurrentMessage(0);
    setShowBubble(true);
  };

  const getToneColor = () => {
    switch (tone) {
      case 'chill': return 'bg-gradient-wellness';
      case 'funny': return 'bg-gradient-warm';
      case 'deep': return 'bg-gradient-primary';
      default: return 'bg-gradient-wellness';
    }
  };

  const getToneEmoji = () => {
    switch (tone) {
      case 'chill': return '😌';
      case 'funny': return '😄';
      case 'deep': return '🤍';
      default: return '😌';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="relative animate-fade-in">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-glow max-w-xs">
            <p className="text-sm text-foreground leading-relaxed">
              {messages[tone][currentMessage]}
            </p>
            {/* Speech bubble arrow */}
            <div className="absolute top-6 -right-2 w-0 h-0 border-l-8 border-l-card/95 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
          
          {/* Close bubble button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -left-2 h-6 w-6 p-0 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground"
          >
            ×
          </Button>
        </div>
      )}

      {/* Serin Avatar */}
      <div className="relative">
        <Button
          onClick={handleTap}
          onContextMenu={(e) => {
            e.preventDefault();
            handleLongPress();
          }}
          onTouchStart={(e) => {
            let pressTimer: NodeJS.Timeout;
            pressTimer = setTimeout(() => {
              handleLongPress();
            }, 500);

            const handleTouchEnd = () => {
              clearTimeout(pressTimer);
              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchend', handleTouchEnd);
          }}
          className={`h-12 w-12 rounded-full ${getToneColor()} shadow-glow hover:shadow-wellness transition-all duration-300 p-0 animate-glow`}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`bg-transparent text-white font-bold transition-all duration-150 ${isBlinking ? 'scale-90' : 'scale-100'}`}>
              {getToneEmoji()}
            </AvatarFallback>
          </Avatar>
        </Button>

        {/* Tone indicator */}
        <div className="absolute -bottom-1 -right-1 bg-card rounded-full px-2 py-0.5 text-xs font-medium text-muted-foreground border shadow-sm">
          {tone}
        </div>
      </div>
    </div>
  );
};

export default SerinMiniChat;