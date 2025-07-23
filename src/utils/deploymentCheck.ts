// Deployment configuration checker
// Use this to verify your production environment is set up correctly

interface ConfigCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

/**
 * Checks if all required environment variables are present
 */
export function checkEnvironmentVariables(): ConfigCheck[] {
  const checks: ConfigCheck[] = [];
  
  // Check Supabase URL
  if (import.meta.env.VITE_SUPABASE_URL) {
    checks.push({
      name: 'Supabase URL',
      status: 'success',
      message: 'Supabase URL is configured'
    });
  } else {
    checks.push({
      name: 'Supabase URL',
      status: 'error',
      message: 'VITE_SUPABASE_URL is missing'
    });
  }
  
  // Check Supabase Anon Key
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    checks.push({
      name: 'Supabase Anon Key',
      status: 'success',
      message: 'Supabase anon key is configured'
    });
  } else {
    checks.push({
      name: 'Supabase Anon Key',
      status: 'error',
      message: 'VITE_SUPABASE_ANON_KEY is missing'
    });
  }
  
  // Check Resend API Key
  if (import.meta.env.VITE_RESEND_API_KEY) {
    checks.push({
      name: 'Resend API Key',
      status: 'success',
      message: 'Resend API key is configured'
    });
  } else {
    checks.push({
      name: 'Resend API Key',
      status: 'error',
      message: 'VITE_RESEND_API_KEY is missing'
    });
  }
  
  return checks;
}

/**
 * Checks the current environment and deployment status
 */
export function checkDeploymentEnvironment(): ConfigCheck[] {
  const checks: ConfigCheck[] = [];
  
  // Check environment
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isProduction = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    (!window.location.hostname.includes('localhost') && window.location.protocol === 'https:')
  );
  
  if (isLocalhost) {
    checks.push({
      name: 'Environment',
      status: 'warning',
      message: 'Running in development mode'
    });
  } else if (isProduction) {
    checks.push({
      name: 'Environment',
      status: 'success',
      message: 'Running in production mode'
    });
  } else {
    checks.push({
      name: 'Environment',
      status: 'warning',
      message: 'Unknown environment detected'
    });
  }
  
  // Check HTTPS
  const hasHTTPS = typeof window !== 'undefined' && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost'
  );
  
  if (hasHTTPS) {
    checks.push({
      name: 'Security',
      status: 'success',
      message: 'HTTPS enabled'
    });
  } else {
    checks.push({
      name: 'Security',
      status: 'error',
      message: 'HTTPS is required for production'
    });
  }
  
  return checks;
}

/**
 * Runs all deployment checks and logs results
 */
export function runDeploymentChecks(): void {
  console.log('🚀 Running deployment configuration checks...');
  
  const envChecks = checkEnvironmentVariables();
  const deploymentChecks = checkDeploymentEnvironment();
  
  const allChecks = [...envChecks, ...deploymentChecks];
  
  // Log results
  allChecks.forEach(check => {
    const emoji = check.status === 'success' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    console.log(`${emoji} ${check.name}: ${check.message}`);
  });
  
  // Summary
  const errors = allChecks.filter(c => c.status === 'error').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;
  
  if (errors === 0 && warnings === 0) {
    console.log('🎉 All checks passed! Your app is ready for production.');
  } else if (errors === 0) {
    console.log(`⚠️ ${warnings} warnings found. App should work but check the items above.`);
  } else {
    console.log(`❌ ${errors} errors found. Please fix these before deploying to production.`);
  }
}

// Auto-run checks in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Run checks after a short delay to avoid blocking app startup
  setTimeout(runDeploymentChecks, 1000);
}