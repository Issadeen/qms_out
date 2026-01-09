import React, { ReactNode } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  fullScreen?: boolean;
  closeOnBackdropPress?: boolean;
}

const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onClose,
  children,
  fullScreen = false,
  closeOnBackdropPress = true,
}) => {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <BlurView
          intensity={Platform.select({ ios: 90, android: 60 })}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.modalContainer,
            fullScreen && styles.fullScreen,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.contentWrapper}>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    maxWidth: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    width: '90%',
  },
  fullScreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    maxWidth: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT,
  },
  contentWrapper: {
    flex: 1,
  },
});

export default GlassModal;
