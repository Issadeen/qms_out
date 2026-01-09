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
  Modal,
  BackHandler,
  AppState,
  AppStateStatus,
  Platform,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { qmsApi } from '../api/client';
import { useTheme } from '../theme/ThemeContext';
import ModernHeader from '../components/ModernHeader';
import { SimpleGradient } from '../components/SimpleGradient';
import LoadingScreen from '../components/LoadingScreen';
import DetailedQueueScreen from './DetailedQueueScreen';
import WebLoginModal from '../components/WebLoginModal';
import HistoricalDataModal from '../components/HistoricalDataModal';
import QueueDetailModal from '../components/QueueDetailModal';
import GlassCard from '../components/GlassCard';

interface QueueListScreenProps {
  orderType: 'Export' | 'Local';
  depot: string;
  onBack?: () => void;
}

const QueueListScreen = ({ orderType, depot, onBack }: QueueListScreenProps) => {
  const [broadqueues, setBroadqueues] = useState<any[]>([]);
  const [filteredBroadqueues, setFilteredBroadqueues] = useState<any[]>([]);
  const [allBroadqueues, setAllBroadqueues] = useState<any[]>([]); // Store all data for search
  const [showAllResults, setShowAllResults] = useState(false); // Toggle for showing all vs limited results
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBroadqueue, setSelectedBroadqueue] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);
  
  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null as string | null,
    prev_page_url: null as string | null,
    per_page: 15,
    total: 0
  });
  const [useHistoricalData, setUseHistoricalData] = useState(false);
  const [showWebLoginModal, setShowWebLoginModal] = useState(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [showQueueDetailModal, setShowQueueDetailModal] = useState(false);
  const [selectedBroadqueueForDetail, setSelectedBroadqueueForDetail] = useState<any>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Theme
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  useEffect(() => {
    loadBroadqueues();
  }, [useHistoricalData]);

  useEffect(() => {
    filterBroadqueues();
  }, [allBroadqueues, searchTerm, showAllResults]);

  // Initialize animations
  useEffect(() => {
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

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(10); // Light 10ms vibration
    }
  };

  // Handle app state changes - refresh data when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App has come to the foreground, refresh data
        console.log('App became active, refreshing queue data...');
        setShowRefreshIndicator(true);
        loadBroadqueues();
        
        // Hide indicator after 2 seconds
        setTimeout(() => {
          setShowRefreshIndicator(false);
        }, 2000);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [useHistoricalData]); // Re-subscribe if useHistoricalData changes

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      // If a detailed queue screen is showing, go back to queue list
      if (selectedBroadqueue) {
        handleBackToBroadqueues();
        return true; // Prevent default behavior
      }

      // If historical data modal is showing, close it
      if (showHistoricalModal) {
        setShowHistoricalModal(false);
        return true;
      }

      // Otherwise, use the onBack prop to go back to order type selection
      if (onBack) {
        onBack();
        return true;
      }

      // Allow default behavior (will be handled by App.tsx)
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [selectedBroadqueue, showHistoricalModal, onBack]);

  const loadBroadqueues = async (page: number = 1) => {
    try {
      setIsLoading(true);
      
      if (useHistoricalData) {
        console.log('🔍 Historical data mode: loading data...');
        console.log('🔑 Web auth status:', qmsApi.isWebAuthenticated());
        console.log('🔑 Regular auth status:', qmsApi.isUserAuthenticated());
        
        // Use the new getHomeQueues method for historical data with pagination
        const homeResponse = await qmsApi.getHomeQueues(undefined, page);
        
        console.log('📊 Home response:', homeResponse);
        
        if (homeResponse.success && homeResponse.data) {
          const data = homeResponse.data;
          
          // Get broadqueues data
          const broadqueues = orderType === 'Export' ? data.export_queues : data.local_queues;
          const paginationData = orderType === 'Export' ? data.export_pagination : data.local_pagination;
          
          // Flatten broadqueues to individual orders/trucks for historical view
          const flattenedOrders: any[] = [];
          console.log('Processing broadqueues for flattening:', broadqueues.length);
          
          broadqueues.forEach((broadqueue: any, bqIndex: number) => {
            console.log(`Broadqueue ${bqIndex}:`, {
              id: broadqueue.id,
              orders_count: broadqueue.orders?.length || 0,
              order_date: broadqueue.order_date,
              product: broadqueue.product?.description
            });
            
            if (broadqueue.orders && broadqueue.orders.length > 0) {
              broadqueue.orders.forEach((order: any, index: number) => {
                const statusInfo = decodeOrderStatus(order);
                const flattenedOrder = {
                  ...order,
                  // Add broadqueue context
                  broadqueue_id: broadqueue.id,
                  criteria: broadqueue.criteria || `Criteria ${broadqueue.criteria_id}`,
                  order_type: broadqueue.order_type || orderType,
                  product: broadqueue.product,
                  // Format for truck card display using actual JSON structure
                  queueNumber: order.queue_no || (index + 1),
                  orderNumber: order.lo_no || order.sap_req_id || `Order ${order.id}`,
                  checkpoint: statusInfo.status,
                  checkpointColor: statusInfo.color,
                  checkpointIcon: statusInfo.icon,
                  vehicleNumber: order.vehicle?.plate_no || 'N/A',
                  driverName: getDriverStatus(order),
                  omc: order.omc?.title || 'N/A',
                  // Products info - safely extract string descriptions only
                  productInfo: (() => {
                    if (order.products && Array.isArray(order.products) && order.products.length > 0) {
                      return order.products
                        .map((p: any) => {
                          // Safely extract description, handling both string and object cases
                          if (typeof p === 'string') return p;
                          if (p && typeof p === 'object' && p.description) return String(p.description);
                          if (p && typeof p === 'object' && p.code) return String(p.code);
                          return 'Product';
                        })
                        .filter(Boolean)
                        .join(', ');
                    }
                    // Fallback to broadqueue product if available
                    if (broadqueue.product && typeof broadqueue.product === 'object' && broadqueue.product.description) {
                      return String(broadqueue.product.description);
                    }
                    return 'N/A';
                  })(),
                  time: {
                    date: new Date(order.updated_at || order.order_date || broadqueue.order_date || Date.now()).toLocaleString()
                  },
                  // Add fallback date string directly
                  dateString: new Date(order.updated_at || order.order_date || broadqueue.order_date || Date.now()).toLocaleString()
                };
                
                console.log(`Flattened order ${index}:`, {
                  id: flattenedOrder.id,
                  queueNumber: flattenedOrder.queueNumber,
                  orderNumber: flattenedOrder.orderNumber,
                  vehicleNumber: flattenedOrder.vehicleNumber,
                  omc: flattenedOrder.omc,
                  productInfo: flattenedOrder.productInfo,
                  time: flattenedOrder.time,
                  dateString: flattenedOrder.dateString
                });
                
                // Additional safety check to ensure all render properties are strings
                const safeOrder = {
                  ...flattenedOrder,
                  queueNumber: String(flattenedOrder.queueNumber || 'N/A'),
                  orderNumber: String(flattenedOrder.orderNumber || 'N/A'),
                  vehicleNumber: String(flattenedOrder.vehicleNumber || 'N/A'),
                  driverName: String(flattenedOrder.driverName || 'N/A'),
                  omc: String(flattenedOrder.omc || 'N/A'),
                  checkpoint: String(flattenedOrder.checkpoint || 'N/A'),
                  productInfo: String(flattenedOrder.productInfo || 'N/A'),
                  dateString: String(flattenedOrder.dateString || 'N/A')
                };
                
                flattenedOrders.push(safeOrder);
              });
            }
          });
          
          setBroadqueues(flattenedOrders);
          setAllBroadqueues(flattenedOrders);
          setPagination(paginationData);
          setCurrentPage(paginationData.current_page);
          
          console.log(`Loaded ${flattenedOrders.length} individual orders from ${broadqueues.length} ${orderType} broadqueues (page ${page})`);
        } else {
          console.log('❌ Historical data load failed:', homeResponse.error);
          Alert.alert(
            'Historical Data Error', 
            homeResponse.error || 'Failed to load historical queue data. Please check your web authentication and try again.',
            [
              {
                text: 'Switch to Live Data',
                onPress: () => {
                  setUseHistoricalData(false);
                  setCurrentPage(1);
                }
              },
              {
                text: 'Retry',
                onPress: () => loadBroadqueues(page)
              }
            ]
          );
          setBroadqueues([]);
        }
      } else {
        // Use the existing getQueues method for current data
        const queueResponse = await qmsApi.getQueues();
        
        if (queueResponse.success && queueResponse.data) {
          // Filter by order type to match original Ionic app behavior
          const filteredData = queueResponse.data.filter((item: any) => item.order_type === orderType);
          setBroadqueues(filteredData);
          setAllBroadqueues(filteredData); // Store all data
          console.log(`Loaded ${filteredData.length} ${orderType} broadqueues from current data`);
        } else {
          Alert.alert('Error', queueResponse.error || 'Failed to load broadqueue data');
          setBroadqueues([]);
          setAllBroadqueues([]);
        }
      }
    } catch (error) {
      console.error('Broadqueue loading error:', error);
      Alert.alert('Connection Error', 'Failed to connect to QMS servers');
      setBroadqueues([]);
      setAllBroadqueues([]);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date()); // Set timestamp when data is loaded
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    triggerHaptic(); // Haptic feedback on manual refresh
    await loadBroadqueues(currentPage);
    setIsRefreshing(false);
  };

  const filterBroadqueues = () => {
    let filtered = allBroadqueues;

    // Filter by search term across multiple fields
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        if (useHistoricalData) {
          // Search individual order fields
          const searchableFields = [
            item.orderNumber,
            item.vehicleNumber,
            item.driverName,
            item.omc,
            item.checkpoint,
            item.product?.description,
            item.criteria
          ];
          
          return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          );
        } else {
          // Search broadqueue fields
          const searchableFields = [
            item.products,
            item.criteria,
            item.order_type,
            item.product?.description,
            item.omc?.name,
            item.vehicle?.make,
            item.vehicle?.registration,
            item.driver?.name
          ];
          
          return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          );
        }
      });
      
      // When searching, always show all results
      setShowAllResults(true);
    } else {
      // Reset show all when no search term
      if (!showAllResults) {
        // Show only first 10 items when not searching and not showing all
        filtered = filtered.slice(0, 10);
      }
    }

    setFilteredBroadqueues(filtered);
  };

  const handleBroadqueueClick = (broadqueue: any) => {
    console.log('Item clicked:', broadqueue);
    triggerHaptic(); // Haptic feedback on card click
    
    if (useHistoricalData) {
      // In historical mode, individual truck cards don't need further navigation
      // They already show all the details
      console.log('Historical truck card clicked - no further action needed');
    } else {
      // In live mode, show the detailed queue screen
      setSelectedBroadqueue(broadqueue);
    }
  };

  const handleBackToBroadqueues = () => {
    setSelectedBroadqueue(null);
  };

  // Date picker functions (removing these)
  const handleActivateHistorical = () => {
    setUseHistoricalData(true);
    setCurrentPage(1);
  };

  // Pagination functions
  const handleNextPage = async () => {
    if (currentPage < pagination.last_page) {
      triggerHaptic(); // Haptic feedback
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await loadBroadqueues(nextPage);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      triggerHaptic(); // Haptic feedback
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      await loadBroadqueues(prevPage);
    }
  };

  const toggleHistoricalMode = () => {
    triggerHaptic(); // Haptic feedback
    if (!useHistoricalData) {
      // Show the historical data modal
      setShowHistoricalModal(true);
    } else {
      // Switch back to live data
      setUseHistoricalData(false);
      setCurrentPage(1);
    }
  };

  // Status decoder functions
  const decodeOrderStatus = (order: any) => {
    // Check if order has queue.checkpoint data
    if (order.queue && order.queue.checkpoint) {
      const checkpoint = order.queue.checkpoint;
      return {
        status: checkpoint.title,
        color: checkpoint.color,
        icon: checkpoint.title
      };
    }
    
    // No queue data means unavailable
    return { status: 'Unavailable', color: '#757575', icon: 'Unavailable' };
  };

  const getCheckpointIcon = (checkpointTitle: string) => {
    const title = checkpointTitle?.toLowerCase() || '';
    if (title.includes('loading')) return '🚛';
    if (title.includes('gate')) return '�';
    if (title.includes('security')) return '🛡️';
    if (title.includes('weighing')) return '⚖️';
    if (title.includes('inspection')) return '🔍';
    if (title.includes('documentation')) return '📋';
    if (title.includes('payment')) return '�';
    if (title.includes('completed') || title.includes('exit')) return '✅';
    return '📍'; // Default checkpoint icon
  };

  const getDriverStatus = (order: any) => {
    if (order.driver_id) {
      return `Driver ${order.driver_id}`;
    }
    return 'No Driver Assigned';
  };

  const renderBroadqueueItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, index * 10],
          })
        }]
      }}
    >
      <TouchableOpacity 
        onPress={() => handleBroadqueueClick(item)}
        activeOpacity={0.8}
      >
        <GlassCard
          style={styles.modernBroadqueueCard}
          intensity={70}
          padding={16}
        >
          <View style={styles.modernCardContent}>
            <View style={[styles.modernCardIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.modernCardIconText, { color: colors.primary }]}>
                📋
              </Text>
            </View>
            
            <View style={styles.modernCardInfo}>
              <Text style={[styles.modernCriteriaText, { color: colors.textPrimary }]}>
                {String(item.criteria || 'Queue Information')}
              </Text>
              
              <Text style={[styles.modernProductText, { color: colors.textSecondary }]}>
                {typeof item.products === 'string' 
                  ? item.products 
                  : typeof item.products === 'object' && item.products?.description
                    ? String(item.products.description)
                    : item.order_type}
                {useHistoricalData && item.order_count > 0 && (
                  <Text style={[styles.orderCountText, { color: colors.primary }]}>
                    {' • '}{item.order_count} orders
                  </Text>
                )}
              </Text>
              
              <View style={styles.modernCardFooter}>
                <View style={[styles.modernOrderTypeBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.modernOrderTypeText, { color: colors.primary }]}>
                    {orderType}
                  </Text>
                </View>
                
                {/* Additional info badges */}
                {item.omc && item.omc.name && (
                  <View style={[styles.infoTag, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.infoTagText, { color: colors.textSecondary }]}>
                      {String(item.omc.name)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={[styles.modernArrow, { borderLeftColor: colors.textTertiary }]} />
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render individual truck/order cards for historical mode
  const renderTruckCard = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, index * 5],
          })
        }]
      }}
    >
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
            Queue No. {String(item.queueNumber || 'N/A')}
          </Text>
        </View>
        
        {/* Information Rows with Icons */}
        <View style={styles.originalCardContent}>
          {/* Order Number Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🧾</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.orderNumber || 'N/A')}
            </Text>
          </View>
          
          {/* Status/Availability Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🎯</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.checkpoint || 'Unavailable')}
            </Text>
          </View>
          
          {/* Vehicle Number Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🚛</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.vehicleNumber || 'N/A')}
            </Text>
          </View>
          
          {/* Driver Name Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>👤</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.driverName || 'N/A')}
            </Text>
          </View>
          
          {/* Company Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🏢</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.omc || 'N/A')}
            </Text>
          </View>
          
          {/* Product Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>📦</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {typeof item.products === 'string' 
                ? item.products 
                : typeof item.products === 'object' && item.products?.description
                  ? String(item.products.description)
                  : typeof item.product === 'object' && item.product?.description
                    ? String(item.product.description)
                    : item.productName || 'Product N/A'}
            </Text>
          </View>
          
          {/* Timestamp Row */}
          <View style={styles.originalInfoRow}>
            <Text style={[styles.originalIcon, { color: colors.primary }]}>🕐</Text>
            <Text style={[styles.originalInfoText, { color: colors.textPrimary }]}>
              {String(item.time?.date || item.dateString || 'No date available')}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );

  // Show detailed queue screen if a broadqueue is selected
  if (selectedBroadqueue) {
    return (
      <DetailedQueueScreen
        orderType={orderType}
        broadqueueId={selectedBroadqueue.id}
        depot={depot}
        onBack={handleBackToBroadqueues}
        criteria={selectedBroadqueue.criteria}
        productInfo={selectedBroadqueue.products || selectedBroadqueue.product}
      />
    );
  }

  if (isLoading) {
    return (
      <LoadingScreen
        visible={true}
        message="Loading queue categories..."
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
        {/* Modern Header with Back Button */}
        <ModernHeader
          title={`${depot.toUpperCase()} (${orderType})`}
          subtitle="Select Queue Category"
          onBack={onBack}
        />

        {/* Auto-Refresh Indicator */}
        {showRefreshIndicator && (
          <Animated.View style={[styles.refreshIndicator, { backgroundColor: colors.success }]}>
            <Text style={styles.refreshIndicatorText}>🔄 Refreshing data...</Text>
          </Animated.View>
        )}

        {/* Modern Content Container */}
        <Animated.View 
          style={[
            styles.modernContentContainer,
            {
              backgroundColor: colors.glass,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Last Updated Timestamp */}
          {lastUpdated && (
            <View style={[styles.lastUpdatedContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.lastUpdatedText, { color: colors.textSecondary }]}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            </View>
          )}

          {/* Modern Search Bar */}
          <View style={styles.modernSearchContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
              <View style={[styles.searchIcon, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.searchIconText, { color: colors.primary }]}>🔍</Text>
              </View>
              <TextInput
                style={[
                  styles.modernSearchInput,
                  {
                    color: colors.textPrimary,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }
                ]}
                placeholder="Search queue categories..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Historical Data Toggle Button */}
          <View style={[styles.historicalToggleContainer, { backgroundColor: colors.surface }]}>
            {useHistoricalData ? (
              <View style={styles.historicalModeRow}>
                {/* Show All/Show Less Button */}
                {!searchTerm && allBroadqueues.length > 10 && (
                  <TouchableOpacity
                    style={[
                      styles.compactShowLessButton, 
                      { 
                        backgroundColor: showAllResults ? colors.backgroundSecondary : colors.primary, 
                        borderColor: showAllResults ? colors.border : colors.primary 
                      }
                    ]}
                    onPress={() => setShowAllResults(!showAllResults)}
                  >
                    <Text style={[
                      styles.compactShowLessText, 
                      { color: showAllResults ? colors.textPrimary : colors.surface }
                    ]}>
                      {showAllResults ? 'Show Less' : `Show All (${allBroadqueues.length})`}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {/* Close button */}
                <TouchableOpacity
                  style={[
                    styles.historicalCloseButton,
                    {
                      backgroundColor: colors.error,
                    }
                  ]}
                  onPress={toggleHistoricalMode}
                >
                  <Text style={[styles.historicalCloseIcon, { color: colors.surface }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.historicalToggleButton,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  }
                ]}
                onPress={toggleHistoricalMode}
              >
                <Text style={[styles.historicalToggleIcon, { color: colors.primary }]}>
                  📅
                </Text>
                <Text style={[styles.historicalToggleText, { color: colors.textPrimary }]}>
                  View Historical Data
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date Picker Modal - REMOVED */}

          {/* Modern Queue List */}
          <FlatList
            data={filteredBroadqueues}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={useHistoricalData ? renderTruckCard : renderBroadqueueItem}
            contentContainerStyle={styles.modernListContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.modernEmptyContainer}>
                <Text style={[styles.modernEmptyIcon, { color: colors.textTertiary }]}>
                  📭
                </Text>
                <Text style={[styles.modernEmptyText, { color: colors.textPrimary }]}>
                  No {orderType.toLowerCase()} {useHistoricalData ? 'orders' : 'queue categories'}
                </Text>
                <Text style={[styles.modernEmptySubtext, { color: colors.textSecondary }]}>
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : useHistoricalData 
                      ? 'No historical data available for this period'
                      : 'Pull to refresh or check back later'
                  }
                </Text>
              </View>
            }
          />

          {/* Compact Pagination Controls - moved to footer space */}
          {useHistoricalData && pagination.last_page > 1 && (
            <View style={[styles.compactPaginationContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.compactPaginationButton,
                  {
                    backgroundColor: currentPage > 1 ? colors.primary : colors.disabled,
                    opacity: currentPage > 1 ? 1 : 0.5,
                  }
                ]}
                onPress={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                <Ionicons name="chevron-back" size={20} color={colors.surface} />
              </TouchableOpacity>
              
              <Text style={[styles.compactPageText, { color: colors.textPrimary }]}>
                {currentPage} / {pagination.last_page}
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.compactPaginationButton,
                  {
                    backgroundColor: currentPage < pagination.last_page ? colors.primary : colors.disabled,
                    opacity: currentPage < pagination.last_page ? 1 : 0.5,
                  }
                ]}
                onPress={handleNextPage}
                disabled={currentPage >= pagination.last_page}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </SimpleGradient>

      {/* Floating Historical Data Button - REMOVED */}

      {/* Historical Data Modal */}
      <HistoricalDataModal
        visible={showHistoricalModal}
        onClose={() => setShowHistoricalModal(false)}
        onActivateHistorical={handleActivateHistorical}
        depot={depot}
      />

      {/* Queue Detail Modal for Historical Data */}
      <QueueDetailModal
        visible={showQueueDetailModal}
        onClose={() => {
          setShowQueueDetailModal(false);
          setSelectedBroadqueueForDetail(null);
        }}
        broadqueue={selectedBroadqueueForDetail}
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
  refreshIndicator: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  lastUpdatedContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 12,
    fontWeight: '500',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchIconText: {
    fontSize: 18,
  },
  modernSearchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 16,
    minHeight: 56,
  },
  // Historical data toggle styles
  historicalToggleContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 4,
  },
  historicalToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  historicalToggleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  historicalToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historicalCloseButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historicalCloseIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historicalModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  compactShowLessButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactShowLessText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modernListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  modernBroadqueueCard: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  modernCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  modernCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modernCardIconText: {
    fontSize: 24,
  },
  modernCardInfo: {
    flex: 1,
  },
  modernCriteriaText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modernProductText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  orderCountText: {
    fontWeight: '600',
    fontSize: 13,
  },
  modernOrderTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  modernOrderTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modernCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  showAllContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  showAllButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  showAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  showLessButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
  },
  showLessButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Copy styles from DetailedQueueScreen for truck cards
  originalQueueCard: {
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  originalQueueHeader: {
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  originalQueueNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalCardContent: {
    padding: 10,
  },
  originalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    minHeight: 18,
  },
  originalIcon: {
    fontSize: 12,
    marginRight: 6,
    width: 16,
    textAlign: 'center',
  },
  originalInfoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
    flexWrap: 'wrap',
  },
  modernArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 8,
  },
  modernEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  modernEmptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modernEmptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modernEmptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  modernCountContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modernCountText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Floating action button styles removed
  // Historical mode indicator
  historicalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  historicalIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  // Removed date picker styles
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 8,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 12,
  },
  pageInfoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 12,
    marginTop: 2,
  },
  // Compact pagination styles
  compactPaginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  compactPaginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactPageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Removed modal and date picker styles
});

export default QueueListScreen;