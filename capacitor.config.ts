import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c6480cd41cdb4668ac04b1014643c21d',
  appName: 'Serin - Mental Wellness',
  webDir: 'dist',
  server: {
    url: 'https://c6480cd4-1cdb-4668-ac04-b1014643c21d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#E6F3FF",
      showSpinner: false
    }
  }
};

export default config;