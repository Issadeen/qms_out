import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

import { ThemeProvider } from './src/theme/ThemeContext';
import SplashScreen from './src/components/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OrderTypeScreen from './src/screens/OrderTypeScreen';
import QueueListScreen from './src/screens/QueueListScreen';
import OptimizedApiClient from './src/utils/optimizedApiClient';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentDepot, setCurrentDepot] = useState<string>('');
  const [orderType, setOrderType] = useState<'Export' | 'Local' | null>(null);
  const [showDepotSelection, setShowDepotSelection] = useState(false);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  // Preload critical data on app start
  useEffect(() => {
    const preloadCriticalData = async () => {
      try {
        // Set API base URL (you can make this configurable)
        OptimizedApiClient.setBaseUrl('https://your-api-base-url.com');
        
        // Preload common endpoints that users typically access
        const criticalEndpoints = [
          '/api/depots',
          '/api/queue-status',
          '/api/system-info'
        ];
        
        // Fire and forget - load into cache for faster access
        OptimizedApiClient.preloadData(criticalEndpoints, {
          cacheExpiry: 10 * 60 * 1000, // 10 minutes
        });
      } catch (error) {
        // Silently handle preload errors - don't block app startup
        console.warn('Preload failed:', error);
      }
    };

    preloadCriticalData();
  }, []);

  const handleLoginSuccess = (depot: string) => {
    setCurrentDepot(depot);
    setIsLoggedIn(true);
    setShowDepotSelection(false); // Hide depot selection when login is complete
  };

  const handleOrderTypeSelected = (selectedOrderType: 'Export' | 'Local') => {
    setOrderType(selectedOrderType);
  };

  const handleBackToLogin = () => {
    setIsLoggedIn(false);
    setCurrentDepot('');
    setOrderType(null);
    setShowDepotSelection(false);
  };

  const handleBackToDepotSelection = () => {
    setIsLoggedIn(false); // Go back to LoginScreen 
    setShowDepotSelection(true); // But show depot selection instead of login form
    setOrderType(null);
    // Keep the currentDepot so it can be pre-selected in the carousel
  };

  const handleBackToOrderType = () => {
    setOrderType(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentDepot('');
    setOrderType(null);
  };

  return (
    <ThemeProvider>
      <View style={styles.container}>
        {isLoading ? (
          <SplashScreen 
            onComplete={handleSplashComplete} 
            duration={2500}
          />
        ) : !isLoggedIn ? (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess} 
            initialShowDepotSelection={showDepotSelection}
            initialSelectedDepot={currentDepot}
          />
        ) : !orderType ? (
          <OrderTypeScreen 
            depot={currentDepot} 
            onOrderTypeSelected={handleOrderTypeSelected}
            onBack={handleBackToDepotSelection}
          />
        ) : (
          <QueueListScreen 
            orderType={orderType} 
            depot={currentDepot}
            onBack={handleBackToOrderType}
          />
        )}
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});