import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import OfflineEncouragement from "@/components/OfflineEncouragement";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Communities from "./pages/Communities";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";
import "@/utils/deploymentCheck"; // Auto-run deployment checks
import { addDeploymentHeaders, logDeploymentInfo } from "@/utils/deploymentDebug";

const queryClient = new QueryClient();

// Initialize deployment debugging
addDeploymentHeaders();
logDeploymentInfo('App Initialization');

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="serin-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <OfflineEncouragement />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/confirm-email" element={<EmailConfirmation />} />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Chat />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/feed" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Feed />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/communities" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Communities />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ErrorBoundary>
                        <Profile />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
