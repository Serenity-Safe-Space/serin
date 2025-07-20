import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, BarChart3, Smile } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'mood-check' | 'tip' | 'support' | 'chat';
}

const Chat = () => {
  const [allMessages, setAllMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 🌟 I'm Serin, your wellness companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      type: 'mood-check'
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState<Message | null>(allMessages[0]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Typing effect for displaying messages character by character
  useEffect(() => {
    if (!currentMessage) return;

    setDisplayedText('');
    setIsTyping(true);
    let charIndex = 0;
    
    const typeMessage = () => {
      if (charIndex < currentMessage.content.length) {
        setDisplayedText(currentMessage.content.slice(0, charIndex + 1));
        charIndex++;
        setTimeout(typeMessage, 30); // Typing speed
      } else {
        setIsTyping(false);
        // If it's a bot message, wait a moment then allow user input
        if (currentMessage.sender === 'bot') {
          setTimeout(() => {
            setIsUserTurn(true);
          }, 1000);
        }
      }
    };

    setTimeout(typeMessage, 500); // Delay before starting to type
  }, [currentMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedText]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !isUserTurn) return;

    setIsUserTurn(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to all messages
    const updatedMessages = [...allMessages, userMessage];
    setAllMessages(updatedMessages);
    
    // Show user message
    setCurrentMessage(userMessage);
    setCurrentMessageIndex(updatedMessages.length - 1);
    setNewMessage('');

    // After user message is typed, generate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date(),
        type: 'chat'
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setAllMessages(finalMessages);
      setCurrentMessage(botResponse);
      setCurrentMessageIndex(finalMessages.length - 1);
    }, 2000); // Wait for user message to finish typing
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('nervous')) {
      return "I understand you're feeling anxious. Remember, anxiety is your brain trying to protect you, but sometimes it goes a bit overboard! Try this: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This grounding technique can help bring you back to the present moment. 🌱";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down')) {
      return "I'm here with you through these tough feelings. It's okay to feel sad - emotions are valid and temporary. Would you like to share what's on your mind, or would you prefer some gentle suggestions for self-care? Sometimes a small act of kindness to yourself can make a difference. 💝";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "That's wonderful to hear! 🌟 Your positive energy is contagious. What's bringing you joy today? Celebrating the good moments, even small ones, helps build resilience for when things get tough. Keep shining!";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! Whether you need someone to listen, want wellness tips, or need navigation help around the app, I've got you covered. The communities section has amazing support groups, and the feed has inspiring content. What specific support are you looking for today? 🤗";
    }
    
    return "Thanks for sharing with me! I'm always here to listen and support you. Every conversation we have helps me understand you better. Is there anything specific you'd like to talk about or explore today? 💫";
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'mood-check':
        return <Badge variant="secondary" className="mb-3"><Smile className="h-3 w-3 mr-1" />Mood Check</Badge>;
      case 'tip':
        return <Badge variant="secondary" className="mb-3"><BarChart3 className="h-3 w-3 mr-1" />Wellness Tip</Badge>;
      case 'support':
        return <Badge variant="secondary" className="mb-3"><Heart className="h-3 w-3 mr-1" />Support</Badge>;
      default:
        return null;
    }
  };

  const navigateMessages = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentMessageIndex - 1)
      : Math.min(allMessages.length - 1, currentMessageIndex + 1);
    
    if (newIndex !== currentMessageIndex) {
      setCurrentMessageIndex(newIndex);
      setCurrentMessage(allMessages[newIndex]);
      setIsUserTurn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-primary text-white font-bold">
                  S
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Serin AI
                </h1>
                <p className="text-sm text-wellness">Live conversation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{currentMessageIndex + 1} / {allMessages.length}</span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMessages('prev')}
                  disabled={currentMessageIndex === 0}
                  className="h-6 w-6 p-0"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMessages('next')}
                  disabled={currentMessageIndex === allMessages.length - 1}
                  className="h-6 w-6 p-0"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
        {currentMessage && (
          <div className="w-full animate-fade-in">
            <div className={`flex ${currentMessage.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${currentMessage.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {currentMessage.sender === 'bot' && getMessageBadge(currentMessage.type)}
                
                <Card className={`
                  ${currentMessage.sender === 'user' 
                    ? 'bg-gradient-primary text-white shadow-glow' 
                    : 'bg-card shadow-soft border-2 border-primary/20'
                  }
                  transition-all duration-300
                `}>
                  <CardContent className="p-6">
                    <p className="text-base leading-relaxed">
                      {displayedText}
                      {isTyping && (
                        <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse">|</span>
                      )}
                    </p>
                    <p className={`text-xs mt-3 ${
                      currentMessage.sender === 'user' 
                        ? 'text-white/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {currentMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {currentMessage.sender === 'bot' && (
                <Avatar className="h-12 w-12 mr-3 order-1 ring-2 ring-wellness ring-offset-2">
                  <AvatarFallback className="bg-gradient-wellness text-white text-sm font-bold">
                    S
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input area - only show when it's user's turn */}
      <div className={`fixed bottom-16 left-0 right-0 bg-card/80 backdrop-blur-sm border-t p-4 transition-all duration-300 ${
        isUserTurn ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none translate-y-2'
      }`}>
        <div className="max-w-lg mx-auto">
          {isUserTurn && (
            <p className="text-xs text-muted-foreground mb-2 animate-fade-in">
              Serin is waiting for your response...
            </p>
          )}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isUserTurn ? "Share your thoughts..." : "Wait for your turn..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
              disabled={!isUserTurn}
            />
            <Button 
              onClick={sendMessage}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={!newMessage.trim() || !isUserTurn}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;