import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SimpleGradient } from './SimpleGradient';

interface ModernLoadingProps {
  message?: string;
}

export const ModernLoading: React.FC<ModernLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  const { colors } = useTheme();
  
  // Animation values
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulsing dots animation
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start staggered animations
    Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 200),
      createDotAnimation(dot3Anim, 400),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <SimpleGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradientBackground}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Animated dots */}
          <View style={styles.dotsContainer}>
            {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: colors.textInverse,
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1.2],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                ]}
              />
            ))}
          </View>
          
          {/* Loading message */}
          <Text style={[styles.message, { color: colors.textInverse }]}>
            {message}
          </Text>
        </Animated.View>
      </SimpleGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});