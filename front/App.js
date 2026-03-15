import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// Importa a tua Splash personalizada
import MySplash from './src/screens/splash.js'; 
import Login from './src/screens/login.js';
import ForgotPassword from './src/screens/forgotPassword.js'

// Segura a splash nativa
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Simplesmente avisa que o motor do app está pronto
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        // Esconde a nativa para a sua personalizada assumir
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  // Se o sistema ainda não "escondeu" a nativa, não mostra nada
  if (!appIsReady) return null;

  // Mostra a SUA splash com a barra que corre
  if (showSplash) {
    return <MySplash onFinish={() => setShowSplash(false)} />;
  }

  // Só depois vai para o Login
  return (
    <SafeAreaProvider>
      <ForgotPassword />
    </SafeAreaProvider>
  );
}