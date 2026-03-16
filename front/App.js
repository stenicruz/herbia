import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// Importa a tua Splash personalizada
import MySplash from './src/screens/splash.js'; 
import Login from './src/screens/login.js';
import ForgotPassword from './src/screens/forgotPassword.js';
import VerifyCode from './src/screens/verifyCode.js';
import ResetPassword from './src/screens/resetPassword.js';
import SuccessScreen from './src/screens/successScreen.js';
import HomeScreen from './src/screens/home.js'
import CulturesScreen from './src/screens/culturesScreen.js';
import PhotoConfirmationScreen from './src/screens/photoConfirmationScreen.js';
import DiagnosticResultScreen from './src/screens/diagnosticResult.js';
import HistoryScreen from './src/screens/historyScreen.js';
import ProfileScreen from './src/screens/profileScreen.js';
import EditProfileScreen from './src/screens/editProfile.js';
import SupportScreen from './src/screens/support.js';
import PhotoSupport from './src/screens/photoSupport.js'
import DiagnosisGuideScreen from './src/screens/diagnosisSupport.js';
import PrivacyPolicyScreen from './src/screens/privacy.js';
import TermsOfUseScreen from './src/screens/termsOfUse.js';
import AdminDashboardScreen from './src/screens/adminHome.js';
import UserManagementScreen from './src/screens/userManagement.js';
import UserDetailsScreen from './src/screens/userDetails.js';
import Culture from './src/screens/culture.js'



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
      <Culture />
    </SafeAreaProvider>
  );
}