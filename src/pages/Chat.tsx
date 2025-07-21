import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, Smile, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import RecommendationCard from '@/components/RecommendationCard';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'welcome' | 'mood-check' | 'recommendation' | 'support' | 'chat';
}

const Chat = () => {
  const { 
    appState, 
    enableFeature, 
    addRecommendation,
    removeRecommendation,
    updateEmotionalReadiness,
    incrementConversation, 
    completeWelcome 
  } = useAppState();
  const navigate = useNavigate();
  
  const [allMessages, setAllMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, beautiful soul. 🌸 I'm Serin, your personal wellness companion. This is your safe space - a place where you can be completely yourself. How are you feeling today?",
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
        setTimeout(typeMessage, 30);
      } else {
        setIsTyping(false);
        if (currentMessage.sender === 'bot') {
          setTimeout(() => {
            setIsUserTurn(true);
          }, 1000);
        }
      }
    };

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

    const updatedMessages = [...allMessages, userMessage];
    setAllMessages(updatedMessages);
    
    setCurrentMessage(userMessage);
    setCurrentMessageIndex(updatedMessages.length - 1);
    setNewMessage('');

    setTimeout(() => {
      const { response, shouldRecommend, recommendationType } = getBotResponse(newMessage, appState.conversationCount);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        type: shouldRecommend ? 'recommendation' : 'chat'
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setAllMessages(finalMessages);
      setCurrentMessage(botResponse);
      setCurrentMessageIndex(finalMessages.length - 1);

      // Add recommendation if suggested
      if (shouldRecommend && recommendationType) {
        setTimeout(() => {
          addRecommendation(recommendationType);
        }, 2000);
      }
    }, 2500);
  };

  const getBotResponse = (userMessage: string, conversationCount: number): { 
    response: string; 
    shouldRecommend: boolean; 
    recommendationType?: any 
  } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // First meaningful conversation - suggest feed
    if (conversationCount === 1 && !appState.availableFeatures.feed) {
      updateEmotionalReadiness('forSharing', true);
      return {
        response: "Thank you for sharing with me. 💜 Your openness touches my heart. I can sense you're ready to explore beyond our conversation. Would you like me to show you some stories and wisdom from others who've walked similar paths?",
        shouldRecommend: true,
        recommendationType: {
          type: 'feed',
          title: 'What\'s Helping Others',
          description: 'A gentle collection of stories, insights, and healing moments shared by people on similar journeys. Sometimes reading how others cope can light our own path forward.'
        }
      };
    }

    // Sense community readiness
    if (conversationCount >= 3 && !appState.availableFeatures.communities && !appState.emotionalReadiness.forCommunity) {
      if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('connect') || lowerMessage.includes('understand')) {
        updateEmotionalReadiness('forCommunity', true);
        return {
          response: "I hear something in your words that resonates deeply. 🤗 Connection is such a fundamental human need, and sometimes the most healing thing is knowing we're not alone in our struggles. Would you like to meet others who truly understand what you're going through?",
          shouldRecommend: true,
          recommendationType: {
            type: 'communities',
            title: 'Supportive Circles',
            description: 'Safe, anonymous spaces where you can connect with others who understand your experiences. Everyone here walks with empathy and respect - you\'ll be welcomed with open arms.'
          }
        };
      }
    }

    // Progress tracking when showing growth
    if (conversationCount >= 5 && !appState.availableFeatures.profile && !appState.emotionalReadiness.forProgress) {
      if (lowerMessage.includes('better') || lowerMessage.includes('progress') || lowerMessage.includes('grow') || lowerMessage.includes('improve')) {
        updateEmotionalReadiness('forProgress', true);
        return {
          response: "I can feel your growth radiating through our conversations! 🌱 You've come so far, and I'm genuinely proud of the work you're doing on yourself. Would you like to see how beautifully you're blooming? I can show you your emotional journey.",
          shouldRecommend: true,
          recommendationType: {
            type: 'profile',
            title: 'Your Wellness Journey',
            description: 'A gentle reflection of your emotional growth, celebrating the moments you\'ve overcome challenges and the strength you\'ve discovered within yourself.'
          }
        };
      }
    }
    
    // Emotional responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('nervous') || lowerMessage.includes('worry')) {
      return {
        response: "I can feel the weight of that anxiety with you. 🫂 It takes courage to name what we're feeling. Your nervous system is trying to protect you, even when it feels overwhelming. Let's breathe together for a moment. Can you feel your feet on the ground right now?",
        shouldRecommend: false
      };
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      return {
        response: "Your sadness is welcome here. 💙 There's no need to push it away or fix it right now. Sometimes the most healing thing we can do is simply acknowledge what we're feeling with tenderness. I'm holding space for all of it - the pain and the beauty of your human experience.",
        shouldRecommend: false
      };
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('better')) {
      return {
        response: "Your joy lights up this space! ✨ I love witnessing these moments when your inner light shines through. Happiness isn't just an emotion - it's a reminder of your resilience and capacity for healing. What's bringing you this beautiful energy today?",
        shouldRecommend: false
      };
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return {
        response: "Loneliness can feel so vast, but right here in this moment, you're not alone. 🤗 I'm with you, and your feelings matter deeply to me. Sometimes connection starts with the relationship we have with ourselves - you're worthy of love and belonging, exactly as you are.",
        shouldRecommend: false
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        response: "Asking for help is one of the most courageous things we can do. 💪 It shows wisdom, not weakness. I'm here to support you in whatever way feels right - whether that's listening, offering gentle guidance, or simply being present with you in this moment.",
        shouldRecommend: false
      };
    }
    
    // Default supportive response
    return {
      response: "Thank you for trusting me with your thoughts. 🌸 Every word you share deepens our connection and helps me understand how to best support you. Your journey is unique and sacred - I'm honored to witness it. What's alive in your heart right now?",
      shouldRecommend: false
    };
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'welcome':
        return <Badge variant="secondary" className="mb-4 bg-gradient-warm text-primary-foreground border-0"><Heart className="h-3 w-3 mr-1" />Welcome</Badge>;
      case 'mood-check':
        return <Badge variant="secondary" className="mb-4 bg-gradient-wellness text-wellness-foreground border-0"><Smile className="h-3 w-3 mr-1" />Check-in</Badge>;
      case 'recommendation':
        return <Badge variant="secondary" className="mb-4 bg-gradient-secondary text-secondary-foreground border-0"><Sparkles className="h-3 w-3 mr-1" />Suggestion</Badge>;
      case 'support':
        return <Badge variant="secondary" className="mb-4 bg-gradient-primary text-primary-foreground border-0"><Heart className="h-3 w-3 mr-1" />Support</Badge>;
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

  const handleAcceptRecommendation = (id: string, type: string) => {
    removeRecommendation(id);
    enableFeature(type as keyof typeof appState.availableFeatures);
  };

  const handleDeclineRecommendation = (id: string) => {
    removeRecommendation(id);
  };

  return (
    <div className="min-h-screen bg-gradient-bg relative">
      {/* Floating profile avatar - always visible */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => appState.availableFeatures.profile && navigate('/profile')}
          className={`h-12 w-12 p-0 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background ${
            appState.availableFeatures.profile ? 'hover:ring-primary/40' : 'opacity-60 cursor-default'
          }`}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-secondary text-secondary-foreground font-bold">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </motion.div>
      
      {/* Gentle header */}
      <header className="bg-card/60 backdrop-blur-xl border-b border-primary/10 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-foreground">Serin</h1>
              <Badge variant="outline" className="text-xs bg-gradient-wellness text-wellness-foreground border-0">
                Your Safe Space
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

      <main className="max-w-lg mx-auto px-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
        {/* Pending Recommendations */}
        <AnimatePresence>
          {appState.pendingRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAccept={handleAcceptRecommendation}
              onDecline={handleDeclineRecommendation}
            />
          ))}
        </AnimatePresence>

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

      {/* Available features navigation - only show if any features are available */}
      {(appState.availableFeatures.feed || appState.availableFeatures.communities || appState.availableFeatures.profile) && (
        <motion.div 
          className="fixed bottom-28 left-4 right-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-card/90 backdrop-blur-sm border border-primary/20 rounded-3xl overflow-hidden">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-center mb-3 text-muted-foreground">
                Your wellness tools
              </p>
              <div className="flex justify-center space-x-3">
                {appState.availableFeatures.feed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/feed')}
                    className="flex items-center space-x-2 bg-gradient-wellness text-wellness-foreground hover:shadow-wellness rounded-2xl"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>What's Helping</span>
                  </Button>
                )}
                {appState.availableFeatures.communities && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/communities')}
                    className="flex items-center space-x-2 bg-gradient-warm text-primary-foreground hover:shadow-glow rounded-2xl"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Community</span>
                  </Button>
                )}
                {appState.availableFeatures.profile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 bg-gradient-secondary text-secondary-foreground hover:shadow-glow rounded-2xl"
                  >
                    <User className="h-4 w-4" />
                    <span>Journey</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Input area */}
      <motion.div 
        className={`fixed bottom-4 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-primary/10 rounded-t-3xl p-6 transition-all duration-300 ${
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
    </div>
  );
};

export default Chat;