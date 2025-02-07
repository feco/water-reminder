import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goulven.water',
  appName: 'water-reminder',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
