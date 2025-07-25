import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [authStatus, setAuthStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('Auth: Starting OAuth callback processing...');
      
      try {
        // Check if we have auth tokens in the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Auth: Hash params check:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hashLength: window.location.hash.length
        });

        if (accessToken && refreshToken) {
          console.log('Auth: Found tokens in hash, processing...');
          
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Auth: Error setting session:', error);
            setAuthStatus('error');
            setErrorMessage(`Authentication failed: ${error.message}`);
            return;
          }

          console.log('Auth: Session set successfully:', data);
          setAuthStatus('success');
          
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Wait a moment for auth context to update, then redirect
          setTimeout(() => {
            console.log('Auth: Redirecting to chat...');
            navigate('/chat', { replace: true });
          }, 500);
          
        } else {
          // No tokens in hash - check if user is already authenticated
          console.log('Auth: No tokens in hash, checking existing session...');
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Auth: Error checking session:', error);
            setAuthStatus('error');
            setErrorMessage(`Session check failed: ${error.message}`);
            return;
          }

          if (session) {
            console.log('Auth: Existing session found, redirecting...');
            setAuthStatus('success');
            navigate('/chat', { replace: true });
          } else {
            console.log('Auth: No session found, redirecting to sign-up...');
            setAuthStatus('error');
            setErrorMessage('No authentication session found');
            setTimeout(() => navigate('/', { replace: true }), 2000);
          }
        }
      } catch (error) {
        console.error('Auth: Exception during callback processing:', error);
        setAuthStatus('error');
        setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // If user is already authenticated (from context), redirect them
  useEffect(() => {
    if (!loading && user) {
      console.log('Auth: User already authenticated, redirecting to chat...');
      navigate('/chat', { replace: true });
    }
  }, [user, loading, navigate]);

  const getStatusMessage = () => {
    switch (authStatus) {
      case 'processing':
        return 'Processing your sign-in...';
      case 'success':
        return 'Sign-in successful! Redirecting...';
      case 'error':
        return 'Sign-in failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (authStatus) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Loading spinner */}
        {authStatus === 'processing' && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Success icon */}
        {authStatus === 'success' && (
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Error icon */}
        {authStatus === 'error' && (
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Serin
        </h1>
        
        <p className={`text-lg font-medium mb-4 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{errorMessage}</p>
            {authStatus === 'error' && (
              <p className="text-red-600 text-xs mt-2">
                Redirecting to sign-up page...
              </p>
            )}
          </div>
        )}

        {authStatus === 'processing' && (
          <p className="text-gray-500 text-sm">
            Please wait while we complete your sign-in...
          </p>
        )}

        {authStatus === 'success' && (
          <p className="text-green-600 text-sm">
            Taking you to your chat...
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;