import React, { useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Mail, RefreshCw, Check, Underline } from 'lucide-react-native'; // Importamos os ícones necessários

export default function VerifyCode({ navigation }) {
  const inputs = useRef([]);

  const focusNext = (index, value) => {
    if (value.length > 0 && index < 3) {
      inputs.current[index + 1].focus();
    }
    if (value.length === 0 && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#272525" size={28} />
        </TouchableOpacity>

        <View style={styles.content}>
          
          <View style={styles.iconWrapper}>
            {/* Círculo de "Recarregar/Processar" ao fundo */}
            <RefreshCw color="#47e426" size={160} strokeWidth={0.6} style={styles.bgIcon} />
            {/* Envelope no centro */}
              <Mail color="#47e426" size={50} fill="#47e426" fillOpacity={0.2} />
          </View>

          <Text style={styles.title}>Verificar Email</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de 4 dígitos para o seu email
          </Text>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(v) => focusNext(index, v)}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.buttonText}>Verificar</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Não recebeu o código?</Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Reenviar Código</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { padding: 20, marginTop: 35 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 40, paddingTop: 0 },
  
  // ESTILOS DO ÍCONE COMPOSTO
  iconWrapper: {
    width: 160,
    height: 155,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  bgIcon: {
    position: 'absolute',
    opacity: 0.6,
  },
  title: { fontSize: 28, fontWeight: '500', color: '#000', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#4F4F4F', textAlign: 'center', marginBottom: 50 },
  otpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 70 
  },
  otpInput: { 
    width: 58, 
    height: 58, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#F9F9F9'
  },
  button: { 
    backgroundColor: '#47e426', 
    width: '100%', 
    height: 55, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30
  },
  buttonText: { color: '#1B1919', fontSize: 18, fontWeight: 'bold' },
  resendContainer: { alignItems: 'center' },
  resendText: { color: '#1B1919', fontSize: 16 },
  resendLink: { color: '#47e426', fontWeight: 'bold', marginTop: 8, fontSize: 17 }
});