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
  Modal,
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
  isAuthenticated?: boolean;
}

const LoginScreen = ({ onLoginSuccess, initialShowDepotSelection = false, initialSelectedDepot, isAuthenticated = false }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDepotSelection, setShowDepotSelection] = useState(initialShowDepotSelection);
  const [selectedDepot, setSelectedDepot] = useState(initialSelectedDepot || 'eldoret');
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
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
        // If already authenticated (coming back from OrderTypeScreen), just show depot selection
        if (isAuthenticated && initialShowDepotSelection) {
          setShowDepotSelection(true);
          return;
        }

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

        // Attempt auto-login if remember me is enabled (only if not already authenticated)
        if (settings.rememberMe && !isAuthenticated) {
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
  }, [isAuthenticated, initialShowDepotSelection]);

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

  // Trigger biometric auth and handle results; show modal on cancel/failure
  const triggerBiometricAuth = async () => {
    try {
      const result = await authService.authenticateWithBiometric();
      if (result && result.success) {
        const autoLoginResult = await authService.attemptAutoLogin();
        if (autoLoginResult.success) {
          if (autoLoginResult.depot) {
            onLoginSuccess(autoLoginResult.depot);
            return;
          } else if (autoLoginResult.requiresDepotSelection) {
            setShowDepotSelection(true);
            return;
          }
        }
        // If auto-login didn't succeed even after biometrics, show modal so user can retry or use PIN
        setShowBiometricModal(true);
      } else {
        // Biometric cancelled/failed
        setShowBiometricModal(true);
      }
    } catch (err) {
      console.error('Biometric auth error:', err);
      setShowBiometricModal(true);
    }
  };

  const handleBackToLogin = () => {
    setShowDepotSelection(false);
    setIsAutoLogging(false);
    // Clear any auto-login state
    console.log('Returning to login form from depot selection');
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
                <KPCLogo size={60} />
                <Text style={[styles.modernSubtitle, { color: colors.textSecondary }]}>
                  Secure Access Portal
                </Text>
              </View>

              {/* Glassmorphism Form Container */}
              <View style={[
                styles.glassmorphismContainer,
                {
                  backgroundColor: isDark ? colors.surface : 'rgba(30, 41, 59, 0.95)', // solid dark background for visibility
                  borderColor: isDark ? colors.border : 'rgba(255, 255, 255, 0.2)',
                }
              ]}>
                {/* Username Input with Animation */}
                <View style={styles.inputContainer}>
                  {rememberMe && biometricAvailable && biometricEnabled && (
                    <TouchableOpacity
                      style={[styles.biometricManualBtn, { borderColor: colors.primary }]}
                      onPress={async () => {
                        try {
                          const result = await authService.authenticateWithBiometric();
                          if (result && result.success) {
                            const autoLoginResult = await authService.attemptAutoLogin();
                            if (autoLoginResult.success) {
                              if (autoLoginResult.depot) {
                                onLoginSuccess(autoLoginResult.depot);
                                return;
                              } else if (autoLoginResult.requiresDepotSelection) {
                                setShowDepotSelection(true);
                                return;
                              }
                            }
                          } else {
                            Alert.alert('Authentication', 'Biometric authentication was not completed. You can retry or login with your credentials.');
                          }
                        } catch (err) {
                          console.error('Manual biometric auth error:', err);
                          Alert.alert('Authentication Error', 'Biometric authentication failed. Please use your credentials.');
                        }
                      }}
                    >
                      <Text style={{ color: colors.primary }}>Authenticate with Biometrics</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={[styles.modernLabel, { color: isDark ? colors.textPrimary : '#f8fafc' }]}>
                    Username
                  </Text>
                  <TextInput
                    style={[
                      styles.modernInput,
                      {
                        backgroundColor: isDark ? colors.backgroundSecondary : 'rgba(51, 65, 85, 0.6)',
                        borderColor: isDark ? colors.border : 'rgba(148, 163, 184, 0.4)',
                        color: isDark ? colors.textPrimary : '#f8fafc',
                      }
                    ]}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor={isDark ? colors.textSecondary : 'rgba(203, 213, 225, 0.7)'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    selectionColor={colors.primary}
                    textContentType="username"
                  />
                </View>

                {/* Password Input with Animation */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.modernLabel, { color: isDark ? colors.textPrimary : '#f8fafc' }]}>
                    Password
                  </Text>
                  <TextInput
                    style={[
                      styles.modernInput,
                      {
                        backgroundColor: isDark ? colors.backgroundSecondary : 'rgba(51, 65, 85, 0.6)',
                        borderColor: isDark ? colors.border : 'rgba(148, 163, 184, 0.4)',
                        color: isDark ? colors.textPrimary : '#f8fafc',
                      }
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={isDark ? colors.textSecondary : 'rgba(203, 213, 225, 0.7)'}
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
                    <Text style={[styles.optionText, { color: isDark ? colors.textPrimary : '#f8fafc' }]}>
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
                      <Text style={[styles.optionText, { color: isDark ? colors.textPrimary : '#f8fafc' }]}>
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

                <Text style={[styles.modernInfoText, { color: isDark ? colors.textSecondary : 'rgba(203, 213, 225, 0.8)' }]}>
                  Enter your KPC QMS credentials
                  {'\n'}Credentials will be verified across all QMS depots
                </Text>
              </View>

              {/* Tribute */}
              <Text style={[styles.tributeText, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)' }]}>
                Crafted with 💙 by Issaerium
              </Text>
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
              onBack={handleBackToLogin}
            />
          )}
          {/* Biometric Retry Modal */}
          <Modal visible={showBiometricModal} transparent animationType="fade">
            <View style={styles.modalBackdrop}>
              <View style={[styles.modal, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Authentication</Text>
                <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>Biometric authentication was not completed. Choose an option:</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => { setShowBiometricModal(false); triggerBiometricAuth(); }} style={[styles.modalBtn, { borderColor: colors.primary }]}>
                    <Text style={{ color: colors.primary }}>Retry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setShowBiometricModal(false); }} style={[styles.modalBtn, { borderColor: colors.border }]}>
                    <Text style={{ color: colors.textPrimary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setShowBiometricModal(false); /* reveal PIN entry */ }} style={[styles.modalBtn, { borderColor: colors.primary }]}>
                    <Text style={{ color: colors.primary }}>Use PIN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingTop: 60,
    paddingBottom: 60,
    justifyContent: 'center',
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricManualBtn: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '85%', padding: 16, borderRadius: 12, borderWidth: 1 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  modalMessage: { fontSize: 14, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { padding: 10, borderRadius: 8, borderWidth: 1, minWidth: 80, alignItems: 'center', marginHorizontal: 4 },
  modernHeader: {
    paddingTop: 40,
    paddingBottom: 24,
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
    marginVertical: 8,
    width: '90%',
    maxWidth: 720,
    alignSelf: 'center',
    borderRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 28,
    borderWidth: 1,
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
    marginBottom: 16,
  },
  modernLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  modernInput: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
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
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
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
    paddingTop: 10,
    paddingBottom: 8,
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
  debugBox: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 8,
    borderRadius: 8,
    zIndex: 50,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  tributeText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LoginScreen;