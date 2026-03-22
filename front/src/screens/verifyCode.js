import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, RefreshCw } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton } from '../components/central.js';
import { Alert, ActivityIndicator } from 'react-native'; 
import authService from '../services/authService';

export default function VerifyCode({ navigation, route }) {
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [code, setCode] = useState(['', '', '', '','','']); // Estado para o código
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
  try {
    setLoading(true);
    // Enviamos o motivo baseado no 'type' da rota
    const motivo = type === 'register' ? 'registro' : 'recuperacao';
    
    await authService.resendCode(email, motivo); 
    
    Alert.alert("Sucesso", "Um novo código foi enviado para o teu email.");
  } catch (err) {
    Alert.alert("Erro", err.error || "Não foi possível reenviar o código.");
  } finally {
    setLoading(false);
  }
};

  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const { email, type } = route.params || { email: '', type: 'register' };

  const focusNext = (index, value) => {
  const newCode = [...code];
  newCode[index] = value;
  setCode(newCode);

  // Agora vai até o índice 4 para focar no 5 (total 6 campos)
  if (value.length > 0 && index < 5) {
    inputs.current[index + 1].focus();
  }
};

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && index > 0 && code[index] === '') {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
  const fullCode = code.join('');
  if (fullCode.length < 6) { // Mudar de 4 para 6
    Alert.alert("Erro", "Introduza o código de 6 dígitos.");
    return;
  }

    setLoading(true);
    try {
      if (type === 'register') {
        // Fluxo de Ativação de Conta
        await authService.verifyEmail(email, fullCode);
        Alert.alert("Sucesso!", "Conta verificada. Já podes fazer login.");
        navigation.navigate('Login');
      } else {
        await authService.verifyResetCode(email, fullCode);
        navigation.navigate('ResetPassword', { email, code: fullCode });
      }
    } catch (err) {
      Alert.alert("Erro", err.error || "Código inválido.");
    } finally {
      setLoading(false);
    }
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
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            
            <View style={styles.iconWrapper}>
              {/* Ícone de fundo com opacidade reduzida no Dark Mode */}
              <RefreshCw 
                color={THEME.primary} 
                size={160} 
                strokeWidth={0.4} 
                style={[styles.bgIcon, { opacity: isDarkMode ? 0.7 : 0.6 }]} 
              />
              <Mail 
                color={THEME.primary} 
                size={50} 
                fill={THEME.primary} 
                fillOpacity={0.2} 
              />
            </View>

            <Text style={[styles.title, { color: currentTheme.textPrimary }]}>{type === 'register' ? 'Verificar Conta' : 'Recuperar Senha'}</Text>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
              Enviamos um código de 6 dígitos para o seu email
            </Text>

            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                style={[
                  styles.otpInput,
                  { 
                    backgroundColor: isDarkMode ? '#121411' : '#F9F9F9',
                    color: currentTheme.textPrimary,
                    borderColor: focusedIndex === index ? THEME.primary : (isDarkMode ? '#333' : '#E0E0E0'),
                    borderWidth: focusedIndex === index ? 2 : 1
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onFocus={() => setFocusedIndex(index)}
                onChangeText={(v) => focusNext(index, v)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                textAlign="center"
              />
            ))}
            </View>

            {loading ? (
            <ActivityIndicator size="large" color={THEME.primary} />
          ) : (
            <PrimaryButton 
              title="Verificar"
              onPress={handleVerify}
              style={{ width: '100%', marginBottom: 30 }}
            />
          )}

            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: currentTheme.textSecondary }]}>
                Não recebeu o código?
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
                <Text style={styles.resendLink}>Reenviar Código</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 40, 
    paddingTop: 20 
  },
  iconWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  bgIcon: {
    position: 'absolute',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 50, lineHeight: 24 },
  otpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 60 
  },
  otpInput: { 
  width: 45, // Reduzi de 62 para 45 para caberem os 6 lado a lado
  height: 55, 
  borderRadius: 10, 
  fontSize: 22, // Reduzi um pouco a fonte
  fontWeight: 'bold',
  },
  resendContainer: { alignItems: 'center', marginBottom: 40 },
  resendText: { fontSize: 16 },
  resendLink: { color: '#47e426', fontWeight: 'bold', marginTop: 10, fontSize: 17 }
});