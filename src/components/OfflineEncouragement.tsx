import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OfflineEncouragement: React.FC = () => {
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  const encouragementMessages = [
    "We missed you – how are you feeling today?",
    "Welcome back! Ready for some good vibes?",
    "Hey there! Let's check in with yourself today 💜",
    "You're back! How's your mental wellness journey going?",
    "Good to see you again! What's on your mind?"
  ];

  useEffect(() => {
    const savedLastVisit = localStorage.getItem('serin-last-visit');
    const currentTime = new Date().getTime();
    
    if (savedLastVisit) {
      const lastVisitTime = parseInt(savedLastVisit);
      const hoursSinceLastVisit = (currentTime - lastVisitTime) / (1000 * 60 * 60);
      
      // Show encouragement if user hasn't visited in more than 24 hours
      if (hoursSinceLastVisit > 24) {
        setShowEncouragement(true);
        setLastVisit(new Date(lastVisitTime).toLocaleDateString());
      }
    }
    
    // Update last visit time
    localStorage.setItem('serin-last-visit', currentTime.toString());
  }, []);

  const handleClose = () => {
    setShowEncouragement(false);
  };

  const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <AnimatePresence>
      {showEncouragement && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <Card className="max-w-sm w-full p-6 bg-gradient-warm border-none shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <h3 className="text-lg font-semibold text-foreground">Welcome back!</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="rounded-full p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {lastVisit && `Last visit: ${lastVisit}`}
                </p>
                <p className="text-foreground font-medium">
                  {randomMessage}
                </p>
                
                <Button 
                  onClick={handleClose}
                  className="w-full bg-gradient-primary border-none"
                >
                  Let's get started
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineEncouragement;