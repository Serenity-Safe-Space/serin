import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // For now, just navigate to chat page
    navigate('/chat');
  };

  const handleExistingAccount = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main Title */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-purple-800 leading-tight">
            Sign up to<br />
            get started
          </h1>
        </motion.div>

        {/* Sign-up Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Google Sign Up */}
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors"
          >
            <div className="flex items-center justify-start w-full">
              <div className="w-5 h-5 mr-4">
                {/* Google Icon placeholder - using a colored G for now */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
              </div>
              <span>Sign up with Google</span>
            </div>
          </Button>

          {/* Apple Sign Up */}
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors"
          >
            <div className="flex items-center justify-start w-full">
              <div className="w-5 h-5 mr-4">
                {/* Apple Icon placeholder - using a black apple shape */}
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  🍎
                </div>
              </div>
              <span>Sign up with Apple</span>
            </div>
          </Button>

          {/* Email Sign Up */}
          <Button
            onClick={handleSignUp}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors"
          >
            <div className="flex items-center justify-start w-full">
              <Mail className="w-5 h-5 mr-4 text-gray-600" />
              <span>Sign up with Email</span>
            </div>
          </Button>
        </motion.div>

        {/* Existing Account Link */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleExistingAccount}
            className="text-gray-700 text-base hover:text-gray-900 transition-colors"
          >
            I already have an account
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;