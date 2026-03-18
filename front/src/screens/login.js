import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';

// Importando nossos componentes centralizados
import { CustomInput, PrimaryButton } from '../components/central.js';

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();

  const isAdmin = true; 

  const handleLogin = () => {
    if (isAdmin) { 
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminMain' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 10 } 
        ]} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.inner, { paddingTop: insets.top + 45 }]}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />  
          
          {/* Logo e Cabeçalho */}
          <View style={styles.header}>
            <Image source={require('../../assets/logo1.png')} style={styles.logoIcon} />
            <Text style={styles.brandName}>Herbia</Text>
            <Text style={styles.tagline}>Sua planta, nossa paixão</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <CustomInput 
              label="E-mail"
              placeholder="nome@exemplo.com"
              icon={Mail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              style={{ marginTop: 6 }}
            />
          </View>

          {/* Divisor "ou" */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          {/* Botão Google - Usando PrimaryButton customizado */}
          <PrimaryButton 
            title="Continue com o Google"
            onPress={() => {}}
            borderRadius={12}
            style={styles.googleButton}
            textStyle={styles.googleButtonText}
            icon={() => (
              <Image 
                source={{ uri: 'https://pngimg.com/uploads/google/google_PNG19635.png' }} 
                style={styles.googleIcon} 
              />
            )}
            reverse={true}
            contentAlign="center"
            gap={15}
          />

          {/* Outras Opções */}
          <View style={styles.footerOptions}>
            <PrimaryButton 
              title="Criar conta"
              variant="outline"
              borderRadius={12}
              onPress={() => navigation.navigate('Register')}
              textStyle={{ color: '#292727' }}
            />

            <PrimaryButton 
              title="Esqueceu a palavra-passe?"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{ backgroundColor: 'transparent', elevation: 0 }}
              textStyle={styles.forgotPasswordText}
            />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 20, marginTop: -30 },
  logoIcon: { width: 120, height: 120, resizeMode: 'contain' },
  brandName: { fontSize: 32, fontWeight: '500', color: '#000', marginTop: -15, marginBottom: 5 },
  tagline: { fontSize: 14, color: '#666', marginBottom: 8 },
  form: { marginTop: 10 },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14 },

  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    elevation: 0,
  },
  googleIcon: { width: 30, height: 30, resizeMode: 'contain' },
  googleButtonText: { 
    fontSize: 16, 
    color: '#3C4043', 
    fontWeight: '500',
  },
  
  footerOptions: { gap: 5, marginTop: 5 },
  forgotPasswordText: { color: '#888', fontSize: 14, fontWeight: '400' }
});