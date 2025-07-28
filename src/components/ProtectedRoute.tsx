import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute: Checking access for', location.pathname, {
    user: !!user,
    loading,
    userId: user?.id
  });

  // Show loading spinner while checking authentication status
  if (loading) {
    console.log('ProtectedRoute: Showing loading spinner for', location.pathname);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-purple-600">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect to sign-up page
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to /signup from', location.pathname);
    // Save the attempted location for redirecting after login
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  console.log('ProtectedRoute: User authenticated, rendering protected content for', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;