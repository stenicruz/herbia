import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Decision() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
     <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
      {/* 1. Header com Logo */}
      <View style={styles.header}>
        <Image source={require('../assets/logo1.png')} style={styles.logoIcon} />
        <Text style={styles.brandName}>Herbia</Text>
        <Text style={styles.tagline}>Sua planta, nossa paixão</Text>
      </View>

      {/* 2. Corpo Central */}
      <View style={styles.body}>
        <Text style={styles.title}>Como deseja continuar?</Text>
        <Text style={styles.subtitle}>Escolha a melhor forma de cuidar das suas plantas</Text>

        {/* Botão Fazer Login */}
        <TouchableOpacity style={styles.loginButton}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.loginTitle}>Fazer Login</Text>
            <Text style={styles.loginSub}>Sincronize seus dados</Text>
          </View>
          <View style={styles.circleArrowWhite}>
            <ArrowRight color="#4ADE80" size={20} strokeWidth={3} />
          </View>
        </TouchableOpacity>

        {/* Botão Entrar como Convidado */}
        <TouchableOpacity style={styles.guestButton}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.guestTitle}>Entrar como convidado</Text>
            <Text style={styles.guestSub}>Acesso rápido sem registro</Text>
          </View>
          <View style={styles.circleArrowGreen}>
            <ArrowRight color="#4ADE80" size={20} strokeWidth={3} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. Rodapé Termos */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ao entrar, você concorda com nossos</Text>
        <Text style={styles.footerText}>
          <Text style={styles.linkText}>Termos de Uso</Text> e <Text style={styles.linkText}>Política de Privacidade</Text>
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoIcon: { width: 140, height: 140, resizeMode: 'contain' },
  brandName: { fontSize: 32, fontWeight: 'bold', color: '#000', marginTop: -8 },
  tagline: { fontSize: 16, color: '#666', marginTop: 8 },

  body: {
    flex: 1,
    justifyContent: 'center'
  },
  title: { fontSize: 24, fontWeight: '550', textAlign: 'center', color: '#000', marginTop:'-15'},
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 12, marginBottom: 55 },

  loginButton: {
    backgroundColor: '#4ADE80',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  guestButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  buttonTextContainer: { flex: 1 },
  loginTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom:'10', },
  loginSub: { color: '#FFF', fontSize: 13, opacity: 0.9 },
  guestTitle: { color: '#000', fontSize: 18, fontWeight: 'bold', marginBottom:'10', },
  guestSub: { color: '#888', fontSize: 13 },

  circleArrowWhite: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleArrowGreen: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: { alignItems: 'center' },
  footerText: { fontSize: 12, color: '#888', lineHeight: 18 },
  linkText: { color: '#4ADE80', fontWeight: 'bold' },
});