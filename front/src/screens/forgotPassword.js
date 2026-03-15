import React from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Mail } from 'lucide-react-native';

export default function ForgotPassword({ navigation }) {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header com botão voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#000" size={28} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image 
            source={require('../../assets/diagnostico.jpg')} // Certifica-te que tens esta imagem
            style={styles.mainImage}
          />

          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Insira o seu e-mail, envie para receber um código de recuperação.
          </Text>

            <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <Text style={styles.inputLabel}>E-mail</Text>
            </View>

            <View style={styles.inputContainer}>
            <Mail color="#828282" size={20} style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#828282"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            </View>


          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('VerifyCode')}
          >
            <Text style={styles.buttonText}>Enviar Código</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { padding: 20, marginTop: 35 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30 },
  mainImage: { width: '100%', height: 300, borderRadius: 16, marginBottom: 25, resizeMode: 'cover' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 16 },
  subtitle: { fontSize: 14, color: '#828282', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    width: '100%',
    height: 55,
    marginBottom: 25
  },
    inputLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
    },
  inputIcon: { marginRight: 17 },
  input: { flex: 1, color: '#000', fontSize: 16 },
  button: { 
    backgroundColor: '#47e426', 
    width: '100%', 
    height: 55, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#272525', fontSize: 18, fontWeight: 'bold' }
});