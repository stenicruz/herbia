import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, ShieldCheck, RefreshCcw } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton, CustomInput } from '../components/central.js';

export default function ResetPassword({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const handleReset = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }
    
    // Simulação de sucesso
    navigation.reset({
      index: 0,
      routes: [{ name: 'Success' }], 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      
      <AppHeader onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ backgroundColor: currentTheme.background }}
          contentContainerStyle={[styles.scrollContent, { backgroundColor: currentTheme.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          bounces={false}
        >
          <View style={styles.content}>
            
            {/* Ícone de Escudo com efeito Glow no Dark Mode */}
            <View style={styles.iconContainer}>
              <View style={[
                styles.greenCircle, 
                { 
                  backgroundColor: THEME.primary,
                  shadowColor: THEME.primary,
                  elevation: isDarkMode ? 15 : 5 
                }
              ]}>
                <RefreshCcw 
                  color={isDarkMode ? THEME.dark.bacground : "#fff"} 
                  size={160} 
                  strokeWidth={1} 
                  style={[styles.rotateIcon, { opacity: isDarkMode ? 0.3 : 0.7 }]} 
                />
                <View style={styles.shieldWrapper}>
                  <ShieldCheck color="#FFF" size={55} strokeWidth={2.5} />
                </View>
              </View>
            </View>

            <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Nova Senha</Text>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
              Crie uma senha forte para proteger a sua conta
            </Text>

            <View style={styles.form}>
              <CustomInput 
                label="Nova Palavra-Passe"
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
                title="Redefinir Senha"
                onPress={handleReset}
                style={{ marginTop: 30, width: '100%' }}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 30,
    paddingTop: 20 
  },
  iconContainer: { 
    marginBottom: 40,
    marginTop: 10
  },
  greenCircle: {
    width: 125,
    height: 125,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras para o brilho
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  shieldWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateIcon: { 
    position: 'absolute' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 12 
  },
  subtitle: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 40, 
    lineHeight: 22,
    paddingHorizontal: 15 
  },
  form: {
    width: '100%',
  }
});