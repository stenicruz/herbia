import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native'; // Adicionado Alert e TouchableOpacity
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante!

// Importando nosso componente
import { PrimaryButton } from '../components/central.js';

export default function Decision({ navigation }) {
  const insets = useSafeAreaInsets();

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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
      
      {/* 1. Header com Logo */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo1.png')} style={styles.logoIcon} />
        <Text style={styles.brandName}>Herbia</Text>
        <Text style={styles.tagline}>Sua planta, nossa paixão</Text>
      </View>

      {/* 2. Corpo Central */}
      <View style={styles.body}>
        <Text style={styles.title}>Como deseja continuar?</Text>
        <Text style={styles.subtitle}>Escolha a melhor forma de cuidar das suas plantas</Text>

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
              <Text style={styles.loginTitle}>Fazer Login</Text>
              <Text style={styles.loginSub}>Sincronize seus dados</Text>
            </View>
          }
        />

        <PrimaryButton 
          onPress={() => navigation.navigate('Home')}
          variant="outline"
          borderRadius={25}
          contentAlign="space-between"
          icon={ArrowRightCircle}
          gap={50}
          iconSize={40}
          iconStrokeWidth={1}
          style={styles.btnAdjust}
          title={
            <View style={styles.buttonTextContainer}>
              <Text style={styles.guestTitle}>Entrar como convidado</Text>
              <Text style={styles.guestSub}>Acesso rápido sem registro</Text>
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
        <Text style={styles.footerText} >Ao entrar, você concorda com nossos</Text>
        <Text style={styles.footerText}>
          <Text 
          style={styles.linkText} onPress={() => navigation.navigate('TermsOfUse')}>Termos de Uso</Text> e <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy', { isLogged: false })}>Política de Privacidade</Text>
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  // ... mantendo seus estilos anteriores ...
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 30, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: 30 },
  logoIcon: { width: 140, height: 140, resizeMode: 'contain' },
  brandName: { fontSize: 32, fontWeight: 'bold', color: '#161616', marginTop: -8 },
  tagline: { fontSize: 15, color: '#999', marginTop: 5 },
  body: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '550', textAlign: 'center', color: '#000', marginTop: -10 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 13, marginBottom: 40 },
  btnAdjust: { height: 100, paddingVertical: 15, marginBottom: 20 },
  buttonTextContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  loginTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  loginSub: { color: '#FFF', fontSize: 13, opacity: 0.9 },
  guestTitle: { color: '#222020', fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  guestSub: { color: '#888', fontSize: 13 },
  footer: { alignItems: 'center', marginTop: -15, marginBottom: 10 },
  footerText: { fontSize: 12, color: '#888', lineHeight: 18 },
  linkText: { color: '#47e426', fontWeight: 'bold' },

  // Estilo do botão de RESET
  devButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    borderStyle: 'dashed'
  },
  devButtonText: {
    fontSize: 10,
    color: '#CCC',
    fontWeight: 'bold'
  }
});