import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Flag, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

  const conversationPrompts = [
    "Today's topic: How do you handle stress?",
    "Let's share 1 small win today.",
    "What's one thing you're grateful for right now?",
    "How do you practice self-care?"
  ];

  const currentPrompt = conversationPrompts[Math.floor(Math.random() * conversationPrompts.length)];

  return (
    <div className="flex-1 flex flex-col bg-pink-50">
      {/* Header with back button and report */}
      <div className="flex items-center justify-between p-4 bg-white">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => console.log('Report clicked')}
        >
          <Flag className="w-5 h-5" />
        </Button>
      </div>

      {/* Topic Prompt Banner */}
      <motion.div
        className="bg-yellow-300 px-6 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-medium text-gray-800">{currentPrompt}</p>
      </motion.div>
      {/* User avatars with nicknames */}
      <motion.div 
        className="flex items-center justify-center space-x-16 pt-8 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* KindSoul91 */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-orange-300 flex items-center justify-center shadow-lg">
            <div className="text-2xl">😊</div>
          </div>
          <span className="text-sm font-bold text-purple-800">KindSoul91</span>
        </div>

        {/* VibeChecker42 */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-purple-400 flex items-center justify-center shadow-lg">
            <div className="text-2xl">😊</div>
          </div>
          <span className="text-sm font-bold text-purple-800">VibeChecker42</span>
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 px-6 pb-6">
        {/* Incoming message */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-md max-w-xs">
            <p className="text-gray-800 font-medium">Hey, how are you doing?</p>
          </div>
        </motion.div>

        {/* Outgoing message from user */}
        <motion.div 
          className="mb-8 flex justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-purple-400 rounded-2xl px-4 py-3 max-w-xs">
            <p className="text-white font-medium">I've been feeling a bit overwhelmed lately.</p>
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
        <div className="flex items-center space-x-3 bg-white rounded-full p-4 shadow-md border border-gray-100">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say 👋 or drop your thoughts..."
            className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-400 focus:ring-0 text-base"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 text-white p-0 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChatInterface;