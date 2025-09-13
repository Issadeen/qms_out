import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import KPCLogo from './KPCLogo';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animated sequence for elegant entrance
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Text slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Hold for visibility
      Animated.delay(duration - 1400),
    ]).start(() => {
      onComplete?.();
    });
  }, [fadeAnim, scaleAnim, slideAnim, duration, onComplete]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, '#8B0000']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.patternCircle,
                {
                  left: (i % 3) * (width / 2.5),
                  top: Math.floor(i / 3) * (height / 2.5),
                  opacity: 0.1,
                }
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* KPC Logo Container */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Logo Background Circle */}
            <View style={[styles.logoBackground, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <View style={[styles.logoInner, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                <KPCLogo size={80} />
              </View>
            </View>
          </Animated.View>

          {/* Company Name & QMS Title */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.companyName, { color: 'white' }]}>
              Kenya Pipeline Company
            </Text>
            <Text style={[styles.appTitle, { color: 'rgba(255,255,255,0.9)' }]}>
              KPC QMS App
            </Text>
            <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>
              Modern • Efficient • Reliable
            </Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  { 
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    transform: [{
                      scaleX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }]
                  }
                ]}
              />
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.7)' }]}>
            Powered by React Native
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC143C',
    letterSpacing: 2,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  divider: {
    width: 80,
    height: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    transformOrigin: 'left',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;