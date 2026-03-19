import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { CustomInput, PrimaryButton } from '../components/central.js';

const { height } = Dimensions.get('window');

export default function Register({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ backgroundColor: currentTheme.background }}
          contentContainerStyle={{
            backgroundColor: currentTheme.background,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 30 
          }} 
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>
            
            {/* Logo e Cabeçalho */}
            <View style={styles.header}>
              <Image 
                source={isDarkMode ? require('../../assets/logo2.png') : require('../../assets/logo1.png')} 
                style={styles.logoIcon} 
              />
              <Text style={[styles.brandName, { color: currentTheme.textPrimary }]}>Herbia</Text>
              <Text style={[styles.tagline, { color: currentTheme.textSecondary }]}>Junte-se a nossa comunidade</Text>
            </View>

            {/* Botão Google - Estilização Dark Dinâmica */}
            <TouchableOpacity 
              style={[
                styles.googleButton, 
                { 
                  backgroundColor: isDarkMode ? '#121411' : '#FFFFFF',
                  borderColor: isDarkMode ? '#333' : '#E8E8E8' 
                }
              ]} 
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: 'https://pngimg.com/uploads/google/google_PNG19635.png' }} 
                style={styles.googleIcon} 
              />
              <Text style={[styles.googleButtonText, { color: isDarkMode ? '#FFF' : '#3C4043' }]}>
                Cadastrar com Google
              </Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.dividerContainer}>
              <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
              <Text style={[styles.dividerText, { color: currentTheme.textSecondary }]}>ou</Text>
              <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <CustomInput 
                label="Nome Completo"
                placeholder="Seu nome"
                icon={User}
                value={name}
                onChangeText={setName}
              />

              <CustomInput 
                label="E-mail"
                placeholder="nome@exemplo.com"
                icon={Mail}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <CustomInput 
                label="Palavra-passe"
                placeholder="**********"
                icon={Lock}
                isPassword={true}
                value={password}
                onChangeText={setPassword}
              />

              <CustomInput 
                label="Confirmar Palavra-Passe"
                placeholder="**********"
                icon={Lock}
                isPassword={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <PrimaryButton 
                title="Criar Conta"
                onPress={() => console.log("Cadastro solicitado")}
                style={{ marginTop: 15 }}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: currentTheme.textSecondary }]}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Entrar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 25 },
  logoIcon: { 
    width: height * 0.12, 
    height: height * 0.12, 
    resizeMode: 'contain' 
  },
  brandName: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginTop: -10 
  },
  tagline: { 
    fontSize: 14, 
    marginTop: 5 
  },

  googleButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1, 
    borderRadius: 12, 
    height: 55, 
    marginTop: 10
  },
  googleIcon: { width: 24, height: 24, marginRight: 12 },
  googleButtonText: { fontSize: 16, fontWeight: '600' },

  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 15, fontSize: 14 },

  form: { width: '100%' },
  
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 35,
    marginBottom: 10
  },
  footerText: { fontSize: 15 },
  linkText: { 
    color: '#47e426', 
    fontSize: 15, 
    fontWeight: 'bold',
    marginLeft: 5 
  }
});