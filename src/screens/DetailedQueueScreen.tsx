import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
  Dimensions,
  BackHandler,
  AppState,
  AppStateStatus,
} from 'react-native';
import { qmsApi } from '../api/client';
import { useTheme } from '../theme/ThemeContext';
import ModernHeader from '../components/ModernHeader';
import { SimpleGradient } from '../components/SimpleGradient';
import LoadingScreen from '../components/LoadingScreen';
import GlassCard from '../components/GlassCard';

interface DetailedQueueScreenProps {
  orderType: 'Export' | 'Local';
  broadqueueId: string;
  depot: string;
  onBack: () => void;
  criteria?: string;
  productInfo?: string | { description: string };
}

interface DetailedQueueItem {
  id: string;
  queueNumber: number;
  orderNumber: string;
  checkpoint: string;
  vehicleNumber: string;
  driverName: string;
  omc: string;
  time: {
    date: string;
  };
}

const DetailedQueueScreen: React.FC<DetailedQueueScreenProps> = React.memo(({
  orderType,
  broadqueueId,
  depot,
  onBack,
  criteria,
  productInfo,
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [detailedQueues, setDetailedQueues] = useState<DetailedQueueItem[]>([]);
  const [filteredQueues, setFilteredQueues] = useState<DetailedQueueItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const bannerHeight = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(0).current;

  // Load detailed queue data
  useEffect(() => {
    loadDetailedQueues();
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);

  // Handle app state changes - refresh data when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('App became active, refreshing detailed queue data...');
        loadDetailedQueues();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (onBack) {
        onBack();
        return true; // Prevent default behavior
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [onBack]);

  const loadDetailedQueues = async () => {
    try {
      setIsLoading(true);
      console.log(`Loading detailed queue for broadqueue ${broadqueueId}`);
      
      const response = await qmsApi.getDetailedQueues(broadqueueId);
      
      if (response.success && response.data) {
        console.log(`Loaded ${response.data.length} detailed queue items for broadqueue ${broadqueueId}`);
        setDetailedQueues(response.data);
        setFilteredQueues(response.data);
      } else {
        console.warn('No detailed queue data received');
        setDetailedQueues([]);
        setFilteredQueues([]);
      }
    } catch (error) {
      console.error('Error loading detailed queues:', error);
      Alert.alert('Error', 'Failed to load detailed queue information');
      setDetailedQueues([]);
      setFilteredQueues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDetailedQueues();
    setRefreshing(false);
  };

  // Handle scroll to hide/show banner
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    
    // Hide banner when scrolling down, show when scrolling up
    if (currentOffset > 50 && showBanner) {
      setShowBanner(false);
      Animated.timing(bannerHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (currentOffset <= 50 && !showBanner) {
      setShowBanner(true);
      Animated.timing(bannerHeight, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // Filter queues based on search text
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredQueues(detailedQueues);
      return;
    }

    const filtered = detailedQueues.filter(queue =>
      queue.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      queue.vehicleNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      queue.driverName.toLowerCase().includes(searchText.toLowerCase()) ||
      queue.omc.toLowerCase().includes(searchText.toLowerCase()) ||
      queue.checkpoint.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredQueues(filtered);
  }, [searchText, detailedQueues]);

  // Get status color based on queue status
  const getStatusColor = (item: DetailedQueueItem) => {
    if (item.vehicleNumber === 'Pending' || item.driverName === 'TBD') {
      return colors.warning;
    }
    if (item.checkpoint === 'Completed') {
      return colors.success;
    }
    return colors.primary; // Use red primary instead of blue info
  };

  // Get status icon based on queue status
  const getStatusIcon = (item: DetailedQueueItem) => {
    if (item.vehicleNumber === 'Pending' || item.driverName === 'TBD') {
      return '⏳';
    }
    if (item.checkpoint === 'Completed') {
      return '✅';
    }
    return '🔄';
  };

  // Render individual queue item with compact original QMS design
  const renderQueueItem = React.useCallback(({ item, index }: { item: DetailedQueueItem; index: number }) => {
    return (
      <GlassCard
        style={styles.originalQueueCard}
        intensity={70}
        padding={0}
      >
        {/* Queue Number Header */}
        <View style={[
          styles.originalQueueHeader, 
          { borderBottomColor: colors.border }
        ]}>
          <Text style={[
            styles.originalQueueNumber,
            { color: colors.textPrimary }
          ]}>
            Queue No. {item.queueNumber}
          </Text>
        </View>
        
        {/* Information Rows with Icons */}
        <View style={styles.originalCardContent}>
          {/* Order Number Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🧾</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>{item.orderNumber}</Text>
          </View>
          
          {/* Status/Availability Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🎯</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {item.checkpoint || 'Unavailable'}
            </Text>
          </View>
          
          {/* Vehicle Number Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🚛</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>{item.vehicleNumber}</Text>
          </View>
          
          {/* Driver Name Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>👤</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>{item.driverName}</Text>
          </View>
          
          {/* Company Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🏢</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>{item.omc}</Text>
          </View>
          
          {/* Timestamp Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🕐</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>{item.time.date}</Text>
          </View>
        </View>
      </GlassCard>
    );
  }, [colors]);

  // Optimize keyExtractor
  const keyExtractor = React.useCallback((item: DetailedQueueItem) => item.id, []);

  // Optimize getItemLayout for known heights
  const getItemLayout = React.useCallback((data: any, index: number) => ({
    length: 180, // Approximate height of each card
    offset: 180 * index + (index * 8), // Height + margin
    index,
  }), []);

  // Helper function to format product info
  const getProductDisplay = () => {
    if (typeof productInfo === 'string') {
      return productInfo;
    }
    if (typeof productInfo === 'object' && productInfo?.description) {
      return productInfo.description;
    }
    return 'Product Information';
  };

  if (isLoading) {
    return (
      <LoadingScreen
        visible={true}
        message="Loading detailed queue data..."
        variant="fullscreen"
        showLogo={true}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SimpleGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradientBackground}
      >
        {/* Compact Header with Back Button */}
        <ModernHeader
          title={`${depot.toUpperCase()} - ${orderType}`}
          subtitle="Detailed Queue Information"
          onBack={onBack}
        />

        {/* Content Container with More Room */}
        <Animated.View 
          style={[
            styles.optimizedContentContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Collapsible Search Bar */}
          <View style={[styles.compactSearchContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.searchIcon, { color: colors.primary }]}>🔍</Text>
            <TextInput
              style={[styles.compactSearchInput, { color: colors.textPrimary }]}
              placeholder="Search queues..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Compact Info Note: Title + Product only */}
          {(criteria || productInfo) && (
            <View
              style={[
                styles.infoNote,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.infoNoteTitle, { color: colors.primary }]}>Detailed Queue Info</Text>
              {productInfo && (
                <Text style={[styles.infoNoteProduct, { color: colors.textPrimary }]}>📦 Product: {getProductDisplay()}</Text>
              )}
            </View>
          )}

          {/* Optimized Queue List with More Space */}
          <FlatList
            data={filteredQueues}
            renderItem={renderQueueItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={8}
            windowSize={10}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.optimizedListContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />

          {/* Compact Count Footer - Only Shows When Not Scrolling */}
          <View style={[styles.compactCountFooter, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.compactCountText, { color: colors.textSecondary }]}>
              {filteredQueues.length} of {detailedQueues.length} queues
            </Text>
          </View>
        </Animated.View>
      </SimpleGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  // Optimized Content Container - More Room for Cards
  optimizedContentContainer: {
    flex: 1,
    marginTop: 15, // Reduced from 20
    borderTopLeftRadius: 24, // Reduced from 32 
    borderTopRightRadius: 24, // Reduced from 32
    paddingTop: 15, // Reduced from 30
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  // Compact Search Container
  compactSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16, // Reduced from 20
    marginBottom: 12, // Reduced from 20
    borderRadius: 12, // Reduced from 16
    paddingHorizontal: 12, // Reduced from 16
    paddingVertical: 8, // Reduced from 16
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16, // Reduced from 20
    marginRight: 8, // Reduced from 12
  },
  compactSearchInput: {
    flex: 1,
    fontSize: 14, // Reduced from 16
    fontWeight: '500',
  },
  // Category Information Banner
  categoryBanner: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden', // Ensure content clips when height animates
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  categoryProduct: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  // Optimized List Container - More Space for Cards
  optimizedListContainer: {
    paddingBottom: 50, // Reduced from 100
    paddingHorizontal: 8, // Reduced padding
  },
  // Compact Count Footer
  compactCountFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8, // Reduced from 20
    borderTopWidth: 1,
    borderTopLeftRadius: 12, // Reduced from 20
    borderTopRightRadius: 12, // Reduced from 20
  },
  compactCountText: {
    fontSize: 12, // Reduced from 14
    fontWeight: '400', // Lighter weight
    textAlign: 'center',
    opacity: 0.8,
  },
  // Compact Info Note Styles
  infoNote: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoNoteTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoNoteProduct: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Legacy styles
  modernContentContainer: {
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 30,
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
  modernSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 100,
  },
  modernCountFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modernCountText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Ultra-Compact Queue Card Styles for Maximum Visibility
  originalQueueCard: {
    marginHorizontal: 12, // Reduced from 16
    marginVertical: 3, // Reduced from 4
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1, // Reduced shadow
    shadowRadius: 2,
    elevation: 2,
  },
  originalQueueHeader: {
    alignItems: 'center',
    paddingVertical: 6, // Reduced from 8
    borderBottomWidth: 1,
  },
  originalQueueNumber: {
    fontSize: 16, // Reduced from 18
    fontWeight: 'bold',
  },
  originalCardContent: {
    padding: 6, // Reduced from 8
  },
  originalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1, // Reduced from 2
  },
  originalIcon: {
    fontSize: 12, // Reduced from 14
    marginRight: 6, // Reduced from 8
    width: 16, // Reduced from 20
    textAlign: 'center',
  },
  originalInfoText: {
    fontSize: 11, // Reduced from 12
    flex: 1,
    lineHeight: 14, // Added for better readability
  },
});

export default DetailedQueueScreen;