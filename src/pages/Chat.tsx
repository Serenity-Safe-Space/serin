import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, BarChart3, Calendar, Smile } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'mood-check' | 'tip' | 'support' | 'chat';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 🌟 I'm Serin, your wellness companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      type: 'mood-check'
    },
    {
      id: '2',
      content: "I'm feeling a bit anxious about tomorrow's presentation",
      sender: 'user',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      content: "I hear you! Presentation anxiety is really common. Let's work through this together. First, remember that you're prepared and capable. Would you like to try a quick breathing exercise to calm those nerves? 💙",
      sender: 'bot',
      timestamp: new Date(Date.now() - 10000),
      type: 'support'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date(),
        type: 'chat'
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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
        return <Badge variant="secondary" className="mb-2"><Smile className="h-3 w-3 mr-1" />Mood Check</Badge>;
      case 'tip':
        return <Badge variant="secondary" className="mb-2"><BarChart3 className="h-3 w-3 mr-1" />Wellness Tip</Badge>;
      case 'support':
        return <Badge variant="secondary" className="mb-2"><Heart className="h-3 w-3 mr-1" />Support</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto p-4">
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
              <p className="text-sm text-wellness">Your wellness companion</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'bot' && getMessageBadge(message.type)}
                <Card className={`
                  ${message.sender === 'user' 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-card shadow-soft'
                  }
                `}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-white/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 mr-2 order-1">
                  <AvatarFallback className="bg-gradient-wellness text-white text-xs">
                    S
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-gradient-wellness text-white text-xs">
                  S
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card shadow-soft">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-card/80 backdrop-blur-sm border-t p-4">
        <div className="max-w-lg mx-auto flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts with Serin..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={!newMessage.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;