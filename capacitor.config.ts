import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tca.digital.library',
  appName: 'TCA Digital Library',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: false
    }
  }
};

export default config;
