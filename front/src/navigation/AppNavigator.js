import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Suas telas...
import MySplash from '../screens/Splash'; 
import Onboarding from '../screens/Onboarding';
import AccessMode from '../screens/AccessMode';
import TermsOfUse from '../screens/TermsOfUse.js'
import PrivacyPolicy from '../screens/PrivacyPolicy.js'
import Login from '../screens/Login';
import Register from '../screens/Register.js'
import ForgotPassword from '../screens/ForgotPassword.js'
import VerifyCode from '../screens/VerifyCode.js'
import ResetPassword from '../screens/ResetPassword.js'
import Success from '../screens/Success.js'
import Home from '../screens/Home.js'

const Stack = createStackNavigator();

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(null); // Iniciamos como null para saber que estamos a ler o storage

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  async function checkFirstLaunch() {
    try {
      const value = await AsyncStorage.getItem('@alreadyLaunched');
      if (value === null) {
        // Nunca abriu o app
        setIsFirstTime(true);
      } else {
        // Já abriu antes
        setIsFirstTime(false);
      }
    } catch (e) {
      setIsFirstTime(false);
    } finally {
      // Pequeno delay para a tua Splash personalizada brilhar
      setTimeout(() => setIsLoading(false), 2000);
    }
  }

  // Função para chamar quando o Onboarding terminar
  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@alreadyLaunched', 'true');
    setIsFirstTime(false);
  };

  if (isLoading || isFirstTime === null) return <MySplash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstTime ? (
        <Stack.Screen name="Onboarding">
          {(props) => <Onboarding {...props} onFinish={completeOnboarding} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="AccessMode" component={AccessMode} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Success" component={Success} />
        </>
      )}
    </Stack.Navigator>
  );
}