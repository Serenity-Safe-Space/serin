import { useState, useEffect } from 'react';

interface AppState {
  unlockedFeatures: {
    feed: boolean;
    communities: boolean;
    profile: boolean;
  };
  conversationCount: number;
  hasCompletedWelcome: boolean;
}

const DEFAULT_STATE: AppState = {
  unlockedFeatures: {
    feed: false,
    communities: false,
    profile: false,
  },
  conversationCount: 0,
  hasCompletedWelcome: false,
};

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('serinAppState');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('serinAppState', JSON.stringify(appState));
  }, [appState]);

  const unlockFeature = (feature: keyof AppState['unlockedFeatures']) => {
    setAppState(prev => ({
      ...prev,
      unlockedFeatures: {
        ...prev.unlockedFeatures,
        [feature]: true,
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
    unlockFeature,
    incrementConversation,
    completeWelcome,
    resetApp,
  };
};