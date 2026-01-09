import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import KPCLogo from './KPCLogo';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = 280;
const SPACING = 20;

interface DepotCarouselProps {
  depots: Array<{ id: string; name: string; location?: string; description?: string }>;
  selectedDepot: string;
  onDepotSelect: (depotId: string) => void;
  onConfirm: () => void;
  onBack?: () => void;
}

const DepotCarousel: React.FC<DepotCarouselProps> = ({
  depots,
  selectedDepot,
  onDepotSelect,
  onConfirm,
  onBack,
}) => {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Create infinite scroll data by duplicating depots
  const infiniteDepots = [...depots, ...depots, ...depots];
  const startIndex = depots.length; // Start at the middle set

  useEffect(() => {
    // Initial animation
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
    ]).start();

    // Scroll to the middle set initially for infinite effect
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: startIndex * (CARD_WIDTH + SPACING),
        animated: false,
      });
    }, 100);
  }, []);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setScrollX(scrollPosition); // For real-time transforms
    
    const index = Math.round(scrollPosition / (CARD_WIDTH + SPACING));
    
    // Handle infinite scrolling
    let actualIndex = index % depots.length;
    if (actualIndex < 0) actualIndex = depots.length + actualIndex;
    
    setActiveIndex(actualIndex);
    
    // Auto-select the depot in the center
    if (depots[actualIndex]) {
      onDepotSelect(depots[actualIndex].id);
    }
  };

  const handleScrollEnd = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + SPACING));
    
    // Reset position for infinite scroll if needed
    if (index < depots.length / 2) {
      // Scrolled too far left, jump to end section
      scrollRef.current?.scrollTo({
        x: (index + depots.length * 2) * (CARD_WIDTH + SPACING),
        animated: false,
      });
    } else if (index >= depots.length * 2.5) {
      // Scrolled too far right, jump to beginning section
      scrollRef.current?.scrollTo({
        x: (index - depots.length * 2) * (CARD_WIDTH + SPACING),
        animated: false,
      });
    }
  };

  const scrollToIndex = (targetIndex: number) => {
    const currentScrollX = scrollRef.current;
    // Scroll to the middle section version of the target
    const targetScrollX = (startIndex + targetIndex) * (CARD_WIDTH + SPACING);
    scrollRef.current?.scrollTo({
      x: targetScrollX,
      animated: true,
    });
  };

  const renderDepotCard = (depot: any, index: number) => {
    const isActive = selectedDepot === depot.id;
    
    // Use real-time scroll position for ultra-smooth transforms
    const cardPosition = index * (CARD_WIDTH + SPACING);
    const screenCenter = scrollX + (screenWidth / 2);
    const cardCenter = cardPosition + (CARD_WIDTH / 2);
    
    // Calculate distance from screen center in pixels
    let distanceFromCenter = (cardCenter - screenCenter) / (CARD_WIDTH + SPACING);
    
    // Create smooth fidget spinner chain effect
    const maxDistance = 2; // Limit effect for performance
    const clampedDistance = Math.max(-maxDistance, Math.min(maxDistance, distanceFromCenter));
    const normalizedDistance = Math.abs(clampedDistance) / maxDistance;
    
    // Smooth rotation - cards rotate as they move around the "circle"
    const rotationAngle = clampedDistance * 20; // Smooth rotation angle
    
    // Smooth scaling and depth effect with easing
    const easedDistance = normalizedDistance * normalizedDistance; // Quadratic easing
    const scaleValue = 1 - (easedDistance * 0.08); // Gentle scaling
    const opacityValue = 1 - (easedDistance * 0.15); // Gentle fade
    
    // Subtle perspective depth effect
    const translateY = easedDistance * 15; // Subtle vertical movement
    const translateZ = easedDistance * -50; // Depth effect (simulated)
    
    return (
      <Animated.View
        key={`${depot.id}-${index}`}
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.max(opacityValue, 0.5)],
            }),
            transform: [
              { perspective: 1200 },
              { rotateY: `${rotationAngle}deg` },
              { scale: Math.max(scaleValue, 0.85) },
              { translateY: translateY },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.card,
            {
              borderColor: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              borderWidth: isActive ? 3 : 1,
            },
          ]}
          onPress={() => {
            // Allow deselection by tapping the same depot
            if (selectedDepot === depot.id) {
              onDepotSelect(''); // Deselect
            } else {
              onDepotSelect(depot.id);
              const actualIndex = index % depots.length;
              scrollToIndex(actualIndex);
            }
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isActive
                ? [colors.primary, colors.primaryDark]
                : [colors.surface, colors.backgroundSecondary]
            }
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={[
                styles.depotIcon,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.primary + '20' }
              ]}>
                <KPCLogo size={40} showText={false} />
              </View>
              
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? '#4CAF50' : colors.border }
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: isActive ? 'rgba(255,255,255,0.9)' : colors.textSecondary }
                ]}>
                  {isActive ? 'Selected' : 'Available'}
                </Text>
              </View>
            </View>

            {/* Depot Name */}
            <Text style={[
              styles.depotName,
              { color: isActive ? 'white' : colors.textPrimary }
            ]}>
              {depot.name}
            </Text>

            {/* Location */}
            <Text style={[
              styles.depotLocation,
              { color: isActive ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
            ]}>
              📍 {depot.location || 'Kenya Pipeline Company'}
            </Text>

            {/* Description */}
            <Text style={[
              styles.depotDescription,
              { color: isActive ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
            ]}>
              {depot.description || 'Fuel distribution and storage facility'}
            </Text>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={[
                styles.connectionStatus,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : colors.backgroundSecondary }
              ]}>
                <View style={[styles.connectionDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={[
                  styles.connectionText,
                  { color: isActive ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                ]}>
                  Online
                </Text>
              </View>
            </View>

            {/* Selection Indicator */}
            {isActive && (
              <View style={styles.selectionOverlay}>
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.container}
      >
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <Text style={[styles.title, { color: colors.textInverse }]}>
          Select Your Depot
        </Text>
        <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>
          Swipe to browse available locations
        </Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={1} // Ultra-smooth real-time updates
        contentContainerStyle={styles.scrollContainer}
        decelerationRate={0.9} // Smoother deceleration
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="center"
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={false}
        directionalLockEnabled={true}
        alwaysBounceHorizontal={false}
        centerContent={true}
      >
        {infiniteDepots.map((depot, index) => renderDepotCard(depot, index))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicators}>
        {depots.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === activeIndex ? 'white' : 'rgba(255,255,255,0.4)',
                opacity: index === activeIndex ? 1 : 0.7,
              },
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>

      {/* Selection Hint */}
      {selectedDepot && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            💡 Tap the selected depot again to deselect it
          </Text>
        </View>
      )}

      {/* Confirm Button */}
      <View style={styles.footer}>
        {selectedDepot && (
          <View style={styles.actionRow}>
            {/* Clear Selection Button */}
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onDepotSelect('')}
            >
              <Text style={styles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>
            
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>
                Continue to {depots.find(d => d.id === selectedDepot)?.name || 'Depot'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!selectedDepot && (
          <TouchableOpacity
            style={[styles.confirmButton, styles.disabledButton]}
            disabled={true}
          >
            <Text style={[styles.confirmButtonText, styles.disabledText]}>
              Select a depot to continue
            </Text>
          </TouchableOpacity>
        )}
      </View>
      </LinearGradient>
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
    paddingVertical: 20,
    minHeight: screenHeight, // Ensure full screen coverage
    backgroundColor: '#DC143C', // Fallback KPC red background
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  scrollContainer: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
    paddingVertical: 30,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    backgroundColor: 'transparent',
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  depotIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  depotName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  depotLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  depotDescription: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 60, // Increased bottom padding to ensure full coverage
    marginTop: 20, // Add top margin for spacing
  },
  confirmButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'white',
    flex: 1,
    marginLeft: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.3)',
    opacity: 0.5,
  },
  disabledText: {
    color: 'rgba(255,255,255,0.6)',
  },
  hintContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});

export default DepotCarousel;