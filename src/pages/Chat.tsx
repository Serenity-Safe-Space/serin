import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, BarChart3, Smile, Unlock, Users, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import FloatingAvatar from '@/components/FloatingAvatar';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'mood-check' | 'unlock' | 'support' | 'chat';
}

const Chat = () => {
  const { appState, unlockFeature, incrementConversation, completeWelcome } = useAppState();
  const navigate = useNavigate();
  
  const [allMessages, setAllMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, beautiful soul. 🌸 I'm Serin, your personal wellness companion. I'm here to listen, support, and guide you through your mental health journey. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      type: 'welcome'
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState<Message | null>(allMessages[0]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [showUnlockCard, setShowUnlockCard] = useState(false);
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
        setTimeout(typeMessage, 30); // Gentle typing speed
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

    // Add a gentle delay before starting to type
    setTimeout(typeMessage, 500);
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
    incrementConversation();

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
      const { response, shouldUnlock, unlockType } = getBotResponse(newMessage, appState.conversationCount);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        type: shouldUnlock ? 'unlock' : 'chat'
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setAllMessages(finalMessages);
      setCurrentMessage(botResponse);
      setCurrentMessageIndex(finalMessages.length - 1);

      // Handle unlocking features
      if (shouldUnlock && unlockType) {
        setTimeout(() => {
          unlockFeature(unlockType);
          setShowUnlockCard(true);
          setTimeout(() => setShowUnlockCard(false), 5000);
        }, 3000);
      }
    }, 2500); // Wait for user message to finish typing
  };

  const getBotResponse = (userMessage: string, conversationCount: number): { 
    response: string; 
    shouldUnlock: boolean; 
    unlockType?: keyof typeof appState.unlockedFeatures 
  } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // First conversation - unlock feed after sharing feelings
    if (conversationCount === 1 && !appState.unlockedFeatures.feed) {
      return {
        response: "Thank you for sharing with me. 💜 Your openness is the first step toward healing. I can see you're ready to explore more. Let me unlock your personalized wellness feed - a space filled with uplifting content, daily affirmations, and gentle reminders that you matter.",
        shouldUnlock: true,
        unlockType: 'feed'
      };
    }

    // Third conversation - unlock communities
    if (conversationCount === 3 && !appState.unlockedFeatures.communities) {
      return {
        response: "I've been listening to you, and I can feel your strength growing. 🌱 You're not alone in this journey. Let me introduce you to our supportive communities - safe spaces where you can connect with others who understand your experiences. Together, we're stronger.",
        shouldUnlock: true,
        unlockType: 'communities'
      };
    }

    // Fifth conversation - unlock profile
    if (conversationCount === 5 && !appState.unlockedFeatures.profile) {
      return {
        response: "Look how far you've come! 🌟 I'm so proud of your commitment to your wellbeing. You're ready for your personal wellness profile - track your progress, celebrate your growth, and see how beautifully you're blooming.",
        shouldUnlock: true,
        unlockType: 'profile'
      };
    }
    
    // Contextual responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('nervous') || lowerMessage.includes('worry')) {
      return {
        response: "I hear you, and your feelings are completely valid. 🫂 Anxiety can feel overwhelming, but you're stronger than you know. Try this gentle grounding technique: Take three deep breaths with me. Notice 5 things you can see, 4 you can touch, 3 you can hear. You're safe right here, right now.",
        shouldUnlock: false
      };
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      return {
        response: "I'm holding space for your sadness. 💙 It's okay to not be okay - your emotions are messengers, not enemies. You don't have to carry this alone. Would you like to share what's weighing on your heart, or shall we explore some gentle self-compassion practices together?",
        shouldUnlock: false
      };
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('better')) {
      return {
        response: "Your joy lights up my circuits! ✨ I love seeing you shine. Happiness isn't just an emotion - it's a practice of gratitude and self-love. What's bringing you this beautiful energy today? Let's celebrate these precious moments together.",
        shouldUnlock: false
      };
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return {
        response: "You're never truly alone when you have me. 🤗 Loneliness can feel so heavy, but remember - you're worthy of connection and love. Even in solitude, you can nurture the relationship with yourself. You are enough, exactly as you are.",
        shouldUnlock: false
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        response: "Asking for help is a sign of wisdom, not weakness. 💪 I'm here for you always - whether you need someone to listen, guidance through difficult moments, or celebration of your victories. What kind of support feels right for you today?",
        shouldUnlock: false
      };
    }
    
    // Default supportive response
    return {
      response: "Thank you for trusting me with your thoughts. 🌸 Every word you share helps me understand you better and support you more deeply. Your journey matters, and I'm honored to walk alongside you. What's in your heart right now?",
      shouldUnlock: false
    };
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'welcome':
        return <Badge variant="secondary" className="mb-4 bg-gradient-warm text-primary-foreground"><Heart className="h-3 w-3 mr-1" />Welcome</Badge>;
      case 'mood-check':
        return <Badge variant="secondary" className="mb-4 bg-gradient-wellness text-wellness-foreground"><Smile className="h-3 w-3 mr-1" />Check-in</Badge>;
      case 'unlock':
        return <Badge variant="secondary" className="mb-4 bg-gradient-secondary text-secondary-foreground"><Unlock className="h-3 w-3 mr-1" />New Feature</Badge>;
      case 'support':
        return <Badge variant="secondary" className="mb-4 bg-gradient-primary text-primary-foreground"><Heart className="h-3 w-3 mr-1" />Support</Badge>;
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

  const navigateToUnlockedFeature = (feature: string) => {
    navigate(`/${feature}`);
  };

  return (
    <div className="min-h-screen bg-gradient-bg relative">
      <FloatingAvatar />
      
      {/* Gentle header */}
      <header className="bg-card/60 backdrop-blur-xl border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-foreground">Wellness Chat</h1>
              <Badge variant="outline" className="text-xs bg-gradient-wellness text-wellness-foreground border-0">
                Safe Space
              </Badge>
            </div>
            
            {/* Message navigation */}
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="font-medium">{currentMessageIndex + 1} / {allMessages.length}</span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMessages('prev')}
                  disabled={currentMessageIndex === 0}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMessages('next')}
                  disabled={currentMessageIndex === allMessages.length - 1}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Unlock notification */}
      <AnimatePresence>
        {showUnlockCard && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 z-40"
          >
            <Card className="bg-gradient-secondary border-0 shadow-glow">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Unlock className="h-5 w-5 text-secondary-foreground" />
                  <span className="font-bold text-secondary-foreground">New Feature Unlocked!</span>
                </div>
                <p className="text-sm text-secondary-foreground/80">
                  Serin has opened a new part of your wellness journey
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-lg mx-auto px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
        {currentMessage && (
          <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Message Badge */}
            {currentMessage.sender === 'bot' && (
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {getMessageBadge(currentMessage.type)}
              </motion.div>
            )}
            
            {/* Avatar for bot messages */}
            {currentMessage.sender === 'bot' && (
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
              >
                <Avatar className="h-24 w-24 ring-4 ring-primary/20 ring-offset-4 ring-offset-background shadow-glow">
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                    S
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            )}
            
            {/* Main Message Card */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={`
                w-full max-w-md
                ${currentMessage.sender === 'user' 
                  ? 'bg-gradient-primary text-white shadow-glow' 
                  : 'bg-card/95 backdrop-blur-sm shadow-soft border border-primary/10'
                }
                transition-all duration-500 ease-out
                hover:scale-[1.02] hover:shadow-elegant
                rounded-3xl
              `}>
                <CardContent className="p-8 text-center">
                  <p className="text-lg leading-relaxed font-medium">
                    {displayedText}
                    {isTyping && (
                      <motion.span 
                        className="inline-block w-0.5 h-6 bg-current ml-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    )}
                  </p>
                  <p className={`text-sm mt-4 ${
                    currentMessage.sender === 'user' 
                      ? 'text-white/60' 
                      : 'text-muted-foreground'
                  }`}>
                    {currentMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </main>

      {/* Unlocked features preview */}
      {(appState.unlockedFeatures.feed || appState.unlockedFeatures.communities || appState.unlockedFeatures.profile) && (
        <motion.div 
          className="fixed bottom-28 left-4 right-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-card/90 backdrop-blur-sm border border-primary/20 rounded-3xl overflow-hidden">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-center mb-3 text-muted-foreground">
                Your unlocked wellness tools
              </p>
              <div className="flex justify-center space-x-3">
                {appState.unlockedFeatures.feed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToUnlockedFeature('feed')}
                    className="flex items-center space-x-2 bg-gradient-wellness text-wellness-foreground hover:shadow-wellness rounded-2xl"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Feed</span>
                  </Button>
                )}
                {appState.unlockedFeatures.communities && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToUnlockedFeature('communities')}
                    className="flex items-center space-x-2 bg-gradient-warm text-primary-foreground hover:shadow-glow rounded-2xl"
                  >
                    <Users className="h-4 w-4" />
                    <span>Community</span>
                  </Button>
                )}
                {appState.unlockedFeatures.profile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToUnlockedFeature('profile')}
                    className="flex items-center space-x-2 bg-gradient-secondary text-secondary-foreground hover:shadow-glow rounded-2xl"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Input area - only show when it's user's turn */}
      <motion.div 
        className={`fixed bottom-20 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-primary/10 rounded-t-3xl p-6 transition-all duration-300 ${
          isUserTurn ? 'opacity-100 translate-y-0' : 'opacity-60 pointer-events-none translate-y-2'
        }`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-lg mx-auto">
          {isUserTurn && (
            <motion.p 
              className="text-sm text-muted-foreground mb-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Serin is listening with care... 💜
            </motion.p>
          )}
          <div className="flex space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isUserTurn ? "Share what's in your heart..." : "Serin is typing..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 rounded-2xl border-primary/20 focus:border-primary/40 bg-background/50"
              disabled={!isUserTurn}
            />
            <Button 
              onClick={sendMessage}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-2xl px-6"
              disabled={!newMessage.trim() || !isUserTurn}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Chat;