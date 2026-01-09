import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface QueueDetailModalProps {
  visible: boolean;
  onClose: () => void;
  broadqueue: any;
}

const QueueDetailModal = ({ visible, onClose, broadqueue }: QueueDetailModalProps) => {
  const { colors, typography, spacing } = useTheme();

  if (!broadqueue) return null;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderOrderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.orderHeader}>
        <View style={[styles.orderNumber, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.orderNumberText, { color: colors.primary }]}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderIdText, { color: colors.textPrimary }]}>
            Order ID: {item.id}
          </Text>
          {item.reference && (
            <Text style={[styles.orderRefText, { color: colors.textSecondary }]}>
              Ref: {item.reference}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.orderDetails}>
        {item.omc && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>OMC:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{item.omc.name}</Text>
          </View>
        )}

        {item.vehicle && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Vehicle:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {item.vehicle.make} - {item.vehicle.registration}
            </Text>
          </View>
        )}

        {item.driver && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Driver:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{item.driver.name}</Text>
          </View>
        )}

        {item.quantity && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Quantity:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {item.quantity} {item.unit || 'L'}
            </Text>
          </View>
        )}

        {item.created_at && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Created:</Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {formatDateTime(item.created_at)}
            </Text>
          </View>
        )}

        {item.status && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status:</Text>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: item.status === 'active' ? colors.successLight : colors.warningLight 
              }
            ]}>
              <Text style={[
                styles.statusText, 
                { 
                  color: item.status === 'active' ? colors.success : colors.warning 
                }
              ]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.surface }]}>
                Queue Details
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.surfaceSecondary }]}>
                {broadqueue.criteria || `Criteria ${broadqueue.criteria_id}`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: colors.primary }]}>×</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Broadqueue Summary */}
        <View style={[styles.summaryContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
            Queue Summary
          </Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Product</Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {broadqueue.product?.description || 'Mixed Products'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Order Type</Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {broadqueue.order_type}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Orders</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                {broadqueue.orders?.length || 0}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date</Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {broadqueue.order_date_formatted || new Date(broadqueue.order_date || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Orders List */}
        <View style={styles.ordersContainer}>
          <Text style={[styles.ordersTitle, { color: colors.textPrimary }]}>
            Individual Orders ({broadqueue.orders?.length || 0})
          </Text>
          
          {broadqueue.orders && broadqueue.orders.length > 0 ? (
            <FlatList
              data={broadqueue.orders}
              keyExtractor={(item, index) => `${item.id || index}`}
              renderItem={renderOrderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ordersList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>📋</Text>
              <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
                No individual orders available
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                This might be a summary queue or the orders haven't loaded yet
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  ordersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  orderInfo: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderRefText: {
    fontSize: 14,
    marginTop: 2,
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QueueDetailModal;