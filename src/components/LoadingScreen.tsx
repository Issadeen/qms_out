import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import KPCLogo from './KPCLogo';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
  showLogo?: boolean;
  variant?: 'overlay' | 'fullscreen' | 'inline';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  visible,
  message = 'Loading...',
  showLogo = true,
  variant = 'overlay',
}) => {
  const { colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start animations
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Continuous rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      // Continuous pulse animation for logo
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [visible, rotateAnim, pulseAnim, fadeAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const LoadingContent = () => (
    <Animated.View
      style={[
        styles.container,
        variant === 'fullscreen' && styles.fullscreenContainer,
        variant === 'inline' && styles.inlineContainer,
        { opacity: fadeAnim },
      ]}
    >
      {variant !== 'inline' && (
        <LinearGradient
          colors={[
            variant === 'fullscreen' ? colors.primary : 'rgba(220, 20, 60, 0.95)',
            variant === 'fullscreen' ? colors.primaryDark : 'rgba(139, 0, 0, 0.95)',
          ]}
          style={styles.gradient}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            {[...Array(3)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.backgroundRing,
                  {
                    borderColor: 'rgba(255,255,255,0.1)',
                    transform: [
                      { 
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [`${i * 120}deg`, `${(i * 120) + 360}deg`],
                        })
                      }
                    ],
                  }
                ]}
              />
            ))}
          </View>

          <View style={styles.content}>
            {/* KPC Logo with Loading Animation */}
            {showLogo && (
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <View style={[styles.logoBackground, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                  <View style={[styles.logoInner, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
                    <KPCLogo size={50} />
                  </View>
                </View>

                {/* Loading Spinner Ring */}
                <Animated.View
                  style={[
                    styles.loadingRing,
                    {
                      borderTopColor: 'rgba(255,255,255,0.8)',
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: 'transparent',
                      transform: [{ rotate: rotation }],
                    }
                  ]}
                />
              </Animated.View>
            )}

            {/* Loading Text */}
            <View style={styles.textContainer}>
              <Text style={[styles.loadingText, { color: 'white' }]}>
                {message}
              </Text>
              
              {/* Animated Dots */}
              <View style={styles.dotsContainer}>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        opacity: rotateAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange: index === 0 ? [1, 0.3, 0.3, 1] : 
                                     index === 1 ? [0.3, 1, 0.3, 0.3] : 
                                     [0.3, 0.3, 1, 0.3],
                        }),
                      }
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Kenya Pipeline Company */}
            {variant === 'fullscreen' && (
              <Text style={[styles.companyText, { color: 'rgba(255,255,255,0.7)' }]}>
                Kenya Pipeline Company
              </Text>
            )}
          </View>
        </LinearGradient>
      )}

      {/* Inline variant */}
      {variant === 'inline' && (
        <View style={[styles.inlineContent, { backgroundColor: colors.surface }]}>
          <Animated.View
            style={[
              styles.inlineSpinner,
              {
                borderTopColor: colors.primary,
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                transform: [{ rotate: rotation }],
              }
            ]}
          />
          <Text style={[styles.inlineText, { color: colors.textPrimary }]}>
            {message}
          </Text>
        </View>
      )}
    </Animated.View>
  );

  if (variant === 'overlay' || variant === 'fullscreen') {
    return (
      <Modal
        visible={visible}
        transparent={variant === 'overlay'}
        animationType="fade"
      >
        <LoadingContent />
      </Modal>
    );
  }

  return visible ? <LoadingContent /> : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContainer: {
    backgroundColor: 'transparent',
  },
  inlineContainer: {
    minHeight: 120,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
    letterSpacing: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  loadingRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    top: -10,
    left: -10,
  },
  textContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  companyText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  inlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 20,
  },
  inlineSpinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    marginRight: 12,
  },
  inlineText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen;