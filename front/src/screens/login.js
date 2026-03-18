import React from 'react';
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
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { CustomInput, PrimaryButton } from '../components/central.js';

const { height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const isAdmin = true; 

  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: isAdmin ? 'AdminMain' : 'Main' }],
    });
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
            />

            <CustomInput 
              label="Palavra-passe"
              placeholder="********"
              icon={Lock}
              isPassword={true}
            />

            <PrimaryButton 
              title="Entrar" 
              onPress={handleLogin} 
              borderRadius={12}
              style={{ marginTop: 10 }}
            />
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
            onPress={() => {}}
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