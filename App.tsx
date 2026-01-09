import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, BackHandler } from 'react-native';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to track authentication

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
    setIsAuthenticated(true);
    setShowDepotSelection(false); // Hide depot selection when login is complete
  };

  const handleOrderTypeSelected = (selectedOrderType: 'Export' | 'Local') => {
    setOrderType(selectedOrderType);
  };

  const handleBackToLogin = () => {
    setIsLoggedIn(false);
    setIsAuthenticated(false);
    setCurrentDepot('');
    setOrderType(null);
    setShowDepotSelection(false);
  };

  const handleBackToDepotSelection = () => {
    // Stay authenticated but go back to depot selection
    setIsLoggedIn(false); // This will show LoginScreen
    setShowDepotSelection(true); // But force it to show depot selection
    setOrderType(null);
    // Keep isAuthenticated true and currentDepot so depot selection works
  };

  const handleBackToOrderType = () => {
    setOrderType(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAuthenticated(false);
    setCurrentDepot('');
    setOrderType(null);
    setShowDepotSelection(false);
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      // If we're loading, don't allow back
      if (isLoading) {
        return true;
      }

      // If we're on the queue list screen, go back to order type
      if (isLoggedIn && orderType) {
        handleBackToOrderType();
        return true; // Prevent default behavior (closing app)
      }

      // If we're on order type screen, go back to depot selection
      if (isLoggedIn && !orderType) {
        handleBackToDepotSelection();
        return true;
      }

      // If we're on login/depot selection screen, allow app to close
      // Return false to allow default behavior
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isLoading, isLoggedIn, orderType]);

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
            isAuthenticated={isAuthenticated}
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