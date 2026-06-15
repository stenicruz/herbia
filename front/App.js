import React, { useRef, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'; // Adicionado Text
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CloudOff } from 'lucide-react-native';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { setNavigationRef } from './src/services/api';
import { useNetworkStatus } from './src/hooks/useNetworkStatus';
import { inicializarDB } from './src/services/offlineService';
import plantService from './src/services/plantService';
import Routes from './src/navigation/AppNavigator.js';

// Indicador offline ajustado para verificar a tela atual
const OfflineIndicator = ({ isOnline, isSyncing, currentRouteName }) => {
  // Telas onde o ícone NÃO deve aparecer
  const telasEscondidas = ['ConfirmPhoto', 'CameraScanner', 'History']; 

  // Se estiver online, ou se estiver numa das telas escondidas, não mostra nada
  if (isOnline || telasEscondidas.includes(currentRouteName)) return null;

  return (
    <View style={[
      styles.offlineIndicator, 
      { opacity: isSyncing ? 0.5 : 1, backgroundColor: isSyncing ? '#2563eb' : '#dc2626c9' }
    ]}>
      <CloudOff color="#fff" size={18} strokeWidth={2.5} />
    </View>
  );
};

function Root() {
  const { loading, isDarkMode } = useTheme();
  const navigationRef = useRef(null);
  const { isOnline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState(''); // Estado para a tela atual

  useEffect(() => {
    inicializarDB().catch(err => console.error('DB Error:', err.message));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121411' : '#FFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#47e426" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer 
      ref={navigationRef} 
      onReady={() => {
        setNavigationRef(navigationRef.current);
        // Define a rota inicial
        setCurrentRouteName(navigationRef.current?.getCurrentRoute()?.name);
      }}
      onStateChange={() => {
        // Atualiza o nome da rota sempre que o utilizador muda de tela
        const previousRouteName = currentRouteName;
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        
        if (previousRouteName !== currentRoute) {
          setCurrentRouteName(currentRoute);
        }
      }}
    >
      <Routes />
      <OfflineIndicator 
        isOnline={isOnline} 
        isSyncing={isSyncing} 
        currentRouteName={currentRouteName} 
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  offlineIndicator: {
    position: 'absolute',
    top: 45, // Ajuste para o seu layout/notch
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 9999,
  },
});