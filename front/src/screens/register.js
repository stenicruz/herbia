import React, { useState, useEffect } from 'react';
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
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import plantService from '../services/plantService';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { CustomInput, PrimaryButton } from '../components/central.js';
import authService from '../services/authService'; // Importando o serviço
import { 
  GoogleSignin, 
  statusCodes
} from '@react-native-google-signin/google-signin';

const { height } = Dimensions.get('window');

export default function Register({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  // --- ESTADOS DO FORMULÁRIO ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      GoogleSignin.configure({
        webClientId: '691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com', // O teu ID
        offlineAccess: true,
      });
    }, []);

    const verificarAnalisePendente = async (user) => {
  try {
    const pendenteRaw = await AsyncStorage.getItem('@Herbia:analise_pendente');
    
    if (pendenteRaw) {
      // ✅ SÓ GUARDA SE FOR UTILIZADOR COMUM
      if (user && user.role !== 'admin') {
        const dados = JSON.parse(pendenteRaw);
        await plantService.salvarAnalisePendente(dados);
        console.log("LOG: Análise pendente guardada para o utilizador.");
      } else {
        console.log("LOG: Login de Admin detetado. Ignorando análise pendente.");
      }
      
      // ✅ LIMPA SEMPRE (Seja admin ou user) para não acumular lixo no storage
      await AsyncStorage.removeItem('@Herbia:analise_pendente');
    }
  } catch (error) {
    console.error("Erro ao processar análise pendente:", error);
  }
};

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
    
    await verificarAnalisePendente(response.user);
    
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

  // --- FUNÇÃO DE REGISTRO ---
  const handleRegister = async () => {
    // 1. Validações Básicas de Front-end
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As palavras-passe não coincidem.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Segurança", "A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // 2. Chamada para a API através do authService
      // O seu backend espera { nome, email, senha }
      await authService.register(name, email, password);

      // 3. Sucesso: O backend enviou o e-mail, agora vamos para a tela de verificação
      Alert.alert(
        "Conta Criada!",
        "Enviamos um código de confirmação para o seu e-mail.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('VerifyCode', { 
              email: email, 
              type: 'register' // Aqui avisamos que viemos do Registo
            }) 
          }
        ]
      );

    } catch (err) {
      // 4. Tratamento de Erro (Ex: E-mail já em uso)
      Alert.alert("Erro no Registro", err.error || "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

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
            
            <View style={styles.header}>
              <Image 
                source={isDarkMode ? require('../../assets/logo2.png') : require('../../assets/logo1.png')} 
                style={styles.logoIcon} 
              />
              <Text style={[styles.brandName, { color: currentTheme.textPrimary }]}>Herbia</Text>
              <Text style={[styles.tagline, { color: currentTheme.textSecondary }]}>Junte-se a nossa comunidade</Text>
            </View>

            {/* Formulário */}

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
          
          {/* Divisor "ou" */}
          <View style={styles.dividerContainer}>
            <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
            <Text style={[styles.dividerText, { color: currentTheme.textSecondary }]}>ou</Text>
            <View style={[styles.line, { backgroundColor: isDarkMode ? '#222' : '#EEEEEE' }]} />
          </View>
            
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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

              {loading ? (
                <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 20 }} />
              ) : (
                <PrimaryButton 
                  title="Criar Conta"
                  onPress={handleRegister} // Conectado à função
                  style={{ marginTop: 15 }}
                />
              )}
            </View>

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

// ... (seus estilos permanecem os mesmos)

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
  googleIcon: { width: 27, height: 27, marginRight: -3 },
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
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20
},
modalContent: {
  width: '100%',
  borderRadius: 20,
  padding: 30,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},
modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10
},
modalSubtitle: {
  fontSize: 14,
  textAlign: 'center',
  marginBottom: 25,
  lineHeight: 20
}
});