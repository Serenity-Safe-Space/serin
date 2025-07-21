import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface FloatingAvatarProps {
  className?: string;
}

const FloatingAvatar = ({ className = '' }: FloatingAvatarProps) => {
  return (
    <motion.div
      className={`fixed top-6 right-6 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Avatar className="h-16 w-16 ring-4 ring-primary/30 ring-offset-4 ring-offset-background shadow-glow">
        <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
          S
        </AvatarFallback>
      </Avatar>
      
      {/* Gentle breathing animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default FloatingAvatar;