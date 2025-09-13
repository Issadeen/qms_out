import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface KPCLogoProps {
  size?: number;
  showText?: boolean;
  style?: any;
}

const KPCLogo: React.FC<KPCLogoProps> = ({ 
  size = 60, 
  showText = true,
  style 
}) => {
  // Set this to true when you have the actual logo file saved as kpc-logo.png
  const useActualLogo = false;
  
  if (useActualLogo) {
    try {
      return (
        <Image 
          source={require('../../assets/images/kpc-logo.png')} 
          style={[{ width: size, height: size }, style]}
          resizeMode="contain"
        />
      );
    } catch (error) {
      // Fallback to placeholder if image fails to load
      console.warn('KPC Logo not found, using placeholder');
    }
  }

  // Placeholder logo with KPC text
  return (
    <View style={[
      styles.placeholderContainer,
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2 
      },
      style
    ]}>
      {showText && (
        <Text style={[
          styles.placeholderText,
          { fontSize: size * 0.25 }
        ]}>
          KPC
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B71C1C',
  },
  placeholderText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default KPCLogo;