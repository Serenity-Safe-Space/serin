import { useState, useEffect } from 'react';

interface AppState {
  availableFeatures: {
    feed: boolean;
    communities: boolean;
    profile: boolean;
  };
  conversationCount: number;
  hasCompletedWelcome: boolean;
  emotionalReadiness: {
    forCommunity: boolean;
    forSharing: boolean;
    forProgress: boolean;
  };
  pendingRecommendations: Array<{
    id: string;
    type: 'feed' | 'communities' | 'profile' | 'content';
    title: string;
    description: string;
    timestamp: Date;
  }>;
}

const DEFAULT_STATE: AppState = {
  availableFeatures: {
    feed: false,
    communities: false,
    profile: false,
  },
  conversationCount: 0,
  hasCompletedWelcome: false,
  emotionalReadiness: {
    forCommunity: false,
    forSharing: false,
    forProgress: false,
  },
  pendingRecommendations: [],
};

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('serinAppState');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('serinAppState', JSON.stringify(appState));
  }, [appState]);

  const enableFeature = (feature: keyof AppState['availableFeatures']) => {
    setAppState(prev => ({
      ...prev,
      availableFeatures: {
        ...prev.availableFeatures,
        [feature]: true,
      },
    }));
  };

  const addRecommendation = (recommendation: Omit<AppState['pendingRecommendations'][0], 'id' | 'timestamp'>) => {
    setAppState(prev => ({
      ...prev,
      pendingRecommendations: [
        ...prev.pendingRecommendations,
        {
          ...recommendation,
          id: Date.now().toString(),
          timestamp: new Date(),
        }
      ],
    }));
  };

  const removeRecommendation = (id: string) => {
    setAppState(prev => ({
      ...prev,
      pendingRecommendations: prev.pendingRecommendations.filter(r => r.id !== id),
    }));
  };

  const updateEmotionalReadiness = (aspect: keyof AppState['emotionalReadiness'], ready: boolean) => {
    setAppState(prev => ({
      ...prev,
      emotionalReadiness: {
        ...prev.emotionalReadiness,
        [aspect]: ready,
      },
    }));
  };

  const incrementConversation = () => {
    setAppState(prev => ({
      ...prev,
      conversationCount: prev.conversationCount + 1,
    }));
  };

  const completeWelcome = () => {
    setAppState(prev => ({
      ...prev,
      hasCompletedWelcome: true,
    }));
  };

  const resetApp = () => {
    setAppState(DEFAULT_STATE);
  };

  return {
    appState,
    enableFeature,
    addRecommendation,
    removeRecommendation,
    updateEmotionalReadiness,
    incrementConversation,
    completeWelcome,
    resetApp,
  };
};