import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number; // Blur intensity 0-100
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
  padding?: number;
  elevated?: boolean; // Add shadow/elevation
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 80,
  tint,
  borderRadius = 16,
  padding = 16,
  elevated = true,
}) => {
  const { colors, isDark } = useTheme();

  // Determine tint based on theme if not specified
  const blurTint = tint || (isDark ? 'dark' : 'light');

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          overflow: 'hidden',
        },
        elevated && styles.elevated,
        elevated && {
          shadowColor: colors.shadow,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={blurTint}
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderRadius,
          },
        ]}
      />
      <View
        style={[
          styles.content,
          {
            padding,
            backgroundColor: Platform.select({
              ios: 'transparent',
              // Add slight tint for Android since BlurView doesn't work as well
              android: isDark
                ? 'rgba(30, 41, 59, 0.85)'
                : 'rgba(255, 255, 255, 0.85)',
            }),
            borderRadius,
            borderWidth: 1,
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  elevated: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    position: 'relative',
  },
});

export default GlassCard;
