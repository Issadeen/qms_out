import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { qmsApi } from '../api/client';
import WebLoginModal from './WebLoginModal';

interface HistoricalDataModalProps {
  visible: boolean;
  onClose: () => void;
  onActivateHistorical: () => void;
  depot: string;
}

const HistoricalDataModal: React.FC<HistoricalDataModalProps> = ({
  visible,
  onClose,
  onActivateHistorical,
  depot,
}) => {
  const [showWebLogin, setShowWebLogin] = useState(false);
  const [isLoadingSharedAccount, setIsLoadingSharedAccount] = useState(false);
  const { colors, typography, spacing } = useTheme();

  const isWebAuthenticated = qmsApi.isWebAuthenticated();
  
  console.log('🏛️ HistoricalDataModal - Web auth status:', isWebAuthenticated);
  console.log('🏛️ HistoricalDataModal - Regular auth status:', qmsApi.isUserAuthenticated());

  const handleActivateHistorical = () => {
    console.log('🚀 Activating historical mode, web auth:', isWebAuthenticated);
    if (isWebAuthenticated) {
      // Already authenticated, can activate directly
      onActivateHistorical();
      onClose();
    } else {
      // Need web authentication first
      setShowWebLogin(true);
    }
  };

  const handleWebLoginSuccess = () => {
    setShowWebLogin(false);
    onActivateHistorical();
    onClose();
  };

  const handleSharedAccountLogin = async () => {
    try {
      setIsLoadingSharedAccount(true);
      console.log('🔗 Attempting shared account login...');
      
      const result = await qmsApi.loginWithSharedAccount(depot);
      
      if (result.success) {
        console.log('✅ Shared account login successful');
        onActivateHistorical();
        onClose();
      } else {
        console.log('❌ Shared account login failed:', result.error);
        // Show error or fallback to manual login
        alert('Unable to access historical data with shared account. Please try manual login.');
      }
    } catch (error) {
      console.error('Shared account login error:', error);
      alert('Unable to access historical data. Please try manual login.');
    } finally {
      setIsLoadingSharedAccount(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                📊 Historical Queue Data
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.error }]}
                onPress={onClose}
              >
                <Text style={[styles.closeButtonText, { color: colors.surface }]}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={[styles.featureCard, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  🕐 Browse Past Queues
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  Access historical queue data from previous operations
                </Text>
              </View>


              {/* Simple instructions without yellow background */}
              <View style={[styles.instructionsCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]}>
                  Access Options
                </Text>
                <Text style={[styles.instructionsDescription, { color: colors.textSecondary }]}>
                  • Use your own web credentials{'\n'}
                  • Or use shared access (no login required){'\n'}
                  • Browse paginated historical data{'\n'}
                  • Use navigation controls to explore
                </Text>
              </View>

              {/* Authentication Status - Modern design */}
              <View style={[
                styles.authStatusCard,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: isWebAuthenticated ? colors.success : colors.primary,
                }
              ]}>
                <View style={styles.authStatusHeader}>
                  <Text style={[styles.authStatusIcon, { color: isWebAuthenticated ? colors.success : colors.primary }]}>
                    {isWebAuthenticated ? '✓' : '🔑'}
                  </Text>
                  <Text style={[styles.authStatusTitle, { color: colors.textPrimary }]}>
                    {isWebAuthenticated ? 'Ready to Go' : 'Authentication Required'}
                  </Text>
                </View>
                <Text style={[styles.authStatusDescription, { color: colors.textSecondary }]}>
                  {isWebAuthenticated
                    ? 'You can access historical data with full features'
                    : 'Web credentials needed for historical data access'
                  }
                </Text>
              </View>

              {/* Current Depot Info */}
              <View style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.infoTitle, { color: colors.primary }]}>
                  📍 Current Depot: {depot.toUpperCase()}
                </Text>
                <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                  Historical data will be loaded for this depot
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                  }
                ]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {!isWebAuthenticated && (
                <TouchableOpacity
                  style={[
                    styles.sharedButton,
                    {
                      backgroundColor: colors.success,
                    }
                  ]}
                  onPress={handleSharedAccountLogin}
                  disabled={isLoadingSharedAccount}
                >
                  {isLoadingSharedAccount ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text style={[styles.sharedButtonText, { color: colors.surface }]}>
                      🔗 Quick Access
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.activateButton,
                  {
                    backgroundColor: isWebAuthenticated ? colors.success : colors.primary,
                  }
                ]}
                onPress={handleActivateHistorical}
              >
                <Text style={[styles.activateButtonText, { color: colors.surface }]}>
                  {isWebAuthenticated ? '📊 View Historical Data' : '🔐 Your Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Web Login Modal */}
      <WebLoginModal
        visible={showWebLogin}
        onClose={() => setShowWebLogin(false)}
        onSuccess={handleWebLoginSuccess}
        depot={depot}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  featureCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  instructionsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionsDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  authStatusCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  authStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  authStatusIcon: {
    fontSize: 20,
    marginRight: 8,
    fontWeight: 'bold',
  },
  authStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  authStatusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sharedButton: {
    flex: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sharedButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activateButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HistoricalDataModal;