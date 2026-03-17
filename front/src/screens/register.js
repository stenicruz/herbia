import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, User } from 'lucide-react-native';

// Importando seus componentes centralizados
import { CustomInput, PrimaryButton } from '../components/central.js';

export default function Register({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    // Removendo a cor do container externo para evitar o "creme"
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        // Reduzi o offset para o teclado não empurrar demais
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
      >
        <ScrollView 
          contentContainerStyle={{
            backgroundColor: '#FFFFFF',
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20 
          }} 
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>
            {/* Logo e Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Image source={require('../../assets/logo1.png')} style={styles.logoIcon} />
              </View>
              <Text style={styles.brandName}>Herbia</Text>
              <Text style={styles.tagline}>Junte-se a nossa comunidade</Text>
            </View>

            {/* Botão Google */}
            <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
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

            {/* Formulário */}
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
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
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

              <PrimaryButton 
                title="Criar Conta"
                onPress={() => console.log("Cadastro solicitado")}
                style={{ marginTop: 10 }}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { 
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF' 
  },
  header: { alignItems: 'center', marginBottom: 20, marginTop: -10 },
  logoIcon: { width: 120, height: 120, resizeMode: 'contain' },
  brandName: { fontSize: 28, fontWeight: '500', color: '#1B1919', marginTop: -5 },
  tagline: { fontSize: 14, color: '#666', marginBottom: 10 },

  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, 
    height: 55, backgroundColor: '#FFFFFF', marginTop: 10
  },
  googleIcon: { width: 27, height: 27, marginRight: 12 },
  googleButtonText: { fontSize: 16, color: '#3C4043', fontWeight: '550' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EEEEEE' },
  dividerText: { marginHorizontal: 15, color: '#999', fontSize: 14 },

  form: { width: '100%' },
  
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30,
  },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#47e426', fontSize: 15, fontWeight: 'bold' }
});