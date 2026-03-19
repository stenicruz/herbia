import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Routes from './src/navigation/AppNavigator.js'; 

// REMOVEMOS: SplashScreen.preventAutoHideAsync();
// Isso faz a Splash nativa sumir imediatamente.

function Root() {
  const { loading, isDarkMode } = useTheme();

  // Se o tema ainda estiver carregando do disco, mostramos um fundo
  // da cor do tema do sistema para não dar o flash branco.
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: isDarkMode ? '#121411' : '#FFF', // Cor de fundo dinâmica
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator color="#47e426" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
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