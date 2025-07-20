import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'login' | 'signup' | 'onboarding'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    interests: '',
    goals: '',
    mood: ''
  });

  const handleAuth = () => {
    if (step === 'signup') {
      setStep('onboarding');
    } else {
      navigate('/feed');
    }
  };

  const handleOnboardingComplete = () => {
    navigate('/feed');
  };

  if (step === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-soft animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-primary p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Let's get to know you
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="interests">What are your interests?</Label>
              <Textarea
                id="interests"
                placeholder="Mental health, mindfulness, gaming, art..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals">What are your wellness goals?</Label>
              <Textarea
                id="goals"
                placeholder="Reduce anxiety, improve sleep, connect with others..."
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">How are you feeling today?</Label>
              <Input
                id="mood"
                placeholder="Happy, anxious, curious, hopeful..."
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              />
            </div>

            <Button 
              onClick={handleOnboardingComplete}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Welcome to Serin!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-4 rounded-full animate-bounce-in">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Serin
          </CardTitle>
          <p className="text-muted-foreground">Your wellness companion</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {step === 'signup' && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleAuth}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {step === 'login' ? 'Sign In' : 'Continue'}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setStep(step === 'login' ? 'signup' : 'login')}
              className="text-primary hover:text-primary-glow transition-colors text-sm"
            >
              {step === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;