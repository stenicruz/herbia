import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Alert, 
  Dimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../context/ThemeContext';
import { THEME } from '../styles/Theme';
import { PrimaryButton } from '../components/central.js';

const { height } = Dimensions.get('window');

export default function Decision({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const handleGuestAccess = async () => {
    try {
      // 1. Removemos os dados de login para garantir que o estado seja 'null'
      await AsyncStorage.removeItem('@Herbia:token');
      await AsyncStorage.removeItem('@Herbia:user');
      
      // Opcional: Se quiser limpar TUDO (cuidado se tiver preferências de tema/idioma)
      // await AsyncStorage.clear(); 

      console.log("Sessão de convidado iniciada (dados antigos limpos)");

      // 2. Navega para a Home
      navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    }); 
    } catch (error) {
      console.error("Erro ao limpar sessão:", error);
      navigation.navigate('MainTabs');
    }
  };

  // Função "Secreta" para Desenvolvedor
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@alreadyLaunched');
      Alert.alert(
        "Sucesso", 
        "O registro de Onboarding foi removido! Agora, pressione 'R' no seu terminal do Expo para reiniciar e ver o Onboarding.",
        [{ text: "Entendido" }]
      );
    } catch (e) {
      console.log("Erro ao limpar storage", e);
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: currentTheme.background, 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom + 20 
      }
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      /> 
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={isDarkMode ? require('../../assets/logo2.png') : require('../../assets/logo1.png')} 
          style={styles.logoIcon} 
        />
        <Text style={[styles.brandName, { color: currentTheme.textPrimary }]}>Herbia</Text>
        <Text style={[styles.tagline, { color: currentTheme.textSecondary }]}>Sua planta, nossa paixão</Text>
      </View>

      {/* 2. Corpo Central */}
      <View style={styles.body}>
        <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Como deseja continuar?</Text>
        <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
          Escolha a melhor forma de cuidar das suas plantas
        </Text>

        <PrimaryButton 
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          borderRadius={25}
          contentAlign="space-between"
          icon={ArrowRightCircle}
          gap={100}
          iconSize={40}
          iconStrokeWidth={1}
          style={styles.btnAdjust}
          title={
            <View style={styles.buttonTextContainer}>
              <Text style={[
                styles.loginTitle, 
                { color: isDarkMode ? THEME.dark.background : '#fff' }
              ]}>Fazer Login</Text>
              <Text style={[styles.loginSub, { color: currentTheme.background }]}>Sincronize seus dados</Text>
            </View>
          }
        />

        <PrimaryButton 
          onPress={handleGuestAccess}
          variant="outline"
          borderRadius={25}
          icon={ArrowRightCircle}
          iconSize={35}
          iconStrokeWidth={1}
          style={styles.btnAdjust}
          title={
            <View style={styles.buttonTextContainer}>
              <Text style={[
                styles.guestTitle, 
                { color: isDarkMode ? '#FFF' : '#222020' }
              ]}>Entrar como convidado</Text>
              <Text style={[styles.guestSub, { color: isDarkMode ? THEME.dark.textSecondary : currentTheme.textSecondary }]}>
                Acesso rápido sem registro
              </Text>
            </View>
          }
        />

        {/* BOTÃO DE RESET (Só para desenvolvedor) */}
        <TouchableOpacity onPress={resetOnboarding} style={styles.devButton}>
          <Text style={styles.devButtonText}>Reset Onboarding (Dev Only)</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Rodapé Termos */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: currentTheme.textSecondary }]}>
          Ao entrar, você concorda com nossos</Text>
        <Text style={styles.footerText}>
          <Text 
          style={styles.linkText} onPress={() => navigation.navigate('TermsOfUse')}>Termos de Uso</Text>
          <Text style={[styles.footerText, { color: currentTheme.textSecondary }]}> e</Text> <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy', { isLogged: false })}>Política de Privacidade</Text>
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 30, 
    justifyContent: 'space-between' 
  },
  header: { 
    alignItems: 'center', 
    marginTop: height * 0.03
  },
  logoIcon: { 
    width: height * 0.18,
    height: height * 0.16, 
    resizeMode: 'contain' 
  },
  brandName: { 
    fontSize: 32, 
    fontWeight: 500, 
    marginTop: -8 
  },
  tagline: { 
    fontSize: 15, 
    marginTop: 5 
  },
  body: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '550', 
    textAlign: 'center', 
    marginTop: -10 
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 13, 
    marginBottom: 40 
  },
  btnAdjust: { 
    height: 95, 
    paddingVertical: 15, 
    marginBottom: 20 
  },
  buttonTextContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  loginTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  loginSub: { 
    fontSize: 13, 
    opacity: 0.9 
  },
  guestTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  guestSub: { 
    fontSize: 13 
  },
  footer: { 
    alignItems: 'center', 
    marginBottom: 10 
  },
  footerText: { 
    fontSize: 12, 
    lineHeight: 18 
  },
  linkText: { 
    color: '#47e426', 
    fontWeight: 'bold', 
    fontSize: 12 
  },

  // Estilo do botão de RESET
  devButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    borderStyle: 'dashed'
  },
  devButtonText: {
    fontSize: 10,
    color: '#555',
    fontWeight: 'bold'
  }
});