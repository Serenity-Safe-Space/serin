import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileViewProps {
  onClose: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <motion.div
        className="flex flex-col items-center space-y-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Avatar */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center shadow-2xl p-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-28 h-28 rounded-full bg-orange-300 flex items-center justify-center relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-orange-200 to-orange-400 rounded-full flex items-center justify-center">
              <div className="text-4xl">👩</div>
            </div>
          </div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-purple-600">Emma</h2>
          <p className="text-lg text-gray-600">Wellness Journey Member</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center space-x-12 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Days Active */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">7</div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>

          {/* Check-ins */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">24</div>
              <div className="text-sm text-gray-600">Check-ins</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">3</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </motion.div>

        {/* View Profile Button */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onClose}
            className="w-full py-4 px-8 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            size="lg"
          >
            View Profile
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileView;