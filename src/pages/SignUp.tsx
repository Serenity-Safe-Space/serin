import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const SignUp = () => {
  console.log('SignUp: Component rendering/re-rendering');
  
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isProcessingTokens, setIsProcessingTokens] = useState(false);
  
  console.log('SignUp: Current state:', { 
    user: !!user, 
    loading, 
    isSigningIn, 
    isProcessingTokens,
    userId: user?.id 
  });

  // Check for OAuth tokens in URL hash on component mount
  useEffect(() => {
    const handleOAuthTokens = async () => {
      console.log('SignUp: Checking for OAuth tokens on mount. Current URL:', window.location.href);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        console.log('SignUp: ✅ OAuth tokens detected in URL hash, processing...');
        console.log('SignUp: Current page:', window.location.pathname);
        setIsProcessingTokens(true);
        
        try {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('SignUp: Error setting session:', error);
          } else {
            console.log('SignUp: Session set successfully, tokens processed');
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
            // Don't redirect here - let the user auth state change handle it
          }
        } catch (error) {
          console.error('SignUp: Exception processing tokens:', error);
        } finally {
          setIsProcessingTokens(false);
        }
      }
    };

    handleOAuthTokens();
  }, []);

  // No automatic redirects - let users navigate manually

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

  // Show loading spinner while checking auth state or processing tokens
  if (loading || isProcessingTokens) {
    console.log('SignUp page: Auth loading state or processing tokens');
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-purple-600 mb-2">Loading...</div>
        <div className="text-sm text-gray-500">
          {isProcessingTokens ? 'Processing sign-in...' : 'Checking authentication status'}
        </div>
      </div>
    );
  }

  // Show authenticated homepage content for signed-in users

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
            {user ? 'Welcome to Serin' : 'Sign up to get started'}
          </h1>
          {user && (
            <p className="text-gray-600 text-lg">
              You're all set! Ready to start chatting?
            </p>
          )}
        </motion.div>

        {/* Conditional Content Based on Auth State */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user ? (
            // Authenticated User Content
            <>
              <Button
                onClick={() => navigate('/chat')}
                className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-base font-medium transition-colors"
              >
                Start Chatting with Serin
              </Button>
              
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors"
              >
                View Profile
              </Button>
            </>
          ) : (
            // Non-authenticated User Content
            <>
              {/* Google Sign Up */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                variant="outline"
                className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-base font-medium transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-start w-full">
                  <div className="w-5 h-5 mr-4">
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
            </>
          )}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {user ? (
            <button
              onClick={() => {
                // Handle sign out logic here if needed
                navigate('/profile');
              }}
              className="text-gray-700 text-base hover:text-gray-900 transition-colors"
            >
              Manage Account
            </button>
          ) : (
            <button
              onClick={handleExistingAccount}
              className="text-gray-700 text-base hover:text-gray-900 transition-colors"
            >
              I already have an account
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;