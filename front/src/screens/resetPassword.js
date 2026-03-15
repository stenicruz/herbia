import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Lock, Eye, EyeOff, ShieldCheck, RefreshCcw } from 'lucide-react-native';

export default function ResetPassword({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#272525" size={28} />
        </TouchableOpacity>

        <View style={styles.content}>
          
          {/* Ícone Composto (Escudo + Círculo de Recarga) */}
          <View style={styles.iconContainer}>
            <View style={styles.greenCircle}>
              <RefreshCcw color="#FFF" size={150} strokeWidth={1.5} style={styles.rotateIcon} />
              <View style={styles.shieldWrapper}>
                <ShieldCheck color="#FFF" size={60} strokeWidth={2} />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Nova Senha</Text>
          <Text style={styles.subtitle}>
            Crie uma senha forte para proteger a sua conta
          </Text>

          {/* Campo: Nova Palavra-Passe */}
            <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Nova Palavra-Passe</Text>
            <View style={styles.inputContainer}>
                <Lock color="#828282" size={20} style={styles.inputIcon} />
                <TextInput 
                style={styles.input}
                placeholder="**********"
                placeholderTextColor="#828282" // Força a cor aqui
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 5 }}>
                {showPassword ? <EyeOff color="#828282" size={20} /> : <Eye color="#828282" size={20} />}
                </TouchableOpacity>
            </View>
            </View>

          {/* Campo: Confirmar Palavra-Passe */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirmar Palavra-Passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#828282" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="**********"
                placeholderTextColor="#828282"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff color="#828282" size={20} /> : <Eye color="#828282" size={20} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('SuccessScreen')}
          >
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { padding: 20, marginTop: 35 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30 },
  
  // Estilo do Ícone de Escudo
  iconContainer: { marginBottom: 30 },
  greenCircle: {
    width: 120,
    height: 120,
    backgroundColor: '#47e426',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#47e426',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  shieldWrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 10,
  },
  rotateIcon: { opacity: 0.7 },

  title: { fontSize: 26, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#4F4F4F', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  
  inputWrapper: { width: '100%', marginBottom: 20 },
  inputLabel: { fontSize: 14, color: '#4F4F4F', marginBottom: 8, fontWeight: '500' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55,
    backgroundColor: '#FFFBFA'
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#000', fontSize: 16, textAlignVertical: 'center', },
  
  button: { 
    backgroundColor: '#47e426', 
    width: '100%', 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 40
  },
  buttonText: { color: '#222121', fontSize: 18, fontWeight: 'bold' }
});