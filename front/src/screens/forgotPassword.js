import React , { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Seus componentes centralizados
import { CustomInput, PrimaryButton, AppHeader } from '../components/central.js';

export default function ForgotPassword({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER */}
      <AppHeader 
        title="Recuperar Senha" 
        onBack={() => navigation.goBack()} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          // Isso faz com que o teclado feche ao clicar fora do input
          keyboardShouldPersistTaps="handled" 
        >
          <View style={styles.content}>
            <Image 
              source={require('../../assets/diagnostico.jpg')} 
              style={styles.mainImage}
            />

            <Text style={styles.title}>Esqueceu a senha?</Text>
            <Text style={styles.subtitle}>
              Insira o seu e-mail abaixo para receber um código de verificação.
            </Text>

            <CustomInput 
              label="E-mail"
              placeholder="seuemail@exemplo.com"
              icon={Mail} // Assumindo que o Mail está importado ou disponível via prop
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <PrimaryButton 
              title="Enviar Código"
              onPress={() => navigation.navigate('VerifyCode')}
              borderRadius={12}
              style={{ marginTop: 15 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1 },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 30,
    paddingTop: 20 
  },
  mainImage: { 
    width: '100%', 
    height: 250, 
    borderRadius: 20, 
    marginBottom: 30, 
    resizeMode: 'cover' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#161616', 
    marginBottom: 10,
    alignSelf: 'center'
  },
  subtitle: { 
    fontSize: 14, 
    color: '#828282', 
    textAlign: 'left', 
    textAlign: 'center',
    marginBottom: 30, 
    lineHeight: 20 
  },
});