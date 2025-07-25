/**
 * Environment debugging utilities to help identify discrepancies between local and production
 */

export interface EnvironmentInfo {
  isDevelopment: boolean;
  isProduction: boolean;
  mode: string;
  hostname: string;
  userAgent: string;
  geminiApiKeyPresent: boolean;
  geminiApiKeyLength: number;
  geminiApiKeyValid: boolean;
  buildTime: string;
  timestamp: string;
  supabaseUrl: string;
  supabaseKeyPresent: boolean;
}

export const getEnvironmentInfo = (): EnvironmentInfo => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    geminiApiKeyPresent: !!geminiKey,
    geminiApiKeyLength: geminiKey ? geminiKey.length : 0,
    geminiApiKeyValid: geminiKey ? geminiKey.startsWith('AI') : false,
    buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'unknown',
    timestamp: new Date().toISOString(),
    supabaseUrl: supabaseUrl || 'missing',
    supabaseKeyPresent: !!supabaseKey,
  };
};

export const logEnvironmentInfo = (context: string = 'General') => {
  const info = getEnvironmentInfo();
  console.group(`🔍 Environment Debug - ${context}`);
  console.log('Environment:', info.isDevelopment ? 'Development' : 'Production');
  console.log('Hostname:', info.hostname);
  console.log('Mode:', info.mode);
  console.log('Build Time:', info.buildTime);
  console.log('Gemini API Key:', {
    present: info.geminiApiKeyPresent,
    length: info.geminiApiKeyLength,
    valid: info.geminiApiKeyValid,
    firstChars: import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.substring(0, 8) + '...' : 'null'
  });
  console.log('Supabase Config:', {
    url: info.supabaseUrl.substring(0, 30) + '...',
    keyPresent: info.supabaseKeyPresent
  });
  console.log('User Agent:', info.userAgent.substring(0, 50) + '...');
  console.groupEnd();
  
  return info;
};

export const compareEnvironments = (localInfo: EnvironmentInfo, prodInfo: EnvironmentInfo) => {
  console.group('🔄 Environment Comparison');
  
  const differences = [];
  
  if (localInfo.geminiApiKeyPresent !== prodInfo.geminiApiKeyPresent) {
    differences.push('Gemini API Key presence mismatch');
  }
  
  if (localInfo.geminiApiKeyLength !== prodInfo.geminiApiKeyLength) {
    differences.push('Gemini API Key length mismatch');
  }
  
  if (localInfo.supabaseKeyPresent !== prodInfo.supabaseKeyPresent) {
    differences.push('Supabase key presence mismatch');
  }
  
  if (differences.length > 0) {
    console.error('❌ Environment Differences Found:', differences);
  } else {
    console.log('✅ No major environment differences detected');
  }
  
  console.table([
    { Environment: 'Local', ...localInfo },
    { Environment: 'Production', ...prodInfo }
  ]);
  
  console.groupEnd();
  
  return differences;
};

// Auto-log environment info on import in development
if (import.meta.env.DEV) {
  console.log('🚀 Development Environment Loaded');
  logEnvironmentInfo('Startup');
}