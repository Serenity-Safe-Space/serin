import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  console.log('HomePage: Component rendering/re-rendering');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [welcomeTextVariant, setWelcomeTextVariant] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Randomly switch welcome text variant
  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeTextVariant(prev => Math.random() > 0.7 ? (prev === 0 ? 1 : 0) : prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChoiceClick = (choice: string) => {
    console.log('HomePage.handleChoiceClick: Choice selected:', choice);
    
    if (choice === "I'm not doing great") {
      console.log('HomePage: Navigating to /chat');
      navigate('/chat');
    } else if (choice === "Talk to someone like me") {
      console.log('HomePage: Peer matching not implemented yet');
      // Future: navigate to peer matching
    } else {
      console.log('HomePage: Other choice, navigating to /chat');
      navigate('/chat');
    }
  };

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
            onClick={() => navigate('/profile')}
            className="h-16 w-16 rounded-full bg-card/60 backdrop-blur-xl border border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            <User className="h-8 w-8 text-orange-500" />
          </Button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            👤 {user ? 'Your Profile' : 'Sign In'}
          </div>
        </div>
      </motion.div>

      {/* Welcome Screen */}
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
    </div>
  );
};

export default HomePage;