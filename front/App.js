import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'; // Importante!

// Importa o seu mapa de rotas (ajuste o caminho se necessário)
import Routes from './src/navigation/AppNavigator.js'; 

// Segura a splash nativa do sistema
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pré-carregamento de fontes ou dados necessários aqui
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        // Esconde a splash nativa do Expo/Android/iOS
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  // Se o motor do app não estiver pronto, não renderiza nada
  if (!appIsReady) return null;

  return (
    <SafeAreaProvider>
      {/* O NavigationContainer é o que permite a navegação funcionar em todo o app */}
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}