import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Heart, Smile, Sparkles, User, History, Users, Mic, MicOff, Settings, Star, Calendar, Trophy, MessageCircle, ArrowLeft, Bot } from 'lucide-react';
import PeerMatchingInterface from '@/components/PeerMatchingInterface';
import GroupChatInterface from '@/components/GroupChatInterface';
import ProfileView from '@/components/ProfileView';
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
  const [message, setMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPeerMatching, setShowPeerMatching] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'peer'>('ai'); // Track current chat mode
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

  // Auto-hide onboarding after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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

  const showChatHistoryFunc = () => {
    // This would open group chat functionality
    console.log('Group chat requires backend - connect to Supabase first');
  };

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
    setShowOnboarding(false);
    
    if (choice === "I want to connect with peers") {
      setShowPeerMatching(true);
    } else {
      setShowChatInterface(true);
      // Pre-fill the message based on choice
      setNewMessage(choice);
      setIsUserTurn(true);
    }
  };

  const handleBeginChat = () => {
    setShowPeerMatching(false);
    setShowGroupChat(true);
    setChatMode('peer'); // Set to peer chat mode
  };

  const handleChatHistory = () => {
    // Show chat history functionality
    console.log('Show chat history');
  };

  const handleViewProfile = () => {
    setShowPeerMatching(false);
    setShowProfileView(true);
  };

  const handleCloseAll = () => {
    setShowPeerMatching(false);
    setShowGroupChat(false);
    setShowProfileView(false);
    setShowChatInterface(false);
    setShowOnboarding(true);
    setChatMode('ai'); // Reset to AI chat mode
  };

  // Function to switch between AI and peer chat
  const switchToPeerChat = () => {
    if (chatMode === 'ai') {
      setShowChatInterface(false);
      setShowGroupChat(true);
      setChatMode('peer');
    }
  };

  const switchToAIChat = () => {
    if (chatMode === 'peer') {
      setShowGroupChat(false);
      setShowChatInterface(true);
      setChatMode('ai');
    }
  };

  // Show peer matching interface
  if (showPeerMatching) {
    return (
      <PeerMatchingInterface 
        onClose={handleCloseAll}
        onBeginChat={handleBeginChat}
        onChatHistory={handleChatHistory}
        onViewProfile={handleViewProfile}
      />
    );
  }

  // Show group chat interface with navigation
  if (showGroupChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
        {/* Navigation header for group chat */}
        <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchToAIChat}
            className="flex items-center space-x-2 text-purple-600 hover:bg-purple-100/50"
          >
            <Bot className="w-5 h-5" />
            <span>AI Chat</span>
          </Button>
          
          <h2 className="text-lg font-semibold text-purple-900">Peer Chat</h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseAll}
            className="text-purple-600 hover:bg-purple-100/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <GroupChatInterface onClose={handleCloseAll} />
      </div>
    );
  }

  // Show profile view
  if (showProfileView) {
    return <ProfileView onClose={handleCloseAll} />;
  }

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
        <div className="group relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfileModal(true)}
            className="h-16 w-16 rounded-full bg-card/60 backdrop-blur-xl border border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            <User className="h-8 w-8 text-orange-500" />
          </Button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            👤 Your Profile
          </div>
        </div>
      </motion.div>


      {/* Conditional rendering - Welcome screen or Chat interface */}
      {!showChatInterface ? (
        /* Welcome Screen matching the uploaded image */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-12">
          {/* Purple smiley avatar with glow */}
          <motion.div 
            className="flex flex-col items-center space-y-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Smiley Face Avatar with enhanced glow */}
            <div className="relative">
              {/* Glow effect background */}
              <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 blur-2xl scale-110 opacity-60"></div>
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-2xl">
                <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center relative">
                  {/* Eyes */}
                  <div className="absolute top-10 left-9 w-4 h-4 bg-purple-800 rounded-full"></div>
                  <div className="absolute top-10 right-9 w-4 h-4 bg-purple-800 rounded-full"></div>
                  {/* Smile */}
                  <div className="absolute bottom-10 w-16 h-8 border-b-4 border-purple-800 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Welcome Text */}
            <motion.div 
              className="text-center space-y-4 max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-purple-900 leading-tight">
                Hey, nice to meet you.<br />
                I'm here to help you<br />
                have the life you<br />
                really want!
              </h1>
            </motion.div>
          </motion.div>

          {/* Choice Buttons */}
          <motion.div 
            className="flex flex-col space-y-4 w-full max-w-sm"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* Choice 1 - Light purple/white */}
            <motion.button
              onClick={() => handleChoiceClick("I don't feel good")}
              className="w-full py-4 px-6 bg-white/80 hover:bg-white text-gray-700 rounded-full text-lg font-medium transition-colors shadow-lg border border-purple-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              I don't feel good
            </motion.button>

            {/* Choice 2 - Yellow */}
            <motion.button
              onClick={() => handleChoiceClick("I want to connect with peers")}
              className="w-full py-4 px-6 bg-yellow-200 hover:bg-yellow-300 text-gray-800 rounded-full text-lg font-medium transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              I want to connect with peers
            </motion.button>

            {/* Choice 3 - Pink */}
            <motion.button
              onClick={() => handleChoiceClick("Something else")}
              className="w-full py-4 px-6 bg-pink-200 hover:bg-pink-300 text-gray-800 rounded-full text-lg font-medium transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Something else
            </motion.button>
          </motion.div>
        </div>
      ) : (
        /* Chat Interface - Small icons on top, centered content */
        <div className="flex-1 flex flex-col">
          {/* Small icons at the top */}
          <motion.div
            className="flex items-center justify-center space-x-6 pt-8 pb-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Smaller Microphone Icon */}
            <div className="relative">
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 blur-lg scale-110 opacity-60"></div>
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-purple-500 flex items-center justify-center shadow-xl">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Smaller Chat Icon - Clickable to switch to peer chat */}
            <motion.button
              onClick={switchToPeerChat}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-green-300 to-teal-300 blur-lg scale-110 opacity-60"></div>
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 via-teal-400 to-green-500 flex items-center justify-center shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </motion.button>
          </motion.div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8">
            {/* Welcome text */}
            <motion.div
              className="text-center space-y-4 max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-medium text-purple-900 leading-relaxed">
                hey, nice to meet you!<br />
                i'm here to help you have the<br />
                life you really want
              </h1>
            </motion.div>

            {/* Input area */}
            <motion.div
              className="w-full max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="message..."
                  className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 focus:ring-0 text-lg"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white p-0"
                  disabled={!isUserTurn || !newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>

        </div>
      )}


      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-purple-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-purple-900 mb-4">Your Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-xl">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">You</h3>
              <p className="text-gray-600">Wellness Journey Member</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">3</div>
                  <div className="text-xs text-gray-600">Days Active</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">24</div>
                  <div className="text-xs text-gray-600">Check-ins</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">2</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowChatInterface(true);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Messages
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => {
                    setShowProfileModal(false);
                    navigate('/communities');
                  }}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Communities
                </Button>
                <Button 
                  variant="outline"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => {
                    setShowProfileModal(false);
                    // Handle settings action
                    console.log('Settings clicked');
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;