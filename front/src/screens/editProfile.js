import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform, StatusBar 
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

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton, CustomInput } from '../components/central';

export default function EditProfileScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [name, setName] = useState('Sebastião Miguel');
  const [email, setEmail] = useState('sebastiao@gmail.com');
  const [avatar, setAvatar] = useState('https://github.com/identicon.png');
  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  const activeColor = THEME.primary;

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
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Seção do Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <View style={[styles.avatarContainer, { borderColor: activeColor }]}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={[styles.cameraOverlay, { backgroundColor: activeColor, borderColor: currentTheme.background }]}>
                  <Camera color="#FFF" size={18} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Dados Pessoais */}
          <View style={styles.inputSection}>
            <CustomInput 
              label="Nome Completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              icon={User}
              darkMode={isDarkMode} // Passando prop caso seu CustomInput precise
            />

            <CustomInput 
              label="E-mail"
              placeholder="seuemail@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={Mail}
              darkMode={isDarkMode}
            />
          </View>

          {/* Seção de Segurança */}
          <View style={styles.passwordSection}>
            <View style={styles.sectionTitleRow}>
              <ShieldCheck color={activeColor} size={22} />
              <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Segurança da Conta</Text>
            </View>

            <View style={[
              styles.passwordCard, 
              { 
                backgroundColor: isDarkMode ? '#121411' : '#FFF', 
                borderColor: isDarkMode ? '#222' : '#F0F0F0' 
              }
            ]}>
              <CustomInput 
                label="Palavra-Passe Atual"
                placeholder="**********"
                value={currentPass}
                onChangeText={setCurrentPass}
                isPassword={true}
                icon={Lock}
                darkMode={isDarkMode}
              />

              <CustomInput 
                label="Nova Palavra-passe"
                placeholder="**********"
                value={newPass}
                onChangeText={setNewPass}
                isPassword={true}
                icon={Lock}
                darkMode={isDarkMode}
              />

              <CustomInput 
                label="Confirmar Nova Palavra-Passe"
                placeholder="**********"
                value={confirmPass}
                onChangeText={setConfirmPass}
                isPassword={true}
                icon={Lock}
                darkMode={isDarkMode}
              />
            </View>
          </View>

          <View style={{ marginTop: 30, marginBottom: 20 }}>
            <PrimaryButton
              textStyle={{ fontSize: 16, fontWeight: '800' }} 
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
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  
  avatarSection: { alignItems: 'center', marginVertical: 35 },
  avatarContainer: { 
    width: 130, 
    height: 130, 
    borderRadius: 65, 
    borderWidth: 3, 
    padding: 5,
    position: 'relative'
  },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  cameraOverlay: { 
    position: 'absolute', 
    bottom: 5, 
    right: 5, 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3
  },

  passwordSection: { marginTop: 35 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginLeft: 10, letterSpacing: 0.3 },
  
  passwordCard: { 
    borderWidth: 1, 
    borderRadius: 24, 
    padding: 20,
    // Sutil elevação apenas para o modo claro
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 15,
    elevation: 1 
  },
});