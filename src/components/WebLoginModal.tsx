import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { qmsApi } from '../api/client';

interface WebLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  depot: string;
}

const WebLoginModal: React.FC<WebLoginModalProps> = ({
  visible,
  onClose,
  onSuccess,
  depot,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors, typography, spacing } = useTheme();

  const handleWebLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await qmsApi.loginWeb(email.trim(), password.trim(), depot);
      
      if (response.success) {
        Alert.alert('Success', 'Web authentication successful! You can now access historical data.', [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              setPassword('');
              onSuccess();
              onClose();
            },
          },
        ]);
      } else {
        Alert.alert('Login Failed', response.error || 'Failed to authenticate with web credentials');
      }
    } catch (error) {
      console.error('Web login error:', error);
      Alert.alert('Error', 'Network error during web authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Web Authentication
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Login with web credentials to access historical data
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  }
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  }
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                📋 This uses separate web credentials from your mobile app login.
                {'\n'}📊 Required for accessing historical queue data with pagination.
                {'\n'}🔒 Your credentials are not stored and only used for this session.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }
              ]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.loginButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={handleWebLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: colors.surface }]}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    borderWidth: 1,
  },
  loginButton: {
    // Primary button styling handled by backgroundColor prop
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WebLoginModal;