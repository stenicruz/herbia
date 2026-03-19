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

export default function VerifyCode({ navigation }) {
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const focusNext = (index, value) => {
    if (value.length > 0 && index < 3) {
      inputs.current[index + 1].focus();
    }
    if (value.length === 0 && index > 0) {
      inputs.current[index - 1].focus();
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

            <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Verificar Email</Text>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
              Enviamos um código de 4 dígitos para o seu email
            </Text>

            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => (
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
                  onFocus={() => setFocusedIndex(index)}
                  onChangeText={(v) => focusNext(index, v)}
                  textAlign="center"
                  selectionColor={THEME.primary}
                  placeholderTextColor={isDarkMode ? '#444' : '#CCC'}
                />
              ))}
            </View>

            <PrimaryButton 
              title="Verificar"
              onPress={() => navigation.navigate('ResetPassword')}
              style={{ width: '100%', marginBottom: 30 }}
            />

            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: currentTheme.textSecondary }]}>
                Não recebeu o código?
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
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
    width: 62, 
    height: 62, 
    borderRadius: 15, 
    fontSize: 28, 
    fontWeight: 'bold',
  },
  resendContainer: { alignItems: 'center', marginBottom: 40 },
  resendText: { fontSize: 16 },
  resendLink: { color: '#47e426', fontWeight: 'bold', marginTop: 10, fontSize: 17 }
});