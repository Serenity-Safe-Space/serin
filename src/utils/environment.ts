// Environment detection utilities

export interface EnvironmentInfo {
  isDevelopment: boolean;
  isProduction: boolean;
  isLocalhost: boolean;
  isVercel: boolean;
  origin: string;
  hostname: string;
  mode: string;
}

export const getEnvironmentInfo = (): EnvironmentInfo => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const mode = import.meta.env.MODE;
  
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isVercel = hostname.includes('vercel.app') || hostname.includes('serin');
  const isDevelopment = mode === 'development' || isLocalhost;
  const isProduction = mode === 'production' && !isLocalhost;

  return {
    isDevelopment,
    isProduction,
    isLocalhost,
    isVercel,
    origin,
    hostname,
    mode,
  };
};

export const getBaseURL = (): string => {
  const env = getEnvironmentInfo();
  
  if (env.isLocalhost) {
    return 'http://localhost:8080';
  }
  
  if (env.isVercel) {
    return env.origin;
  }
  
  // Fallback
  return env.origin;
};

export const logEnvironmentInfo = (context: string) => {
  const env = getEnvironmentInfo();
  
  console.log(`🌍 Environment Info [${context}]:`, {
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
    isLocalhost: env.isLocalhost,
    isVercel: env.isVercel,
    origin: env.origin,
    hostname: env.hostname,
    mode: env.mode,
    timestamp: new Date().toISOString()
  });
  
  return env;
};