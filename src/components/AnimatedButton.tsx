import React, { useRef } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';

interface AnimatedButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
  disabled?: boolean;
  scaleEffect?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  style,
  children,
  disabled = false,
  scaleEffect = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (scaleEffect && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (scaleEffect && !disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled) {
      // Add haptic feedback-like animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Delay the actual onPress to sync with animation
      setTimeout(onPress, 100);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};