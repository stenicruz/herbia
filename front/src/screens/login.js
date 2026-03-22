import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { CustomInput, PrimaryButton } from '../components/central.js';
import authService from '../services/authService';
import { 
  GoogleSignin, 
  statusCodes
} from '@react-native-google-signin/google-signin';

const { height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  // --- ESTADOS PARA O FORMULÁRIO ---
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com', // O teu ID
      offlineAccess: true,
    });
  }, []);

const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    await GoogleSignin.hasPlayServices();
    
    const userInfo = await GoogleSignin.signIn();

    // Se o usuário fechar a janela, algumas versões retornam null em vez de erro
    if (!userInfo || !userInfo.data) {
      console.log("LOG: Janela fechada ou dados vazios.");
      setLoading(false);
      return; // Sai da função sem mostrar erro ao usuário
    }

    const { idToken } = userInfo.data; 

    const response = await authService.loginGoogle(idToken);
    
    navigation.reset({
      index: 0,
      routes: [{ name: response.user.role === 'admin' ? 'AdminMain' : 'Main' }], // Verifique se usa response.user.role
    });

  } catch (error) {
    // Verificamos se statusCodes existe para evitar o ReferenceError anterior
    const isCancel = error?.code === (statusCodes?.SIGN_IN_CANCELLED || '12501');
    
    if (isCancel) {
      console.log("LOG: Usuário cancelou o login.");
    } else {
      console.error("Erro detalhado:", error);
      const msg = error?.response?.data?.error || error?.message || "Erro ao entrar com Google";
      Alert.alert("Erro", msg);
    }
  } finally {
    setLoading(false);
  }
};

  const handleLogin = async () => {
    // 1. Validação simples
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 2. Chamada ao serviço (usa o IP configurado no api.js)
      const data = await authService.login(email, senha);

      // 3. Redirecionamento baseado no tipo de usuário real do Banco de Dados
      const routeName = data.user.tipo_usuario === 'admin' ? 'AdminMain' : 'Main';

      navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
      });

    } catch (err) {
      // --- LOGICA DE VERIFICAÇÃO DE EMAIL ---
      // Se o erro vier do teu Backend com a flag de e-mail não verificado:
      if (err.error === 'EMAIL_NOT_VERIFIED') {
        Alert.alert(
          "Conta não ativada",
          "O seu e-mail ainda não foi verificado. Deseja inserir o código agora?",
          [
            { 
              text: "Verificar Agora", 
              onPress: () => navigation.navigate('VerifyCode', { 
                email: email, // Usa o e-mail que já está no input de login
                type: 'register' 
              }) 
            },
            { text: "Depois", style: "cancel" }
          ]
        );
      } else {
        // Erros comuns (Senha errada, e-mail não existe, etc)
        Alert.alert("Erro no Login", err.error || "Não foi possível conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      /> 

      <ScrollView 
        // AJUSTE 2: Garantir que o fundo do ScrollView acompanhe o tema
        style={{ backgroundColor: currentTheme.background }}
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingBottom: insets.bottom + 20,
            backgroundColor: currentTheme.background // Força a cor aqui também
          } 
        ]} 
        showsVerticalScrollIndicator={false}
        // AJUSTE 3: Impede que o scroll "descole" do topo/fundo e mostre o que está atrás
        bounces={false}
        overScrollMode="never" 
      >
        <View style={[styles.inner, { paddingTop: insets.top + 20 }]}>
          
          {/* Logo e Cabeçalho */}
          <View style={styles.header}>
            <Image 
              source={isDarkMode ? require('../../assets/logo2.png') : require('../../assets/logo1.png')} 
              style={styles.logoIcon} 
            />
            <Text style={[styles.brandName, { color: currentTheme.textPrimary }]}>Herbia</Text>
            <Text style={[styles.tagline, { color: currentTheme.textSecondary }]}>Sua planta, nossa paixão</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <CustomInput 
              label="E-mail"
              placeholder="nome@exemplo.com"
              icon={Mail}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail} // Captura o email
              autoCapitalize="none"
            />

            <CustomInput 
              label="Palavra-passe"
              placeholder="********"
              icon={Lock}
              isPassword={true}
              value={senha}
              onChangeText={setSenha} // Captura a senha
            />

            {/* Mostra um loading enquanto o servidor processa */}
            {loading ? (
              <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 20 }} />
            ) : (
              <PrimaryButton 
                title="Entrar" 
                onPress={handleLogin} 
                borderRadius={12}
                style={{ marginTop: 10 }}
              />
            )}
          </View>

          {/* Divisor "ou" */}
          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
            <Text style={[styles.dividerText, { color: currentTheme.textSecondary }]}>ou</Text>
            <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
          </View>

          {/* Botão Google - Adaptado para Dark Mode */}
          <PrimaryButton 
            title="Continue com o Google"
            onPress={handleGoogleLogin}
            borderRadius={12}
            style={[
              styles.googleButton, 
              { 
                backgroundColor: isDarkMode ? '#121411' : '#FFFFFF',
                borderColor: isDarkMode ? '#333' : '#D0D0D0' 
              }
            ]}
            textStyle={{ color: isDarkMode ? '#FFF' : '#3C4043' }}
            icon={() => (
              <Image 
                source={{ uri: 'https://pngimg.com/uploads/google/google_PNG19635.png' }} 
                style={styles.googleIcon} 
              />
            )}
            reverse={true}
            gap={15}
          />

          {/* Outras Opções */}
          <View style={styles.footerOptions}>
            <PrimaryButton 
              title="Criar conta"
              variant="outline"
              borderRadius={12}
              onPress={() => navigation.navigate('Register')}
              style={{ borderColor: isDarkMode ? '#333' : THEME.primary }}
              textStyle={{ color: isDarkMode ? '#FFF' : '#292727' }}
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={[styles.forgotPasswordText, { color: currentTheme.textSecondary }]}>
                Esqueceu a palavra-passe?
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 30 },
  inner: { flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logoIcon: { 
    width: height * 0.13, 
    height: height * 0.14, 
    resizeMode: 'contain' 
  },
  brandName: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginTop: -10 
  },
  tagline: { 
    fontSize: 14, 
    marginTop: 5 
  },
  form: { width: '100%' },
  
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 15, fontSize: 14 },

  googleButton: {
    borderWidth: 1,
    elevation: 0,
    height: 55,
  },
  googleIcon: { width: 30, height: 30, resizeMode: 'contain' },
  
  footerOptions: { gap: 10, marginTop: 20 },
  forgotBtn: { alignSelf: 'center', padding: 10 },
  forgotPasswordText: { fontSize: 14, fontWeight: '500' }
});