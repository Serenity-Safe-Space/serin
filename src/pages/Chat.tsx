import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, Smile, Sparkles, User, History, Users, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import RecommendationCard from '@/components/RecommendationCard';
import { useConversation } from '@11labs/react';

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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice conversation with ElevenLabs
  const conversation = useConversation({
    onConnect: () => console.log('Voice connected'),
    onDisconnect: () => setIsListening(false),
    onMessage: (message) => {
      // Handle voice transcription messages
      if (message.source === 'user' && message.message) {
        setNewMessage(message.message);
      }
    },
    onError: (error) => console.error('Voice error:', error)
  });

  // Typing effect
  useEffect(() => {
    if (!currentMessage) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < currentMessage.content.length) {
        setDisplayedText(currentMessage.content.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        setIsUserTurn(true);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentMessage]);

  const sendMessage = () => {
    if (!newMessage.trim() || !isUserTurn) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'chat'
    };

    setAllMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsUserTurn(false);

    // Get bot response
    setTimeout(() => {
      const conversationCount = allMessages.filter(m => m.sender === 'user').length + 1;
      const botResponse = getBotResponse(newMessage, conversationCount);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.response,
        sender: 'bot',
        timestamp: new Date(),
        type: botResponse.shouldRecommend ? 'recommendation' : 'support'
      };

      setAllMessages(prev => [...prev, botMessage]);
      setCurrentMessage(botMessage);
      setCurrentMessageIndex(prev => prev + 2);

      // Handle recommendations
      if (botResponse.shouldRecommend && botResponse.recommendationType) {
        addRecommendation({
          type: botResponse.recommendationType.type,
          title: botResponse.recommendationType.title,
          description: botResponse.recommendationType.description
        });
      }

      incrementConversation();
      updateEmotionalReadiness('forSharing', true);
    }, 1500);
  };

  const getBotResponse = (userMessage: string, conversationCount: number): { response: string; shouldRecommend: boolean; recommendationType?: any } => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Supportive responses based on emotional cues
    if (lowerMsg.includes('sad') || lowerMsg.includes('down') || lowerMsg.includes('depressed')) {
      if (conversationCount >= 3) {
        return {
          response: "I hear the sadness in your words, and I want you to know that your feelings are completely valid. Sometimes connecting with others who understand can help. Would you like me to help you find a supportive community?",
          shouldRecommend: true,
          recommendationType: {
            type: 'communities',
            title: 'Find Your Supportive Circle',
            description: 'Connect with others who understand your journey',
            feature: 'communities'
          }
        };
      }
      return {
        response: "I hear you, and I want you to know that feeling sad is a natural part of the human experience. You're not alone in this. What's been weighing on your heart lately?",
        shouldRecommend: false
      };
    }

    if (lowerMsg.includes('anxious') || lowerMsg.includes('worried') || lowerMsg.includes('stressed')) {
      if (conversationCount >= 2) {
        return {
          response: "Anxiety can feel overwhelming, but you're taking a brave step by sharing this with me. Would you like to see some stories from others who've walked a similar path? Sometimes knowing we're not alone can bring comfort.",
          shouldRecommend: true,
          recommendationType: {
            type: 'feed',
            title: 'Stories of Hope & Healing',
            description: 'Read experiences from others on similar journeys',
            feature: 'feed'
          }
        };
      }
      return {
        response: "Anxiety can feel so heavy sometimes. Thank you for trusting me with this. Let's take this one moment at a time. What's making you feel most anxious right now?",
        shouldRecommend: false
      };
    }

    if (lowerMsg.includes('better') || lowerMsg.includes('good') || lowerMsg.includes('happy')) {
      if (conversationCount >= 4) {
        return {
          response: "I'm so glad to hear you're feeling better! 🌸 Your growth journey is beautiful to witness. Would you like to see your progress and celebrate how far you've come?",
          shouldRecommend: true,
          recommendationType: {
            type: 'profile',
            title: 'Celebrate Your Growth',
            description: 'See your wellness journey and achievements',
            feature: 'profile'
          }
        };
      }
      return {
        response: "That's wonderful to hear! Your resilience is truly inspiring. What's been helping you feel better today?",
        shouldRecommend: false
      };
    }

    if (lowerMsg.includes('lonely') || lowerMsg.includes('alone') || lowerMsg.includes('isolated')) {
      return {
        response: "Feeling lonely can be one of the most difficult emotions to carry. But right here, right now, you're not alone - I'm here with you. And there are others who would understand exactly how you're feeling.",
        shouldRecommend: conversationCount >= 2,
        recommendationType: conversationCount >= 2 ? {
          type: 'communities',
          title: 'You\'re Not Alone',
          description: 'Connect with a caring community',
          feature: 'communities'
        } : undefined
      };
    }

    // Default supportive responses
    const responses = [
      "Thank you for sharing that with me. Your openness takes courage, and I'm honored you trust me with your thoughts.",
      "I'm here to listen without judgment. Every feeling you have is valid and deserves to be heard.",
      "You're being so brave by reaching out and talking about what's in your heart. How are you taking care of yourself today?",
      "Your journey is unique and valuable. I'm grateful you're letting me be part of it, even in this small way."
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      shouldRecommend: false
    };
  };

  const navigateMessages = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentMessageIndex > 0) {
      const newIndex = currentMessageIndex - 1;
      setCurrentMessageIndex(newIndex);
      setCurrentMessage(allMessages[newIndex]);
    } else if (direction === 'next' && currentMessageIndex < allMessages.length - 1) {
      const newIndex = currentMessageIndex + 1;
      setCurrentMessageIndex(newIndex);
      setCurrentMessage(allMessages[newIndex]);
    }
  };

  const getMessageBadge = (type?: string) => {
    switch (type) {
      case 'welcome':
        return <Badge variant="outline" className="bg-gradient-wellness text-wellness-foreground border-0 mb-2">Welcome</Badge>;
      case 'mood-check':
        return <Badge variant="outline" className="bg-gradient-primary text-primary-foreground border-0 mb-2">Mood Check</Badge>;
      case 'recommendation':
        return <Badge variant="outline" className="bg-gradient-secondary text-secondary-foreground border-0 mb-2">Suggestion</Badge>;
      case 'support':
        return <Badge variant="outline" className="bg-gradient-warm text-primary-foreground border-0 mb-2">Support</Badge>;
      default:
        return null;
    }
  };

  const handleAcceptRecommendation = (id: string, type: string) => {
    enableFeature(type as any);
    removeRecommendation(id);
    navigate(`/${type}`);
  };

  const handleDeclineRecommendation = (id: string) => {
    removeRecommendation(id);
  };

  const toggleVoice = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
      setIsListening(false);
    } else {
      try {
        // For demo purposes - you'll need to provide your ElevenLabs agent ID or signed URL
        // await conversation.startSession({ agentId: 'your-agent-id' });
        setIsListening(true);
        console.log('Voice feature requires ElevenLabs agent configuration');
      } catch (error) {
        console.error('Failed to start voice conversation:', error);
        setIsListening(false);
      }
    }
  };

  const showChatHistory = () => {
    // For now, this navigates through existing messages
    if (currentMessageIndex > 0) {
      navigateMessages('prev');
    }
  };

  const showGroupChat = () => {
    // This would open group chat functionality
    console.log('Group chat requires backend - connect to Supabase first');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100/50 via-purple-50/30 to-white flex flex-col">
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
          onClick={() => appState?.availableFeatures?.profile && navigate('/profile')}
          className="h-12 w-12 rounded-full bg-card/60 backdrop-blur-xl border border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-300"
          disabled={!appState?.availableFeatures?.profile}
        >
          <User className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Gentle header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-purple-100/50 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Left side icons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showChatHistory}
                  className="h-9 w-9 p-0 rounded-full hover:bg-purple-100/50"
                  title="Chat History"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showGroupChat}
                  className="h-9 w-9 p-0 rounded-full hover:bg-purple-100/50"
                  title="Find Support Group"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Center title */}
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-gray-800">Serin</h1>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0">
                  Your Safe Space
                </Badge>
              </div>
            </div>
            
            {/* Right side - Message navigation and voice */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={`h-9 w-9 p-0 rounded-full transition-colors ${
                  isListening ? 'bg-purple-500 text-white' : 'hover:bg-purple-100/50'
                }`}
                title={isListening ? "Stop Voice Chat" : "Start Voice Chat"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="font-medium">{currentMessageIndex + 1} / {allMessages.length}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMessages('prev')}
                    disabled={currentMessageIndex === 0}
                    className="h-8 w-8 p-0 rounded-full hover:bg-purple-100/50"
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMessages('next')}
                    disabled={currentMessageIndex === allMessages.length - 1}
                    className="h-8 w-8 p-0 rounded-full hover:bg-purple-100/50"
                  >
                    →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main voice interface area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8">
        {/* Central Voice Interface */}
        <motion.div 
          className="relative flex flex-col items-center space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Voice Circle - matching the uploaded design */}
          <div className="relative">
            {/* Outer glow rings */}
            <motion.div 
              className={`absolute inset-0 rounded-full ${
                isListening ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 40%, transparent 70%)',
                width: '280px',
                height: '280px',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }}
            />
            
            {/* Middle ring */}
            <motion.div 
              className={`absolute rounded-full border border-purple-200/30 ${
                isListening ? 'animate-spin' : ''
              }`}
              style={{
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                background: 'radial-gradient(circle, rgba(196, 181, 253, 0.3) 0%, rgba(168, 85, 247, 0.1) 60%, transparent 100%)'
              }}
              animate={isListening ? { rotate: 360 } : {}}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner circle with microphone */}
            <motion.div 
              className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl cursor-pointer ${
                isListening 
                  ? 'bg-gradient-to-br from-purple-400 via-purple-300 to-purple-200' 
                  : 'bg-gradient-to-br from-purple-300 via-purple-200 to-purple-100'
              }`}
              style={{
                boxShadow: isListening 
                  ? '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2)' 
                  : '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-purple-600" />
                )}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Voice status text */}
          <motion.div 
            className="text-center space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800">
              {isListening ? 'Listening...' : 'Advanced voice-activated AI'}
            </h2>
            <p className="text-gray-600 max-w-sm">
              {isListening 
                ? "Serin is listening with care. Share what's in your heart." 
                : 'Control your wellness journey hands-free with instant voice commands.'
              }
            </p>
          </motion.div>
        </motion.div>

        {/* Chat messages area - condensed and elegant */}
        {currentMessage && (
          <motion.div 
            className="w-full max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-xl border-purple-100/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-400 to-purple-500">
                    <AvatarFallback className="text-xs font-bold text-white">S</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    {getMessageBadge(currentMessage.type)}
                    <motion.p 
                      className="text-sm text-gray-700 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {displayedText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        <AnimatePresence>
          {appState?.pendingRecommendations && appState.pendingRecommendations.length > 0 && (
            <motion.div 
              className="w-full max-w-md space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {appState.pendingRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onAccept={() => handleAcceptRecommendation(rec.id, rec.type)}
                  onDecline={() => handleDeclineRecommendation(rec.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area - glassmorphic design */}
      <motion.div 
        className="p-6 bg-white/50 backdrop-blur-xl border-t border-purple-100/50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-lg mx-auto">
          {isUserTurn && (
            <motion.p 
              className="text-sm text-gray-600 mb-3 text-center"
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
              className="flex-1 rounded-2xl border-purple-200/50 focus:border-purple-300/70 bg-white/70 backdrop-blur-sm"
              disabled={!isUserTurn}
            />
            <Button 
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
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