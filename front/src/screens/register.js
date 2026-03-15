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
// Importando ícones necessários
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react-native';

export default function Register() {
  const insets = useSafeAreaInsets();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          {/* Logo e Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Image source={require('../assets/logo1.png')} style={styles.logoIcon} />
            </View>
            <Text style={styles.brandName}>Herbia</Text>
            <Text style={styles.tagline}>Junte-se a nossa comunidade</Text>
          </View>

          {/* Botão Google - No topo nesta tela */}
          <TouchableOpacity style={styles.googleButton}>
            <Image 
              source={{ uri: 'https://pngimg.com/uploads/google/google_PNG19635.png' }} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleButtonText}>Cadastrar com Google</Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          {/* Formulário de Cadastro */}
          <View style={styles.form}>
            
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputContainer}>
              <User color="#A0A0A0" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Seu nome" // Seguindo o placeholder da tua imagem
                placeholderTextColor="#A0A0A0"
              />
            </View>

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
                placeholder="**********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff color="#333" size={20} /> : <Eye color="#333" size={20} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar Palavra-Passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#A0A0A0" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="**********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showConfirmPass}
              />
              <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <EyeOff color="#333" size={20} /> : <Eye color="#333" size={20} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* Footer: Link para Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Entrar agora</Text>
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
  header: { alignItems: 'center', marginBottom: 25 },
  logoIcon: { width: 110, height: 110, resizeMode: 'contain' },
  brandName: { fontSize: 28, fontWeight: 'bold', color: '#000', marginTop: -10 },
  tagline: { fontSize: 14, color: '#666' },

  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 12, 
    height: 53, backgroundColor: '#FFFFFF', marginTop: 10
  },
  googleIcon: { width: 29, height: 29, marginRight: 12 },
  googleButtonText: { fontSize: 16, color: '#3C4043', fontWeight: '500' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { marginHorizontal: 15, color: '#999' },

  form: { gap: 2 },
  label: { fontSize: 14, color: '#333', marginBottom: 6, fontWeight: '500', marginLeft:'3' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FDFDFD', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, height: 53
  },
  inputIcon: { marginRight: 14 },
  input: { flex: 1, color: '#000', fontSize: 15 },
  
  submitButton: {
    backgroundColor: '#4ADE80', borderRadius: 12,
    height: 53, justifyContent: 'center', alignItems: 'center', marginTop: 10
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30,
    marginBottom: 10
  },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#4ADE80', fontSize: 14, fontWeight: 'bold' }
});