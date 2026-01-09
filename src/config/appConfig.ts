/**
 * App Configuration
 * Controls demo mode and other settings
 */

// Set to true for demo/development mode with mock data
// Set to false for production with real KPC servers
export const APP_CONFIG = {
  DEMO_MODE: false, // Changed to false to use real KPC servers
  
  // Demo credentials for testing (only used when DEMO_MODE = true)
  DEMO_CREDENTIALS: [
    { username: 'demo', password: 'demo123', label: 'Demo User' },
    { username: 'kpc.user', password: 'password', label: 'KPC User' },
    { username: 'admin', password: 'admin123', label: 'Administrator' },
    { username: 'test', password: 'test123', label: 'Test User' },
  ],
  
  // App settings
  APP_NAME: 'KPC QMS',
  VERSION: '1.0.0',
  THEME_COLOR: '#DC143C', // KPC Crimson Red
  
  // API settings
  API_TIMEOUT: 30000,
  MAX_RETRIES: 2,
  
  // Features
  FEATURES: {
    BIOMETRIC_AUTH: true,
    REMEMBER_CREDENTIALS: true,
    DARK_THEME: true,
    OFFLINE_MODE: true,
  }
};

export default APP_CONFIG;