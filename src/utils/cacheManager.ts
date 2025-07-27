// Cache management utilities for OAuth callbacks and fresh bundle loading

export const clearAllCaches = async (): Promise<void> => {
  try {
    console.log('CacheManager: Clearing all caches...');
    
    // Clear cache storage
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('CacheManager: Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }
    
    // Clear service worker if it exists
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          console.log('CacheManager: Unregistering service worker:', registration.scope);
          return registration.unregister();
        })
      );
    }
    
    // Clear local storage (but preserve user data)
    const keysToPreserve = ['user', 'profile', 'auth', 'appState'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToPreserve.some(preserve => key.includes(preserve))) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    console.log('CacheManager: All caches cleared successfully');
  } catch (error) {
    console.error('CacheManager: Error clearing caches:', error);
  }
};

export const detectBundleVersion = (): string => {
  const scriptTags = Array.from(document.querySelectorAll('script[src*="index-"]'));
  if (scriptTags.length > 0) {
    const src = scriptTags[0].getAttribute('src') || '';
    const match = src.match(/index-([^.]+)\.js/);
    return match ? match[1] : 'unknown';
  }
  return 'no-bundle-detected';
};

export const isOAuthCallback = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  return (
    urlParams.has('oauth_callback') ||
    urlParams.has('code') ||
    hashParams.has('access_token') ||
    hashParams.has('refresh_token')
  );
};

export const handleOAuthCacheIssues = async (): Promise<void> => {
  if (!isOAuthCallback()) {
    return;
  }
  
  console.log('CacheManager: OAuth callback detected, checking bundle version...');
  
  const bundleVersion = detectBundleVersion();
  console.log('CacheManager: Current bundle version:', bundleVersion);
  
  // Store the current bundle version for comparison
  const lastKnownVersion = localStorage.getItem('lastBundleVersion');
  
  if (lastKnownVersion && lastKnownVersion !== bundleVersion) {
    console.log('CacheManager: Bundle version changed, clearing caches...');
    await clearAllCaches();
  }
  
  localStorage.setItem('lastBundleVersion', bundleVersion);
  
  // Force reload if we detect potential cache issues
  const isHardReload = window.performance && window.performance.navigation.type === 1;
  if (!isHardReload && bundleVersion === 'unknown') {
    console.log('CacheManager: Unknown bundle detected during OAuth, forcing reload...');
    window.location.reload();
  }
};