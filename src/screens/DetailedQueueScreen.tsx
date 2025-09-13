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
} from 'react-native';
import { qmsApi } from '../api/client';
import { useTheme } from '../theme/ThemeContext';
import ModernHeader from '../components/ModernHeader';
import { SimpleGradient } from '../components/SimpleGradient';
import LoadingScreen from '../components/LoadingScreen';

interface DetailedQueueScreenProps {
  orderType: 'Export' | 'Local';
  broadqueueId: string;
  depot: string;
  onBack: () => void;
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
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [detailedQueues, setDetailedQueues] = useState<DetailedQueueItem[]>([]);
  const [filteredQueues, setFilteredQueues] = useState<DetailedQueueItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
      <View style={[
        styles.originalQueueCard,
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        }
      ]}>
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
      </View>
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
        {/* Modern Header with Back Button */}
        <ModernHeader
          title={`${depot.toUpperCase()} - ${orderType}`}
          subtitle="Detailed Queue Information"
          onBack={onBack}
        />

        {/* Content Container */}
        <Animated.View 
          style={[
            styles.modernContentContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Search Bar */}
          <View style={[styles.modernSearchContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.searchIcon, { color: colors.primary }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search vehicles, drivers, companies..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Queue List */}
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
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />

          {/* Modern Count Footer */}
          <View style={[styles.modernCountFooter, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modernCountText, { color: colors.textPrimary }]}>
              {filteredQueues.length} of {detailedQueues.length} detailed queues
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
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
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
  
  // Compact Original QMS Card Styles
  originalQueueCard: {
    marginHorizontal: 16,
    marginVertical: 4, // Very compact spacing
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  originalQueueHeader: {
    alignItems: 'center',
    paddingVertical: 8, // Very compact
    borderBottomWidth: 1,
  },
  originalQueueNumber: {
    fontSize: 18, // Compact size
    fontWeight: 'bold',
  },
  originalCardContent: {
    padding: 8, // Very compact
  },
  originalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2, // Very tight spacing
  },
  originalIcon: {
    fontSize: 14, // Smaller icons
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  originalInfoText: {
    fontSize: 12, // Compact text
    flex: 1,
  },
});

export default DetailedQueueScreen;