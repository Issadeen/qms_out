import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ModernHeader from '../components/ModernHeader';
import { SimpleGradient } from '../components/SimpleGradient';
import LoadingScreen from '../components/LoadingScreen';

interface OrderTypeScreenProps {
  depot: string;
  onOrderTypeSelected: (orderType: 'Export' | 'Local') => void;
  onBack: () => void;
}

const OrderTypeScreen = ({ depot, onOrderTypeSelected, onBack }: OrderTypeScreenProps) => {
  // Loading state for category selection
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim1 = useRef(new Animated.Value(0.9)).current;
  const scaleAnim2 = useRef(new Animated.Value(0.9)).current;
  
  // Theme
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  // Initialize animations
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.stagger(150, [
          Animated.timing(scaleAnim1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim2, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleOrderTypePress = (orderType: 'Export' | 'Local') => {
    // Show loading screen
    setIsLoading(true);
    
    // Add a small animation before navigation
    const scaleAnim = orderType === 'Export' ? scaleAnim1 : scaleAnim2;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Simulate brief loading before navigation
      setTimeout(() => {
        setIsLoading(false);
        onOrderTypeSelected(orderType);
      }, 800);
    });
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.primary} 
      />
      
      <SimpleGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradientBackground}
      >
        {/* Modern Header with Back Button */}
        <ModernHeader
          title="Order Type"
          subtitle={`${depot.toUpperCase()} Depot`}
          onBack={onBack}
        />

        {/* Animated Content Container */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              backgroundColor: colors.glass,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.instructionText, { color: colors.textPrimary }]}>
            Select the type of order you want to manage
          </Text>

          {/* Export Order Type Card */}
          <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
            <TouchableOpacity
              style={[
                styles.modernOrderCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleOrderTypePress('Export')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.cardIconText, { color: colors.primary }]}>
                  🚢
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                EXPORT
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                International shipments and export orders
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Local Order Type Card */}
          <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
            <TouchableOpacity
              style={[
                styles.modernOrderCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleOrderTypePress('Local')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: colors.secondaryLight }]}>
                <Text style={[styles.cardIconText, { color: colors.secondary }]}>
                  🚛
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                LOCAL
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                Domestic deliveries and local orders
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </SimpleGradient>

      {/* Branded Loading Screen */}
      <LoadingScreen
        visible={isLoading}
        message="Loading queue categories..."
        variant="overlay"
        showLogo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 30,
    paddingTop: 40,
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
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.8,
  },
  modernOrderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardIconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
});

export default OrderTypeScreen;