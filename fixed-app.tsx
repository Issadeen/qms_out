import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E57373" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>QMS Queue</Text>
        <Text style={styles.subtitle}>Eldoret Queue Management</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.message}>React Native QMS App</Text>
        <Text style={styles.description}>
          Modern replacement for Ionic 3 + Cordova
        </Text>
        <Text style={styles.note}>
          Ready to implement login and queue list screens
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E57373',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  note: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});