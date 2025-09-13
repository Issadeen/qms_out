/**
 * QMS React Native App
 * Modern replacement for Ionic 3 + Cordova app
 */

import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';

import { LoginScreen, QueueListScreen } from './src/screens';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDepot, setCurrentDepot] = useState<string>('');

  const handleLoginSuccess = (depot: string) => {
    setCurrentDepot(depot);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentDepot('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E57373" />
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <QueueListScreen orderType="Export" depot={currentDepot} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});