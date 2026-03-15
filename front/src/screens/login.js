import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />  
          {/* Logo e Cabeçalho */}
          <View style={styles.header}>
              <Image source={require('../../assets/logo1.png')} style={styles.logoIcon} />
            <Text style={styles.brandName}>Herbia</Text>
            <Text style={styles.tagline}>Sua planta, nossa paixão</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Mail color="#A0A0A0" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="nome@exemplo.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Palavra-passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#A0A0A0" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff color="#666" size={20} /> : <Eye color="#666" size={20} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* Divisor "ou" */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          {/* Botão Google Estilo Padrão */}
          <TouchableOpacity style={styles.googleButton}>
            <Image 
              source={{ uri: 'https://pngimg.com/uploads/google/google_PNG19635.png' }} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleButtonText}>Continue com o Google</Text>
          </TouchableOpacity>

          {/* Outras Opções */}
          <View style={styles.footerOptions}>
            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={styles.createAccountText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a palavra-passe?</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 20, marginTop:'-30' },
  logoIcon: { width: 120, height: 120, resizeMode: 'contain' },
  brandName: { fontSize: 32, fontWeight: '500', color: '#000', marginTop: -15 },
  tagline: { fontSize: 14, color: '#666', marginBottom:'8' },

  form: { marginTop: 10 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500', marginLeft:'3' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 15, marginBottom: 18, height: 53
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, color: '#000', fontSize: 16 },
  
  loginButton: {
    backgroundColor: '#4ADE80', borderRadius: 12,
    height: 53, justifyContent: 'center', alignItems: 'center', marginTop: 5
  },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14 },

  googleButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1, 
    borderColor: '#D0D0D0', // Cinza suave do botão padrão
    borderRadius: 12, 
    height: 53,
    backgroundColor: '#FFFFFF',
    marginBottom: 15
  },
  googleIcon: { width: 29, height: 29, marginRight: 12, resizeMode: 'contain' },
  googleButtonText: { 
    fontSize: 16, 
    color: '#3C4043', // Cor exata do texto do Google
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Product Sans' : 'sans-serif-medium' 
  },
  
  footerOptions: { gap: 12, marginTop: 5 },
  createAccountButton: {
    borderWidth: 1, borderColor: '#4ADE80', borderRadius: 12,
    height: 53, justifyContent: 'center', alignItems: 'center'
  },
  createAccountText: { color: '#000', fontSize: 16, fontWeight: '600' },
  
  forgotPassword: { alignItems: 'center', marginTop: 10 },
  forgotPasswordText: { color: '#888', fontSize: 14 }
});