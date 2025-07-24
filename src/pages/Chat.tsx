import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Heart, Smile, Sparkles, User, History, Users, Mic, MicOff, Settings, Star, Calendar, Trophy, MessageCircle, ArrowLeft, Bot, Instagram, Mail, LogOut, Edit } from 'lucide-react';
import PeerMatchingInterface from '@/components/PeerMatchingInterface';
import GroupChatInterface from '@/components/GroupChatInterface';
import ProfileView from '@/components/ProfileView';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import { useConversation } from '@11labs/react';
import { useAuth } from '@/contexts/AuthContext';
import { validateNickname } from '@/utils/nicknameGenerator';
import geminiService from '@/services/geminiService';


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
  const { signOut, user, profile, updateProfile, resendConfirmationEmail } = useAuth();

  const [currentDisplayText, setCurrentDisplayText] = useState("Gotchu. Let's talk.\nMood's all yours – spill it");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPeerMatching, setShowPeerMatching] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'peer'>('ai'); // Track current chat mode
  const [welcomeTextVariant, setWelcomeTextVariant] = useState(0); // 0 for main, 1 for variant
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

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

  // Initialize with Serin's greeting
  useEffect(() => {
    if (!conversationStarted) {
      setCurrentDisplayText(geminiService.getInitialMessage());
    }
  }, [conversationStarted]);

  // Auto-hide onboarding after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Randomly switch welcome text variant
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeTextVariant(prev => Math.random() > 0.7 ? (prev === 0 ? 1 : 0) : prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !isUserTurn || isGeneratingResponse) return;

    const userMessageText = newMessage;
    setNewMessage('');
    setIsUserTurn(false);
    setIsGeneratingResponse(true);
    setConversationStarted(true);

    // Show user message while generating response
    setCurrentDisplayText(userMessageText);

    try {
      // Get bot response from Gemini
      const botResponse = await geminiService.sendMessage(userMessageText);
      
      // Show bot response
      setCurrentDisplayText(botResponse);
      
      // Check if we should unlock features based on conversation length
      const conversationLength = geminiService.getConversationLength();
      if (conversationLength >= 3) {
        updateEmotionalReadiness('forSharing', true);
      }
      if (conversationLength >= 5) {
        enableFeature('feed');
      }
      if (conversationLength >= 7) {
        enableFeature('communities');
      }
      
      incrementConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      setCurrentDisplayText("Sorry, I'm having trouble right now. Can you try again? 😊");
    } finally {
      setIsGeneratingResponse(false);
      setIsUserTurn(true);
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

  const handleEditNickname = () => {
    setEditedNickname(profile?.nickname || '');
    setIsEditingNickname(true);
  };

  const handleSaveNickname = async () => {
    if (!editedNickname.trim()) return;

    const validation = validateNickname(editedNickname);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const { error } = await updateProfile({ nickname: editedNickname });
    if (error) {
      console.error('Error updating nickname:', error);
      alert('Failed to update nickname. Please try again.');
    } else {
      setIsEditingNickname(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingNickname(false);
    setEditedNickname('');
  };

  const handleResendConfirmation = async () => {
    // Check if email is already confirmed
    const isEmailConfirmed = user?.email_confirmed_at || profile?.email_confirmed;
    if (isEmailConfirmed) {
      alert('Your email is already confirmed! No need to resend.');
      return;
    }

    setIsResendingEmail(true);
    console.log('Chat: User clicked resend confirmation email');
    
    try {
      const { error } = await resendConfirmationEmail();
      if (error) {
        console.error('Chat: Error resending confirmation:', error);
        alert(`Failed to resend confirmation email: ${error.message || 'Unknown error'}. Check the browser console and Supabase Auth logs for more details.`);
      } else {
        console.log('Chat: Resend request completed successfully');
        alert('Confirmation email sent! Please check your inbox and click the confirmation link.');
      }
    } catch (error) {
      console.error('Chat: Unexpected error:', error);
      alert('Failed to resend confirmation email. Check the browser console for details.');
    } finally {
      setIsResendingEmail(false);
    }
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
        <GroupChatInterface onClose={handleCloseAll} onSwitchToAI={switchToAIChat} />
      </div>
    );
  }

  // Show profile view
  if (showProfileView) {
    return <ProfileView onClose={handleCloseAll} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
            {/* Llama Avatar with enhanced glow */}
            <div className="relative">
              {/* Glow effect background */}
              <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 blur-2xl scale-110 opacity-60"></div>
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="/lovable-uploads/2f5d5174-f2f2-424d-b6d9-61b81c9bca6b.png"
                  alt="Llama avatar"
                  className="w-36 h-36 object-cover rounded-full"
                />
              </div>
            </div>

            {/* Welcome Text */}
            <motion.div
              className="text-center space-y-4 max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h1
                className="text-3xl font-bold text-slate-800 leading-tight"
                key={welcomeTextVariant}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {welcomeTextVariant === 0 ? (
                  <>
                    Hey, I'm Serin 👋<br />
                    <span className="text-2xl font-medium">
                      Let's make life feel better, together.
                    </span>
                  </>
                ) : (
                  <>
                    Here for your feels 💜<br />
                    <span className="text-2xl font-medium">
                      Let's make life feel better, together.
                    </span>
                  </>
                )}
              </motion.h1>
            </motion.div>
          </motion.div>

          {/* Choice Buttons */}
          <motion.div
            className="flex flex-col space-y-4 w-full max-w-sm"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* Choice 1 - Light gray/white */}
            <motion.button
              onClick={() => handleChoiceClick("I'm not doing great")}
              className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-full text-lg font-medium transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              I'm not doing great
            </motion.button>

            {/* Choice 2 - Bright Yellow */}
            <motion.button
              onClick={() => handleChoiceClick("Talk to someone like me")}
              className="w-full py-4 px-6 bg-yellow-300 hover:bg-yellow-400 text-slate-700 rounded-full text-lg font-medium transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Talk to someone like me
            </motion.button>

            {/* Choice 3 - Light Pink */}
            <motion.button
              onClick={() => handleChoiceClick("Something else...")}
              className="w-full py-4 px-6 bg-pink-200 hover:bg-pink-300 text-slate-700 rounded-full text-lg font-medium transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Something else...
            </motion.button>
          </motion.div>
        </div>
      ) : (
        /* Chat Interface - Small icons on top, centered content */
        <div className="flex-1 flex flex-col">
          {/* Top button section */}
          <motion.div
            className="flex items-start justify-center space-x-8 pt-12 pb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Voice Input Button */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center shadow-lg">
                <Mic className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-center max-w-24">
                <p className="text-sm text-gray-700 font-medium leading-tight">Too tired to type?</p>
                <p className="text-xs text-gray-600">Just say it out loud</p>
              </div>
            </div>

            {/* Peer Connect Button */}
            <motion.button
              onClick={switchToPeerChat}
              className="flex flex-col items-center space-y-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 rounded-full bg-teal-400 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-center max-w-24">
                <p className="text-sm text-gray-700 font-medium leading-tight">Wanna talk</p>
                <p className="text-xs text-gray-600">to someone like you</p>
              </div>
            </motion.button>
          </motion.div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8">
            {/* Current message display */}
            <motion.div
              className="text-center space-y-4 max-w-md min-h-[120px] flex items-center justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-bold text-slate-800 leading-tight whitespace-pre-line">
                {isGeneratingResponse ? (
                  <div className="flex items-center space-x-2">
                    <span>Thinking...</span>
                    <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  currentDisplayText
                )}
              </div>
            </motion.div>

            {/* Input area */}
            <motion.div
              className="w-full max-w-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 bg-white rounded-full p-4 shadow-md border border-gray-100">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Say anything... I'm listening"
                  className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-400 focus:ring-0 text-base"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 text-white p-0 shrink-0"
                  disabled={!isUserTurn || !newMessage.trim() || isGeneratingResponse}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Privacy notice */}
            <motion.div
              className="text-center space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                <span>🔒</span>
                <span>Private. Just you & Serin.</span>
              </p>
              <p className="text-sm text-purple-600 underline cursor-pointer hover:text-purple-700">
                Learn how we use your data
              </p>
            </motion.div>
          </div>

        </div>
      )}


      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-slate-800 mb-4">Your Profile</DialogTitle>
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
              {isEditingNickname ? (
                <div className="space-y-3">
                  <Input
                    value={editedNickname}
                    onChange={(e) => setEditedNickname(e.target.value)}
                    className="text-center text-xl font-semibold"
                    maxLength={20}
                    placeholder="Enter nickname"
                  />
                  <div className="flex space-x-2 justify-center">
                    <Button
                      size="sm"
                      onClick={handleSaveNickname}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 text-sm"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="px-4 py-1 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profile?.nickname || user?.user_metadata?.name || 'You'}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditNickname}
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <Edit className="h-3 w-3 text-gray-500" />
                    </Button>
                  </div>
                  <p className="text-gray-600">Wellness Journey Member</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">4</div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">38</div>
                  <div className="text-sm text-gray-600">Check-ins</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">4</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
              </div>
            </div>

            {/* Email Confirmation Status */}
            {(() => {
              // Check both auth state and profile state for email confirmation
              const isEmailConfirmed = user?.email_confirmed_at || profile?.email_confirmed;
              const shouldShowConfirmation = user && !isEmailConfirmed;
              
              return shouldShowConfirmation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <p className="text-sm font-medium text-yellow-800">Email Confirmation Pending</p>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Please check your inbox and confirm your email address to access all features.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={isResendingEmail}
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    {isResendingEmail ? 'Sending...' : 'Resend Confirmation Email'}
                  </Button>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-full"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowChatInterface(true);
                }}
              >
                Chat History
              </Button>

              <Button
                variant="outline"
                className="w-full py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  console.log('Instagram clicked');
                }}
              >
                Instagram
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowProfileModal(false);
                    console.log('Settings clicked');
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="py-3 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    console.log('Contact Us clicked');
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contact Us
                </Button>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full py-3 rounded-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={async () => {
                  const { error } = await signOut();
                  if (!error) {
                    setShowProfileModal(false);
                    navigate('/');
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;