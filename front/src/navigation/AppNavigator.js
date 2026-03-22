import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

// IMPORTAÇÃO QUE FALTA:
import { BottomTabBar } from '../components/central.js'; 

// Telas
import AccessMode from '../screens/AccessMode';
import AdminHome from '../screens/AdminHome.js'
import AdminTips from '../screens/AdminTips.js';
import AllAnalyses from '../screens/AllAnalyses.js'
import CameraScanner from '../screens/CameraScanner.js';
import ConfirmPhoto from '../screens/ConfirmPhoto.js';
import CultureManager from '../screens/CultureManager.js';
import DiagnosticSupport from '../screens/DiagnosticSupport.js';
import DiagnosticResult from '../screens/DiagnosticResult.js';
import DiseaseManager from '../screens/DiseaseManager.js';
import EditDisease from '../screens/EditDisease.js';
import EditProfile from '../screens/EditProfile.js';
import ForgotPassword from '../screens/ForgotPassword.js';
import History from '../screens/History.js';
import Home from '../screens/Home.js';
import Login from '../screens/Login';
import Onboarding from '../screens/Onboarding';
import Plant from '../screens/Plant.js'
import PhotoConfirmation from '../screens/PhotoConfirmation.js';
import PhotoSupport from '../screens/PhotoSupport.js';
import PrivacyPolicy from '../screens/PrivacyPolicy.js';
import Profile from '../screens/Profile.js'
import Register from '../screens/Register.js';
import ResetPassword from '../screens/ResetPassword.js';
import ShowCulture from '../screens/ShowCulture.js'
import MySplash from '../screens/Splash'; 
import Support from '../screens/Support.js';
import Success from '../screens/Success.js';
import TermsOfUse from '../screens/TermsOfUse.js';
import UserDetails from '../screens/UserDetails.js';
import UserManagement from '../screens/UserManagement.js';
import VerifyCode from '../screens/VerifyCode.js';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Definição das Abas
function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ headerShown: false }}
      // O Navigator passa automaticamente 'state', 'navigation' e 'descriptors'
      tabBar={(props) => <BottomTabBar {...props} />} 
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

// Definição das Abas do Admin
function AdminTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />} 
    >
      <Tab.Screen name="AdminHome" component={AdminHome} /> 
      <Tab.Screen name="UserManagement" component={UserManagement} />
      <Tab.Screen name="Plant" component={Plant} />
      <Tab.Screen name="Profile" component={Profile} /> 
    </Tab.Navigator>
  );
}

export default function Routes() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin', 'user' ou null

useEffect(() => {
    checkInitialState();
  }, []);

  async function checkInitialState() {
    try {
      // 1. Verifica se é a primeira vez (Onboarding)
      const alreadyLaunched = await AsyncStorage.getItem('@alreadyLaunched');
      setIsFirstTime(alreadyLaunched === null);

      // 2. Verifica se já está logado e que tipo de user é
      const token = await AsyncStorage.getItem('@Herbia:token');
      const userData = await AsyncStorage.getItem('@Herbia:user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setUserType(user.tipo_usuario); // 'admin' ou 'comum' (ajusta conforme o teu banco)
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Tempo para a Splash Screen aparecer
      setTimeout(() => setIsLoading(false), 2000);
    }
  }

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@alreadyLaunched', 'true');
    setIsFirstTime(false);
  };

  if (isLoading) return <MySplash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstTime ? (
        <Stack.Screen name="Onboarding">
          {(props) => <Onboarding {...props} onFinish={completeOnboarding} />}
        </Stack.Screen>
      ) : (
        <Stack.Group>
          {/* LÓGICA DE REDIRECIONAMENTO AUTOMÁTICO */}
          {userType === 'admin' ? (
            <Stack.Screen name="AdminMain" component={AdminTabs} />
          ) : userType === 'comum' ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <Stack.Screen name="AccessMode" component={AccessMode} />
          )}
          {/* Restante das telas que podem ser chamadas via navigation.navigate */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen 
            name="CameraScanner" 
            component={CameraScanner} 
            options={{
              headerShown: false,
              animationEnabled: true, // Mantemos a animação, mas mudamos o tipo
              gestureEnabled: false,
              cardStyle: { backgroundColor: '#000' },
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress, // Isso cria um efeito de FADE (mais leve que o deslize)
                },
              }),
            }}
          />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="AdminMain" component={AdminTabs} />
          <Stack.Screen name="ShowCulture" component={ShowCulture} />
          <Stack.Screen name="DiagnosticResult" component={DiagnosticResult} />
          <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Success" component={Success} />
          <Stack.Screen name="ConfirmPhoto" component={ConfirmPhoto} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="PhotoSupport" component={PhotoSupport} />
          <Stack.Screen name="DiagnosticSupport" component={DiagnosticSupport} />
          <Stack.Screen name="AllAnalyses" component={AllAnalyses} />
          <Stack.Screen name="UserDetails" component={UserDetails} />
          <Stack.Screen name="AdminTips" component={AdminTips} />
          <Stack.Screen name="CultureManager" component={CultureManager} />
          <Stack.Screen name="DiseaseManager" component={DiseaseManager} />
          <Stack.Screen name="EditDisease" component={EditDisease} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}