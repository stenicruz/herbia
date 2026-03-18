import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck
} from 'lucide-react-native';

import { AppHeader, PrimaryButton, CustomInput } from '../components/central';

export default function EditProfileScreen({ navigation }) {
 
  const [name, setName] = useState('Sebastião Miguel');
  const [email, setEmail] = useState('sebastiao@gmail.com');
  const [avatar, setAvatar] = useState('https://github.com/identicon.png');
  
  // Estados para senhas
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const activeColor = '#47e426';

  // Função para selecionar/tirar foto
  const handlePickImage = async () => {
    Alert.alert(
      "Alterar Foto",
      "Escolha uma opção:",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) setAvatar(result.assets[0].uri);
          }
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) setAvatar(result.assets[0].uri);
          }
        },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const handleSave = () => {
    // Lógica de salvamento aqui
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <AppHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >

      <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Permite clicar nos botões mesmo com teclado aberto
        >
        
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={styles.cameraOverlay}>
                <Camera color="#FFF" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <CustomInput 
            label="Nome Completo"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            icon= {User} // Supondo que seu CustomInput mapeia strings para ícones
          />

          <CustomInput 
            label="E-mail"
            placeholder="seuemail@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon= {Mail}
          />
        </View>

        <View style={styles.passwordSection}>
          <View style={styles.sectionTitleRow}>
            <ShieldCheck color={activeColor} size={24} />
            <Text style={styles.sectionTitle}>Alterar Palavra-Passe</Text>
          </View>

          <View style={styles.passwordCard}>
            {/* Palavra-Passe Actual */}
            <CustomInput 
              label="Palavra-Passe Actual"
              placeholder="**********"
              value={currentPass}
              onChangeText={setCurrentPass}
              isPassword={true}
              icon= {Lock}
            />

            {/* Nova Palavra-passe */}
            <CustomInput 
              label="Nova Palavra-passe"
              placeholder="**********"
              value={newPass}
              onChangeText={setNewPass}
              isPassword={true}
              icon= {Lock}
            />

            {/* Confirmar Palavra-Passe */}
            <CustomInput 
              label="Confirmar Palavra-Passe"
              placeholder="**********"
              value={confirmPass}
              onChangeText={setConfirmPass}
              isPassword={true}
              icon= {Lock}
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton
          textStyle={{fontSize: 18}} 
            title="Salvar Alterações" 
            onPress={handleSave} 
          />
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
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
  passwordSection: { marginTop: 30 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919', marginLeft: 10 },
  passwordCard: { 
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', 
    borderRadius: 20, padding: 15, elevation: 2, shadowColor: '#000', 
    shadowOpacity: 0.05, shadowRadius: 10 
  },
});