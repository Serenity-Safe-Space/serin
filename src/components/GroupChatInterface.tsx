import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GroupChatInterfaceProps {
  onClose: () => void;
}

const GroupChatInterface: React.FC<GroupChatInterfaceProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header with avatars */}
      <motion.div 
        className="flex items-center justify-center space-x-12 pt-12 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Emma */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-orange-300 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-orange-200 to-orange-400 rounded-full flex items-center justify-center">
                <div className="text-xl">👩</div>
              </div>
            </div>
          </div>
          <span className="text-lg font-semibold text-purple-600">Emma</span>
        </div>

        {/* Ethan */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-purple-400 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-purple-300 to-purple-500 rounded-full flex items-center justify-center">
                <div className="text-xl">👨</div>
              </div>
            </div>
          </div>
          <span className="text-lg font-semibold text-purple-600">Ethan</span>
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 px-6 pb-6">
        {/* Welcome message */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg mx-auto max-w-xs text-center">
            <p className="text-gray-700 font-medium">Hey, how are you doing?</p>
          </div>
        </motion.div>

        {/* Sample message from user */}
        <motion.div 
          className="mb-8 flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-purple-300 rounded-2xl px-4 py-3 max-w-xs">
            <p className="text-purple-900 font-medium">I've been feeling a bit overwhelmed lately.</p>
          </div>
        </motion.div>

        {/* Spacer to push input to bottom */}
        <div className="flex-1" />
      </div>

      {/* Input area */}
      <motion.div 
        className="px-6 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message"
            className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-500 focus:ring-0 text-lg"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChatInterface;