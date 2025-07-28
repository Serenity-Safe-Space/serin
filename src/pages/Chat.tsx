import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Users, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import geminiService from '@/services/geminiService';

const Chat = () => {
  console.log('Chat: Component mounted');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentDisplayText, setCurrentDisplayText] = useState("Gotchu. Let's talk.\nMood's all yours – spill it");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Initialize Gemini service
  useEffect(() => {
    console.log('Chat: Initializing Gemini service');
    try {
      const initialMessage = geminiService.getInitialMessage();
      setCurrentDisplayText(initialMessage);
      console.log('Chat: Gemini service initialized successfully');
    } catch (error) {
      console.error('Chat: Failed to initialize Gemini service:', error);
      setCurrentDisplayText("⚠️ AI service temporarily unavailable. You can still type here!");
    }
  }, []);

  const sendMessage = async () => {
    console.log('Chat.sendMessage: Starting with message:', newMessage);
    
    if (!newMessage.trim() || !isUserTurn || isGeneratingResponse) {
      console.log('Chat.sendMessage: Blocked - invalid conditions');
      return;
    }

    const userMessageText = newMessage;
    console.log('Chat.sendMessage: Processing message:', userMessageText);
    
    setNewMessage('');
    setIsUserTurn(false);
    setIsGeneratingResponse(true);
    setConversationStarted(true);

    // Show user message while generating response
    setCurrentDisplayText(userMessageText);

    try {
      console.log('Chat.sendMessage: Calling Gemini service...');
      const botResponse = await geminiService.sendMessage(userMessageText);
      console.log('Chat.sendMessage: Received bot response');
      
      setCurrentDisplayText(botResponse);
      console.log('Chat.sendMessage: Updated display with bot response');
    } catch (error) {
      console.error('Chat.sendMessage: Error occurred:', error);
      setCurrentDisplayText("Sorry, I'm having trouble right now. Can you try again? 😊");
    } finally {
      setIsGeneratingResponse(false);
      setIsUserTurn(true);
      console.log('Chat.sendMessage: Completed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-purple-600 hover:text-purple-700"
        >
          ← Back to Home
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="h-12 w-12 rounded-full"
        >
          <User className="h-6 w-6 text-orange-500" />
        </Button>
      </div>

      {/* Chat Interface */}
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
                onChange={(e) => {
                  console.log('Chat.Input.onChange: New value:', e.target.value);
                  setNewMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  console.log('Chat.Input.onKeyDown: Key pressed:', e.key);
                  if (e.key === 'Enter' && !e.shiftKey) {
                    console.log('Chat.Input.onKeyDown: Enter pressed, calling sendMessage');
                    sendMessage();
                  }
                }}
                placeholder="Say anything... I'm listening"
                className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-400 focus:ring-0 text-base"
              />
              <Button
                onClick={() => {
                  console.log('Chat.Button.onClick: Send button clicked');
                  sendMessage();
                }}
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
    </div>
  );
};

export default Chat;