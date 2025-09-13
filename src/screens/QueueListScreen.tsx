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
import DetailedQueueScreen from './DetailedQueueScreen';

interface QueueListScreenProps {
  orderType: 'Export' | 'Local';
  depot: string;
  onBack?: () => void;
}

const QueueListScreen = ({ orderType, depot, onBack }: QueueListScreenProps) => {
  const [broadqueues, setBroadqueues] = useState<any[]>([]);
  const [filteredBroadqueues, setFilteredBroadqueues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBroadqueue, setSelectedBroadqueue] = useState<any>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Theme
  const { colors, typography, spacing, borderRadius, shadows, isDark } = useTheme();

  useEffect(() => {
    loadBroadqueues();
  }, []);

  useEffect(() => {
    filterBroadqueues();
  }, [broadqueues, searchTerm]);

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

  const loadBroadqueues = async () => {
    try {
      setIsLoading(true);
      
      // Use the QMS API to get all broadqueues, then filter by order type
      const queueResponse = await qmsApi.getQueues();
      
      if (queueResponse.success && queueResponse.data) {
        // Filter by order type to match original Ionic app behavior
        const filteredData = queueResponse.data.filter((item: any) => item.order_type === orderType);
        setBroadqueues(filteredData);
        console.log(`Loaded ${filteredData.length} ${orderType} broadqueues from QMS API (filtered from ${queueResponse.data.length} total)`);
      } else {
          Alert.alert('Error', queueResponse.error || 'Failed to load broadqueue data');
          setBroadqueues([]);
      }
    } catch (error) {
      console.error('Broadqueue loading error:', error);
        Alert.alert('Connection Error', 'Failed to connect to QMS servers');
      setBroadqueues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBroadqueues();
    setIsRefreshing(false);
  };

  const filterBroadqueues = () => {
    let filtered = broadqueues;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        queue =>
          (queue.products && queue.products.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (queue.criteria && queue.criteria.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (queue.order_type && queue.order_type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBroadqueues(filtered);
  };

  const handleBroadqueueClick = (broadqueue: any) => {
    console.log('Broadqueue clicked:', broadqueue);
    setSelectedBroadqueue(broadqueue);
  };

  const handleBackToBroadqueues = () => {
    setSelectedBroadqueue(null);
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
        style={[
          styles.modernBroadqueueCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]}
        onPress={() => handleBroadqueueClick(item)}
        activeOpacity={0.8}
      >
        <View style={styles.modernCardContent}>
          <View style={[styles.modernCardIcon, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.modernCardIconText, { color: colors.primary }]}>
              📋
            </Text>
          </View>
          
          <View style={styles.modernCardInfo}>
            <Text style={[styles.modernCriteriaText, { color: colors.textPrimary }]}>
              {item.criteria}
            </Text>
            
            <Text style={[styles.modernProductText, { color: colors.textSecondary }]}>
              {item.products || item.order_type}
            </Text>
            
            <View style={[styles.modernOrderTypeBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.modernOrderTypeText, { color: colors.primary }]}>
                {orderType}
              </Text>
            </View>
          </View>
          
          <View style={[styles.modernArrow, { borderLeftColor: colors.textTertiary }]} />
        </View>
      </TouchableOpacity>
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
          {/* Modern Search Bar */}
          <View style={[styles.modernSearchContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.searchIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.searchIconText, { color: colors.primary }]}>🔍</Text>
            </View>
            <TextInput
              style={[
                styles.modernSearchInput,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                }
              ]}
              placeholder="Search queue categories..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Modern Queue List */}
          <FlatList
            data={filteredBroadqueues}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBroadqueueItem}
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
                  No {orderType.toLowerCase()} queue categories
                </Text>
                <Text style={[styles.modernEmptySubtext, { color: colors.textSecondary }]}>
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Pull to refresh or check back later'
                  }
                </Text>
              </View>
            }
          />

          {/* Modern Count Footer */}
          <View style={[styles.modernCountContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modernCountText, { color: colors.textSecondary }]}>
              {filteredBroadqueues.length} of {broadqueues.length} categories
            </Text>
          </View>
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  modernListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  modernBroadqueueCard: {
    borderRadius: 20,
    padding: 20,
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
  },
  modernCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modernOrderTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modernOrderTypeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
});

export default QueueListScreen;