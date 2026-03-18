import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image, Switch, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  Pencil, 
  Languages, 
  Headset, // Ícone de suporte mais comum/profissional
  Sun,     // Ícone para modo claro
  Moon,    // Ícone para modo escuro
  LogOut,
  Check
} from 'lucide-react-native';

import { PrimaryButton, ConfirmationModal } from '../components/central';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [language, setLanguage] = useState('Português');
  
  const activeColor = '#47e426';
  const inactiveColor = '#999';

  const languages = ['Português', 'English'];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Foto de Perfil e Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/user_profile_photo/218303075.jpeg')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.userName}>Sebastião Miguel</Text>
          <Text style={styles.userEmail}>sebastiao@gmail.com</Text>
        </View>

        {/* Opções de Menu */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                <Pencil color={activeColor} size={22} />
              </View>
              <Text style={styles.menuText}>Editar Perfil</Text>
            </View>
            <ChevronRight color="#666" size={20} />
          </TouchableOpacity>

          {/* Idioma com Modal de Seleção */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                <Languages color={activeColor} size={22} />
              </View>
              <Text style={styles.menuText}>Idioma</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuValue}>{language}</Text>
              <ChevronRight color="#666" size={20} />
            </View>
          </TouchableOpacity>

          {/* Modo Escuro com ícone dinâmico */}
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                {isDarkMode ? (
                  <Moon color={activeColor} size={22} fill={activeColor} />
                ) : (
                  <Sun color={activeColor} size={22} />
                )}
              </View>
              <Text style={styles.menuText}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#EEE", true: activeColor }}
              thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
              onValueChange={() => setIsDarkMode(previousState => !previousState)}
              value={isDarkMode}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support')}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                <Headset color={activeColor} size={22} />
              </View>
              <Text style={styles.menuText}>Suporte</Text>
            </View>
            <ChevronRight color="#666" size={20} />
          </TouchableOpacity>

          {/* Botão de Sair usando PrimaryButton */}
          <View style={{ marginTop: 10 }}>
            <PrimaryButton 
              title="Sair da Conta"
              icon={LogOut}
              reverse='true'
              onPress={() => setLogoutModalVisible(true)}
              iconSize={25}
              gap={15}
              variant="primary"
            />
          </View>

        </View>
      </ScrollView>

      {/* Modal de Seleção de Idioma */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Idioma</Text>
            {languages.map((lang) => (
              <TouchableOpacity 
                key={lang} 
                style={styles.languageOption}
                onPress={() => {
                  setLanguage(lang);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.languageText, language === lang && { color: activeColor }]}>
                  {lang}
                </Text>
                {language === lang && <Check color={activeColor} size={20} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.closeModalBtn}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      <ConfirmationModal 
        visible={logoutModalVisible}
        title="Encerrar Sessão?"
        description="Você terá que inserir suas credenciais novamente para acessar o Herbia."
        confirmText="Sair Agora"
        variant="danger"
        onConfirm={() => {
          setLogoutModalVisible(false);
          console.log("Usuário deslogado");
          // navigation.replace('Login'); // Exemplo de redirecionamento
        }}
        onClose={() => setLogoutModalVisible(false)}
      />

      {/* MENU INFERIOR */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  profileHeader: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  avatarContainer: { 
    width: 130, height: 130, borderRadius: 65, borderWidth: 3, 
    borderColor: '#47e426', padding: 5, justifyContent: 'center', alignItems: 'center' 
  },
  avatar: { width: 115, height: 115, borderRadius: 57 },
  userName: { fontSize: 22, fontWeight: '700', color: '#1B1919', marginTop: 15 },
  userEmail: { fontSize: 16, color: '#BBB', marginTop: 4 },
  menuContainer: { paddingHorizontal: 25 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 18, 
    paddingVertical: 15, paddingHorizontal: 20, marginBottom: 15, backgroundColor: '#FFF'
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 30, alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '600', color: '#1B1919', marginLeft: 15 },
  menuValue: { color: '#BBB', marginRight: 8, fontSize: 14 },
  logoutButton: { 
    backgroundColor: '#47e426', flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', paddingVertical: 16, borderRadius: 18, marginTop: 20 
  },
  logoutText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, paddingBottom: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  languageText: { fontSize: 18, color: '#333' },
  closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeModalText: { color: '#666', fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-around', position: 'absolute', bottom: 0, width: '100%', paddingTop: 12 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 4, fontWeight: '600', color: '#999'},
  cameraTabWrapper: { alignItems: 'center', marginTop: -40 },
  cameraTabBtn: { backgroundColor: '#47e426', width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: '#a5ef95', elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 }
});