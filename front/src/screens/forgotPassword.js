import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { CustomInput, PrimaryButton, AppHeader } from '../components/central.js';
import { Alert, ActivityIndicator } from 'react-native';
import authService from '../services/authService';


const { height } = Dimensions.get('window');

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Atenção", "Por favor, insira o seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      // Chama a rota recuperarSenha do seu backend
      await authService.forgotPassword(email); 

      Alert.alert(
        "Código Enviado",
        "Verifique a sua caixa de entrada.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('VerifyCode', { 
              email: email, 
              type: 'forgot_password' // IMPORTANTE: para a tela saber que não é registro
            }) 
          }
        ]
      );
    } catch (err) {
      Alert.alert("Erro", err.error || "Não foi possível enviar o código.");
    } finally {
      setLoading(false);
    }
  };

  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: currentTheme.background }]} 
      edges={['top']}
    >
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      
      {/* HEADER - Já adaptado para Dark Mode internamente */}
      <AppHeader 
        title="Recuperar Senha" 
        onBack={() => navigation.goBack()} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          // Correção do vácuo branco no Android
          style={{ backgroundColor: currentTheme.background }}
          contentContainerStyle={[
            styles.scrollContent, 
            { backgroundColor: currentTheme.background }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          overScrollMode="never"
          bounces={false}
        >
          <View style={styles.content}>
            <Image 
              source={require('../../assets/diagnostico.jpg')} 
              style={[
                styles.mainImage,
                isDarkMode && { opacity: 0.8 } // Suaviza a imagem no modo escuro
              ]}
            />

            <Text style={[styles.title, { color: currentTheme.textPrimary }]}>
              Esqueceu a senha?
            </Text>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
              Insira o seu e-mail abaixo para receber um código de verificação.
            </Text>

            <View style={styles.form}>
              <CustomInput 
                label="E-mail"
                placeholder="seuemail@exemplo.com"
                icon={Mail}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {loading ? (
                <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 20 }} />
              ) : (
                <PrimaryButton 
                  title="Enviar Código"
                  onPress={handleSendCode}
                  borderRadius={12}
                  style={{ marginTop: 15 }}
                />
              )}
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
    paddingTop: 10 // Reduzido para caber melhor com o Header
  },
  mainImage: { 
    width: '100%', 
    height: height * 0.30, // Altura relativa para funcionar em telas menores
    borderRadius: 25, 
    marginBottom: 30, 
    resizeMode: 'cover' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 15, 
    textAlign: 'center',
    marginBottom: 35, 
    lineHeight: 22,
    paddingHorizontal: 10
  },
  form: {
    width: '100%',
  }
});