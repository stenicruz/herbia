import React, { useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { setNavigationRef } from './src/services/api';
import Routes from './src/navigation/AppNavigator.js';

function Root() {
  const { loading, isDarkMode } = useTheme();
  const navigationRef = useRef(null);

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDarkMode ? '#121411' : '#FFF',
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator color="#47e426" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setNavigationRef(navigationRef.current);
        console.log("✅ Navigator pronto!"); // log temporário para confirmar
      }}
    >
      <Routes />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}