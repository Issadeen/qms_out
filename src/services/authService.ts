import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { qmsApi } from '../api/client';

// Keys for secure storage
const CREDENTIALS_KEY = 'qms_credentials';
const REMEMBER_ME_KEY = 'qms_remember_me';
const BIOMETRIC_ENABLED_KEY = 'qms_biometric_enabled';
const LAST_DEPOT_KEY = 'qms_last_depot';

export interface StoredCredentials {
  username: string;
  password: string;
  depot?: string;
  timestamp: number;
}

export interface AuthSettings {
  rememberMe: boolean;
  biometricEnabled: boolean;
  lastDepot?: string;
}

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Save credentials securely
   */
  async saveCredentials(username: string, password: string, depot?: string): Promise<void> {
    try {
      const credentials: StoredCredentials = {
        username,
        password,
        depot,
        timestamp: Date.now(),
      };

      await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
      await SecureStore.setItemAsync(REMEMBER_ME_KEY, 'true');
      
      if (depot) {
        await SecureStore.setItemAsync(LAST_DEPOT_KEY, depot);
      }

      console.log('Credentials saved securely');
    } catch (error) {
      console.error('Failed to save credentials:', error);
      throw new Error('Failed to save credentials securely');
    }
  }

  /**
   * Get stored credentials
   */
  async getStoredCredentials(): Promise<StoredCredentials | null> {
    try {
      const credentialsString = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      const rememberMe = await SecureStore.getItemAsync(REMEMBER_ME_KEY);

      if (!credentialsString || rememberMe !== 'true') {
        return null;
      }

      const credentials: StoredCredentials = JSON.parse(credentialsString);
      
      // Check if credentials are too old (30 days)
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - credentials.timestamp > thirtyDaysInMs) {
        console.log('Stored credentials expired, clearing them');
        await this.clearCredentials();
        return null;
      }

      return credentials;
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  /**
   * Clear stored credentials
   */
  async clearCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
      await SecureStore.setItemAsync(REMEMBER_ME_KEY, 'false');
      console.log('Credentials cleared');
    } catch (error) {
      console.error('Failed to clear credentials:', error);
    }
  }

  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      return hasHardware && supportedTypes.length > 0 && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Enable/disable biometric authentication
   */
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.error('Failed to set biometric preference:', error);
    }
  }

  /**
   * Check if biometric authentication is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to get biometric preference:', error);
      return false;
    }
  }

  /**
   * Authenticate with biometrics
   */
  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access QMS\nUse your fingerprint or face to login',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Attempt auto-login with stored credentials
   */
  async attemptAutoLogin(): Promise<{ success: boolean; depot?: string; requiresDepotSelection?: boolean }> {
    try {
      const credentials = await this.getStoredCredentials();
      if (!credentials) {
        return { success: false };
      }

      // Check if biometric is enabled and available
      const biometricEnabled = await this.isBiometricEnabled();
      const biometricAvailable = await this.isBiometricAvailable();

      if (biometricEnabled && biometricAvailable) {
        const biometricSuccess = await this.authenticateWithBiometric();
        if (!biometricSuccess) {
          return { success: false };
        }
      }

      console.log('Attempting auto-login for user:', credentials.username);
      
      // Try to login with stored credentials
      const loginResult = await qmsApi.login(credentials.username, credentials.password);
      
      if (loginResult.success) {
        console.log('Auto-login successful');
        
        // If we have a stored depot, set it directly
        if (credentials.depot) {
          qmsApi.setWorkingDepot(credentials.depot);
          return { success: true, depot: credentials.depot };
        } else {
          // Need depot selection
          return { success: true, requiresDepotSelection: true };
        }
      } else {
        console.log('Auto-login failed, clearing stored credentials');
        await this.clearCredentials();
        return { success: false };
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      await this.clearCredentials();
      return { success: false };
    }
  }

  /**
   * Get the last used depot
   */
  async getLastDepot(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(LAST_DEPOT_KEY);
    } catch (error) {
      console.error('Failed to get last depot:', error);
      return null;
    }
  }

  /**
   * Save the last used depot
   */
  async saveLastDepot(depot: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(LAST_DEPOT_KEY, depot);
    } catch (error) {
      console.error('Failed to save last depot:', error);
    }
  }

  /**
   * Get authentication settings
   */
  async getAuthSettings(): Promise<AuthSettings> {
    try {
      const rememberMe = await SecureStore.getItemAsync(REMEMBER_ME_KEY) === 'true';
      const biometricEnabled = await this.isBiometricEnabled();
      const lastDepot = await this.getLastDepot();

      return {
        rememberMe,
        biometricEnabled,
        lastDepot: lastDepot || undefined,
      };
    } catch (error) {
      console.error('Failed to get auth settings:', error);
      return {
        rememberMe: false,
        biometricEnabled: false,
      };
    }
  }

  /**
   * Update stored credentials with new depot selection
   */
  async updateDepotInCredentials(depot: string): Promise<void> {
    try {
      const credentials = await this.getStoredCredentials();
      if (credentials) {
        credentials.depot = depot;
        await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
        await this.saveLastDepot(depot);
      }
    } catch (error) {
      console.error('Failed to update depot in credentials:', error);
    }
  }

  /**
   * Logout user and optionally clear saved credentials
   */
  async logout(clearCredentials: boolean = false): Promise<void> {
    try {
      // Clear API client authentication
      qmsApi.clearAuthentication();
      
      if (clearCredentials) {
        await this.clearCredentials();
        console.log('User logged out and credentials cleared');
      } else {
        console.log('User logged out, credentials preserved');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default AuthService.getInstance();