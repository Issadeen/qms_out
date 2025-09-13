import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SimpleGradientProps {
  colors: string[];
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const SimpleGradient: React.FC<SimpleGradientProps> = ({ 
  colors, 
  style, 
  children 
}) => {
  // For now, use the first color as background
  // This is a fallback since LinearGradient is causing issues
  return (
    <View 
      style={[
        { backgroundColor: colors[0] },
        style
      ]}
    >
      {children}
    </View>
  );
};