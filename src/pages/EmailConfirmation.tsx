import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmEmail, user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmailAddress = async () => {
      console.log('EmailConfirmation: Starting confirmation process...');
      
      const token = searchParams.get('token_hash');
      const type = searchParams.get('type');
      
      console.log('EmailConfirmation: Token present:', !!token, 'Type:', type);
      
      if (!token || type !== 'email') {
        console.error('EmailConfirmation: Invalid token or type');
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email and try again.');
        return;
      }

      try {
        console.log('EmailConfirmation: Calling confirmEmail...');
        const { error } = await confirmEmail(token);
        
        if (error) {
          console.error('EmailConfirmation: Confirmation failed:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email. The link may have expired.');
        } else {
          console.log('EmailConfirmation: Confirmation successful!');
          setStatus('success');
          setMessage('Your email has been confirmed successfully! Your profile should now be fully loaded.');
          
          // Give extra time for the auth context to update profile data
          setTimeout(() => {
            console.log('EmailConfirmation: Delayed profile refresh complete');
          }, 1500);
        }
      } catch (error) {
        console.error('EmailConfirmation: Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmailAddress();
  }, [searchParams, confirmEmail]);

  const handleContinue = () => {
    console.log('EmailConfirmation: User clicking continue, current user:', user ? 'exists' : 'null');
    
    if (user) {
      // Give a moment for any pending state updates to complete
      setTimeout(() => {
        navigate('/chat');
      }, 100);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        className="w-full max-w-md space-y-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Status Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          {status === 'loading' && (
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            {status === 'loading' && 'Confirming your email...'}
            {status === 'success' && 'Welcome to Serin! 💜'}
            {status === 'error' && 'Confirmation Failed'}
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            {status === 'loading' && 'Please wait while we confirm your email address...'}
            {message}
          </p>
        </motion.div>

        {/* Action Button */}
        {status !== 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={handleContinue}
              className={`w-full py-4 px-6 rounded-full text-lg font-medium transition-colors ${
                status === 'success'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {status === 'success' && user && 'Continue to Serin'}
              {status === 'success' && !user && 'Sign In'}
              {status === 'error' && 'Back to Home'}
            </Button>
          </motion.div>
        )}

        {/* Additional Help for Error State */}
        {status === 'error' && (
          <motion.div
            className="pt-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-500">
              Need help? Here are some things you can try:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Check if the link has expired and request a new one</li>
              <li>• Make sure you're using the latest email from Serin</li>
              <li>• Try opening the link in a different browser</li>
            </ul>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Request New Confirmation Email
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmailConfirmation;