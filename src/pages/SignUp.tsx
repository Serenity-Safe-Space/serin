import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, redirecting to /chat');
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Error signing in:', error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign-in later
    console.log('Apple sign-in not implemented yet');
  };

  const handleEmailSignUp = () => {
    // TODO: Implement email sign-up later
    console.log('Email sign-up not implemented yet');
  };

  const handleExistingAccount = () => {
    navigate('/auth');
  };

  // Show loading spinner while checking auth state, but with timeout
  if (loading) {
    console.log('SignUp page: Auth loading state');
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-purple-600 mb-2">Loading...</div>
        <div className="text-sm text-gray-500">Checking authentication status</div>
      </div>
    );
  }

  // If user exists but we're still here, something went wrong with redirect
  if (user) {
    console.log('User exists but redirect failed, forcing navigation');
    navigate('/chat', { replace: true });
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-purple-600">Redirecting...</div>
      </div>
    );
  }

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
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-start w-full">
              <div className="w-5 h-5 mr-4">
                {/* Google Icon placeholder - using a colored G for now */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
              </div>
              <span>{isSigningIn ? 'Signing in...' : 'Sign up with Google'}</span>
            </div>
          </Button>

          {/* Apple Sign Up */}
          <Button
            onClick={handleAppleSignIn}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="flex items-center justify-start w-full">
              <div className="w-5 h-5 mr-4">
                {/* Apple Icon placeholder - using a black apple shape */}
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  🍎
                </div>
              </div>
              <span>Sign up with Apple (Coming Soon)</span>
            </div>
          </Button>

          {/* Email Sign Up */}
          <Button
            onClick={handleEmailSignUp}
            variant="outline"
            className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="flex items-center justify-start w-full">
              <Mail className="w-5 h-5 mr-4 text-gray-600" />
              <span>Sign up with Email (Coming Soon)</span>
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