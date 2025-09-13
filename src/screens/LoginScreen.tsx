import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { LinearGradient } from 'expo-linear-gradient';
import { qmsApi } from '../api/client';
import { useTheme } from '../theme/ThemeContext';
import { SimpleGradient } from '../components/SimpleGradient';
import KPCLogo from '../components/KPCLogo';
import DepotCarousel from '../components/DepotCarousel';
import LoadingScreen from '../components/LoadingScreen';
import authService from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (depot: string) => void;
  initialShowDepotSelection?: boolean;
  initialSelectedDepot?: string;
}

const LoginScreen = ({ onLoginSuccess, initialShowDepotSelection = false, initialSelectedDepot }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDepotSelection, setShowDepotSelection] = useState(initialShowDepotSelection);
  const [selectedDepot, setSelectedDepot] = useState(initialSelectedDepot || 'eldoret');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Theme
  const { colors, typography, spacing, borderRadius, shadows, isDark, toggleTheme } = useTheme();

  const depots = [
    { id: 'eldoret', name: 'Eldoret', baseUrl: 'https://qmseldoret.kpc.co.ke/' },
    { id: 'kisumu', name: 'Kisumu', baseUrl: 'https://qmskisumu.kpc.co.ke/' },
    { id: 'nakuru', name: 'Nakuru', baseUrl: 'https://qmsnakuru.kpc.co.ke/' },
  ];

  // Initialize animations and check for auto-login
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check biometric availability
        const biometricAvail = await authService.isBiometricAvailable();
        setBiometricAvailable(biometricAvail);

        // Get auth settings
        const settings = await authService.getAuthSettings();
        setRememberMe(settings.rememberMe);
        setBiometricEnabled(settings.biometricEnabled);

        // Set last depot if available
        if (settings.lastDepot) {
          setSelectedDepot(settings.lastDepot);
        }

        // Attempt auto-login if remember me is enabled
        if (settings.rememberMe) {
          setIsAutoLogging(true);
          console.log('Attempting auto-login...');
          
          const autoLoginResult = await authService.attemptAutoLogin();
          
          if (autoLoginResult.success) {
            if (autoLoginResult.depot) {
              // Direct login with saved depot
              console.log('Auto-login successful with depot:', autoLoginResult.depot);
              onLoginSuccess(autoLoginResult.depot);
              return; // Exit early, don't show login screen
            } else if (autoLoginResult.requiresDepotSelection) {
              // Show depot selection
              console.log('Auto-login successful, showing depot selection');
              setShowDepotSelection(true);
            }
          } else {
            console.log('Auto-login failed, showing login form');
          }
          
          setIsAutoLogging(false);
        }

        // Get stored credentials for form prefill (without password)
        const credentials = await authService.getStoredCredentials();
        if (credentials && !settings.rememberMe) {
          setUsername(credentials.username);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAutoLogging(false);
      }
    };

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    initializeAuth();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Attempting multi-depot login with username: ${username}`);
      
      // Use multi-depot login like the original Ionic app
      const result = await qmsApi.login(username.trim(), password.trim());
      
      if (result.success) {
        console.log('Multi-depot login successful, showing depot selection');
        
        // Save credentials if remember me is enabled
        if (rememberMe) {
          try {
            await authService.saveCredentials(username.trim(), password.trim());
            console.log('Credentials saved securely');
          } catch (error) {
            console.error('Failed to save credentials:', error);
            // Don't fail the login if credential saving fails
          }
        }
        
        // Show depot selection after successful authentication
        setShowDepotSelection(true);
      } else {
        Alert.alert(
          'Login Failed', 
          result.error || 'Invalid credentials. Please check your username and password.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Connection Error', 
        'Unable to connect to QMS servers. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDepotSelection = async () => {
    // Set working depot and proceed to main app directly
    qmsApi.setWorkingDepot(selectedDepot);
    
    // Update stored credentials with selected depot
    if (rememberMe) {
      try {
        await authService.updateDepotInCredentials(selectedDepot);
        console.log('Depot saved with credentials');
      } catch (error) {
        console.error('Failed to save depot with credentials:', error);
      }
    }
    
    onLoginSuccess(selectedDepot);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: colors.primary }]} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar 
          barStyle="light-content"
          backgroundColor={colors.primary} 
        />
        
        <SimpleGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.gradientBackground}
        >
        {/* Theme Toggle Button */}
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          <Text style={styles.themeToggleText}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
          {!showDepotSelection ? (
            <>
              {/* KPC Branded Header */}
              <View style={styles.brandedHeader}>
                {/* KPC Logo Container */}
                <View style={styles.logoContainer}>
                  <View style={[styles.logoBackground, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <View style={[styles.logoInner, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
                      <KPCLogo size={60} />
                    </View>
                  </View>
                </View>

                {/* Company & App Title */}
                <Text style={[styles.companyName, { color: colors.textInverse }]}>
                  Kenya Pipeline Company
                </Text>
                <Text style={[styles.modernTitle, { color: colors.textInverse }]}>
                  KPC QMS App
                </Text>
                <View style={[styles.headerDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                <Text style={[styles.modernSubtitle, { color: colors.textSecondary }]}>
                  Secure Access Portal
                </Text>
              </View>

              {/* Glassmorphism Form Container */}
              <View style={[
                styles.glassmorphismContainer,
                {
                  backgroundColor: colors.glass,
                  borderColor: colors.border,
                }
              ]}>
                {/* Username Input with Animation */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.modernLabel, { color: colors.textPrimary }]}>
                    Username
                  </Text>
                  <TextInput
                    style={[
                      styles.modernInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }
                    ]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    selectionColor={colors.primary}
                    textContentType="username"
                  />
                </View>

                {/* Password Input with Animation */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.modernLabel, { color: colors.textPrimary }]}>
                    Password
                  </Text>
                  <TextInput
                    style={[
                      styles.modernInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    selectionColor={colors.primary}
                    textContentType="password"
                    importantForAutofill="no"
                    autoComplete="off"
                  />
                </View>

                {/* Authentication Options */}
                <View style={styles.authOptionsContainer}>
                  {/* Remember Me Toggle */}
                  <View style={styles.optionRow}>
                    <Switch
                      value={rememberMe}
                      onValueChange={(value) => {
                        setRememberMe(value);
                        authService.setBiometricEnabled(false); // Reset biometric when toggling remember me
                        setBiometricEnabled(false);
                      }}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={rememberMe ? colors.background : colors.textSecondary}
                      ios_backgroundColor={colors.border}
                    />
                    <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                      Remember me
                    </Text>
                  </View>

                  {/* Biometric Toggle (only if remember me is enabled and biometric is available) */}
                  {rememberMe && biometricAvailable && (
                    <View style={styles.optionRow}>
                      <Switch
                        value={biometricEnabled}
                        onValueChange={async (value) => {
                          setBiometricEnabled(value);
                          await authService.setBiometricEnabled(value);
                        }}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={biometricEnabled ? colors.background : colors.textSecondary}
                        ios_backgroundColor={colors.border}
                      />
                      <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                        Use biometric authentication
                      </Text>
                    </View>
                  )}
                </View>

                {/* Modern Login Button */}
                <TouchableOpacity
                  style={[
                    styles.modernButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: isLoading ? 0.7 : 1,
                    }
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.textInverse} size="small" />
                  ) : (
                    <Text style={[styles.modernButtonText, { color: colors.textInverse }]}>
                      Login
                    </Text>
                  )}
                </TouchableOpacity>

                <Text style={[styles.modernInfoText, { color: colors.textSecondary }]}>
                  Credentials will be verified across all QMS depots
                </Text>
              </View>
            </>
          ) : (
            <DepotCarousel
              depots={depots.map(depot => ({
                ...depot,
                location: 'Kenya Pipeline Company Facility',
                description: 'Fuel distribution and storage operations'
              }))}
              selectedDepot={selectedDepot}
              onDepotSelect={setSelectedDepot}
              onConfirm={handleDepotSelection}
            />
          )}
        </Animated.View>
        </ScrollView>
      </SimpleGradient>

      {/* Branded Loading Screen */}
      <LoadingScreen
        visible={isLoading || isAutoLogging}
        message={
          isAutoLogging 
            ? "Checking saved credentials..." 
            : showDepotSelection 
              ? "Setting up your depot..." 
              : "Authenticating..."
        }
        variant="overlay"
        showLogo={true}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DC143C', // KPC red background
  },
  container: {
    flex: 1,
    backgroundColor: '#DC143C', // Fallback KPC red background
  },
  gradientBackground: {
    flex: 1,
    minHeight: screenHeight, // Ensure full screen coverage
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: screenHeight, // Use full screen height instead of fixed 700
    paddingBottom: 50, // Extra bottom padding to prevent white space
  },
  animatedContainer: {
    flex: 1,
  },
  modernHeader: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modernTitle: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  modernSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  glassmorphismContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 60, // Increased bottom padding to fill space
    borderWidth: 1,
    minHeight: 500, // Increased minimum height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    marginBottom: 24,
  },
  modernLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modernInput: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    // Ensure no default background colors
    backgroundColor: 'transparent',
  },
  modernButton: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  modernButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modernInfoText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 24,
    lineHeight: 20,
    opacity: 0.7,
  },
  depotGrid: {
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  modernDepotCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  modernDepotText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // KPC Branding Styles
  brandedHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC143C',
    letterSpacing: 1.5,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    opacity: 0.95,
  },
  headerDivider: {
    width: 60,
    height: 2,
    marginVertical: 12,
    borderRadius: 1,
  },
  // Back Button Styles
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  // Theme Toggle Styles
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  themeToggleText: {
    fontSize: 24,
  },
  authOptionsContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
});

export default LoginScreen;