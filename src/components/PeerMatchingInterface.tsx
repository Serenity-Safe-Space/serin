import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PeerMatchingInterfaceProps {
  onClose: () => void;
  onBeginChat: () => void;
  onChatHistory: () => void;
  onViewProfile?: () => void;
}

const PeerMatchingInterface: React.FC<PeerMatchingInterfaceProps> = ({
  onClose,
  onBeginChat,
  onChatHistory,
  onViewProfile
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Chat History Icon - Fixed position */}
      <motion.button
        onClick={onChatHistory}
        className="fixed top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Clock className="w-6 h-6 text-purple-600" />
      </motion.button>

      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="fixed top-6 left-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl text-purple-600">×</span>
      </motion.button>

      <motion.div
        className="flex flex-col items-center space-y-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Microphone Icon with glow */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-2xl relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 blur-lg scale-110 opacity-70"></div>
          <div className="relative z-10">
            <Mic className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Match Text */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            I've matched you with another peer to connect and support each other.
          </h2>
        </motion.div>

        {/* User Avatars */}
        <motion.div
          className="flex items-center justify-center space-x-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Emma */}
          <motion.div
            className="flex flex-col items-center space-y-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center shadow-lg cursor-pointer"
              onClick={onViewProfile}
            >
              <div className="w-20 h-20 rounded-full bg-orange-300 flex items-center justify-center relative overflow-hidden">
                {/* Simple avatar representation */}
                <div className="w-full h-full bg-gradient-to-b from-orange-200 to-orange-400 rounded-full flex items-center justify-center">
                  <div className="text-2xl">👩</div>
                </div>
              </div>
            </div>
            <span className="text-xl font-semibold text-gray-800">Emma</span>
          </motion.div>

          {/* Ethan */}
          <motion.div
            className="flex flex-col items-center space-y-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, type: "spring" }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-purple-400 flex items-center justify-center relative overflow-hidden">
                {/* Simple avatar representation */}
                <div className="w-full h-full bg-gradient-to-b from-purple-300 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="text-2xl">👨</div>
                </div>
              </div>
            </div>
            <span className="text-xl font-semibold text-gray-800">Ethan</span>
          </motion.div>
        </motion.div>

        {/* Begin Chat Button */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={onBeginChat}
            className="w-full py-4 px-8 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-purple-700 rounded-full text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-none"
            size="lg"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Begin Chat
          </Button>
        </motion.div>

        {/* Connection Info */}
        <motion.div
          className="text-center text-sm text-gray-600 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="font-medium">What you have in common:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Stress management</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">Work-life balance</span>
          </div>
          <p className="text-xs mt-3 text-gray-500">Both looking to improve mental wellness together</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PeerMatchingInterface;