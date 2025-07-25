export const isProduction = () => {
  return import.meta.env.PROD || import.meta.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
};

export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    base_url: import.meta.env.BASE_URL,
    environment: isProduction() ? 'production' : 'development',
    hostname: window?.location?.hostname || 'unknown',
    pathname: window?.location?.pathname || 'unknown',
    search: window?.location?.search || '',
    hash: window?.location?.hash || '',
    user_agent: navigator?.userAgent || 'unknown'
  };
};

export const logDeploymentInfo = (context: string) => {
  const envInfo = getEnvironmentInfo();
  console.log(`🚀 Deployment Debug [${context}]:`, envInfo);
  return envInfo;
};

export const addDeploymentHeaders = () => {
  // Add deployment-specific debugging info to console
  if (isProduction()) {
    console.log('🎯 Production deployment detected');
    console.log('📍 Environment variables available:', Object.keys(import.meta.env));
  } else {
    console.log('🛠️ Development environment detected');
  }
};

// Error boundary utility for deployment debugging
export const captureDeploymentError = (error: Error, context: string) => {
  const envInfo = getEnvironmentInfo();
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    environment: envInfo,
    timestamp: new Date().toISOString()
  };
  
  console.error('🚨 Deployment Error Captured:', errorInfo);
  
  // In production, you could send this to an error tracking service
  if (isProduction()) {
    // Example: Send to error tracking service
    // errorTrackingService.captureException(errorInfo);
  }
  
  return errorInfo;
};