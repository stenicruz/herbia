import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Camera, 
  User, 
  Mail, 
  Lock, 
  Eye,      // Ícone para quando a senha está visível
  EyeOff,   // Ícone para quando a senha está oculta
  ShieldCheck
} from 'lucide-react-native';

export default function EditProfileScreen({ navigation }) {
  // Criamos um estado individual para cada campo de senha
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <ChevronLeft color="#1B1919" size={32} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraOverlay}>
              <Camera color="#FFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={styles.inputContainer}>
            <User color="#BBB" size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="Sebastião Miguel" 
              placeholderTextColor="#BBB" // Garante que o placeholder apareça
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Mail color="#BBB" size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="sebastiao@gmail.com" 
              placeholderTextColor="#BBB"
              keyboardType="email-address" 
            />
          </View>
        </View>

        <View style={styles.passwordSection}>
          <View style={styles.sectionTitleRow}>
            <ShieldCheck color={activeColor} size={24} />
            <Text style={styles.sectionTitle}>Alterar Palavra-Passe</Text>
          </View>

          <View style={styles.passwordCard}>
            {/* Palavra-Passe Actual */}
            <Text style={styles.label}>Palavra-Passe Actual</Text>
            <View style={styles.inputContainer}>
              <Lock color="#BBB" size={20} />
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showCurrentPass} 
                placeholder="**********" 
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => setShowCurrentPass(!showCurrentPass)}>
                {showCurrentPass ? <Eye color="#BBB" size={22} /> : <EyeOff color="#BBB" size={22} />}
              </TouchableOpacity>
            </View>

            {/* Nova Palavra-passe */}
            <Text style={styles.label}>Nova Palavra-passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#BBB" size={20} />
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showNewPass} 
                placeholder="**********" 
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                {showNewPass ? <Eye color="#BBB" size={22} /> : <EyeOff color="#BBB" size={22} />}
              </TouchableOpacity>
            </View>

            {/* Confirmar Palavra-Passe */}
            <Text style={styles.label}>Confirmar Palavra-Passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#BBB" size={20} />
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showConfirmPass} 
                placeholder="**********" 
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <Eye color="#BBB" size={22} /> : <EyeOff color="#BBB" size={22} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 15, paddingVertical: 10 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: 30 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#47e426', padding: 4 },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  cameraOverlay: { 
    position: 'absolute', bottom: 0, right: 0, 
    backgroundColor: '#47e426', width: 36, height: 36, 
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFF'
  },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 15 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#FFFBFA', borderWidth: 1, borderColor: '#EEE', 
    borderRadius: 12, paddingHorizontal: 15, height: 55 
  },
  input: { flex: 1, marginLeft: 12, color: '#1B1919', fontSize: 15 },
  passwordSection: { marginTop: 30 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919', marginLeft: 10 },
  passwordCard: { 
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', 
    borderRadius: 20, padding: 15, elevation: 2, shadowColor: '#000', 
    shadowOpacity: 0.05, shadowRadius: 10 
  },
  saveButton: { 
    backgroundColor: '#47e426', paddingVertical: 18, borderRadius: 15, 
    marginTop: 30, alignItems: 'center' 
  },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});