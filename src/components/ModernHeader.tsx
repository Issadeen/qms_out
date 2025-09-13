import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AnimatedButton } from './AnimatedButton';

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showThemeToggle?: boolean;
  onThemeToggle?: () => void;
  isDark?: boolean;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showThemeToggle = true,
  onThemeToggle,
}) => {
  const { colors, typography, spacing, borderRadius, shadows, isDark, toggleTheme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const themeRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate header entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Theme toggle animation
  useEffect(() => {
    Animated.timing(themeRotateAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle();
    } else {
      toggleTheme();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      <View style={[styles.gradient, { backgroundColor: colors.primary }]}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Left side - Back button */}
          <View style={styles.leftSection}>
            {onBack && (
              <AnimatedButton
                onPress={onBack}
                style={{
                  ...styles.backButton,
                  backgroundColor: colors.glass,
                }}
              >
                <Text style={[styles.backIcon, { color: colors.textInverse }]}>
                  ←
                </Text>
              </AnimatedButton>
            )}
          </View>

          {/* Center - Title and subtitle */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: colors.textInverse }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textInverse }]}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right side - Theme toggle */}
          <View style={styles.rightSection}>
            {showThemeToggle && (
              <AnimatedButton
                onPress={handleThemeToggle}
                style={{
                  ...styles.themeButton,
                  backgroundColor: colors.glass,
                }}
              >
                <Animated.Text 
                  style={[
                    styles.themeIcon,
                    {
                      transform: [
                        {
                          rotate: themeRotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    }
                  ]}
                >
                  {isDark ? '☀️' : '🌙'}
                </Animated.Text>
              </AnimatedButton>
            )}
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  gradient: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  leftSection: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeIcon: {
    fontSize: 18,
  },
});

export default ModernHeader;