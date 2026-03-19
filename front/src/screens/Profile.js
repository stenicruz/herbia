import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image, Switch, Modal, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, Pencil, Languages, Headset, Sun, Moon, LogOut, Check, UserX 
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton, ConfirmationModal } from '../components/central';

export default function ProfileScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Consumindo o Contexto de Tema
  const { isDarkMode, toggleTheme } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const { isAdminView } = route.params || { isAdminView: true }; 
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [language, setLanguage] = useState('Português');
  
  const activeColor = THEME.primary;
  const dangerColor = '#FF5252'; // Vermelho mais vibrante para o Dark Mode

  const languages = ['Português'];

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 170 }}
      >
        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { borderColor: activeColor }]}>
            <Image 
              source={require('../../assets/user_profile_photo/218303075.jpeg')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>Sebastião Miguel</Text>
          <Text style={[styles.userEmail, { color: isDarkMode ? '#888' : '#BBB' }]}>sebastiao@gmail.com</Text>
          
          {isAdminView && (
            <View style={[styles.adminBadge, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FFF0', borderColor: activeColor }]}>
              <Text style={[styles.adminBadgeText, { color: activeColor }]}>ADMINISTRADOR</Text>
            </View>
          )}
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}><Pencil color={activeColor} size={22} /></View>
              <Text style={[styles.menuText, { color: currentTheme.textPrimary }]}>Editar Perfil</Text>
            </View>
            <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]} 
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}><Languages color={activeColor} size={22} /></View>
              <Text style={[styles.menuText, { color: currentTheme.textPrimary }]}>Idioma</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.menuValue, { color: isDarkMode ? '#666' : '#BBB' }]}>{language}</Text>
              <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
            </View>
          </TouchableOpacity>

          {/* Switch de Dark Mode */}
          <View style={[styles.menuItem, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                {isDarkMode ? <Moon color={activeColor} size={22} fill={activeColor} /> : <Sun color={activeColor} size={22} />}
              </View>
              <Text style={[styles.menuText, { color: currentTheme.textPrimary }]}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#DDD", true: "#2D5A20" }}
              thumbColor={isDarkMode ? activeColor : "#f4f3f4"}
              onValueChange={toggleTheme} // A MÁGICA ACONTECE AQUI
              value={isDarkMode}
            />
          </View>

          {!isAdminView ? (
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]} 
              onPress={() => navigation.navigate('Support')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}><Headset color={activeColor} size={22} /></View>
                <Text style={[styles.menuText, { color: currentTheme.textPrimary }]}>Suporte</Text>
              </View>
              <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
            </TouchableOpacity>
          ) : (
            ''
          )}

          <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1A1212' : '#FFF', borderColor: isDarkMode ? '#3D2222' : '#ffebeb' }]} 
              onPress={() => setDeleteAccountModalVisible(true)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}><UserX color={dangerColor} size={22} /></View>
                <Text style={[styles.menuText, { color: dangerColor }]}>Excluir minha conta</Text>
              </View>
              <ChevronRight color={dangerColor} size={20} />
            </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <PrimaryButton 
              title="Sair da Conta"
              icon={LogOut}
              onPress={() => setLogoutModalVisible(true)}
              variant="primary"
              textStyle={isDarkMode && { color: '#121411' }} // Texto escuro no botão verde
            />
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE IDIOMA ADAPTADO */}
      <Modal animationType="slide" transparent={true} visible={languageModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Selecionar Idioma</Text>
            {languages.map((lang) => (
              <TouchableOpacity 
                key={lang} 
                style={[styles.languageOption, { borderBottomColor: isDarkMode ? '#222' : '#EEE' }]} 
                onPress={() => { setLanguage(lang); setLanguageModalVisible(false); }}
              >
                <Text style={[styles.languageText, { color: currentTheme.textPrimary }, language === lang && { color: activeColor, fontWeight: '800' }]}>{lang}</Text>
                {language === lang && <Check color={activeColor} size={20} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setLanguageModalVisible(false)}>
              <Text style={[styles.closeModalText, { color: isDarkMode ? '#AAA' : '#666' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONFIRMATION MODALS (Assumindo que eles já aceitam o tema internamente) */}
      <ConfirmationModal 
        visible={logoutModalVisible}
        title="Encerrar Sessão?"
        description="Você terá que inserir suas credenciais novamente para acessar o Herbia."
        confirmText="Sair Agora"
        onConfirm={() => { setLogoutModalVisible(false); navigation.navigate('AccessMode'); }}
        onClose={() => setLogoutModalVisible(false)}
      />
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <ConfirmationModal 
        visible={deleteAccountModalVisible}
        title="Excluir sua conta?"
        description="Esta ação é permanente. Todos os seus diagnósticos salvos e dados de perfil serão apagados dos nossos servidores e não poderão ser recuperados."
        confirmText="Excluir permanentemente"
        cancelText="Manter conta"
        onConfirm={() => {
          // Aqui entraria sua lógica de API para deletar
          setDeleteAccountModalVisible(false);
          navigation.navigate('AccessMode'); 
        }}
        onClose={() => setDeleteAccountModalVisible(false)}
        variant="danger" // Se o seu componente aceitar variant, use danger para o botão ficar vermelho
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  profileHeader: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  avatarContainer: { width: 135, height: 135, borderRadius: 68, borderWidth: 3, padding: 5, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  userName: { fontSize: 24, fontWeight: '800', marginTop: 15 },
  userEmail: { fontSize: 16, marginTop: 4, fontWeight: '500' },
  
  adminBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10, marginTop: 12, borderWidth: 1.5 },
  adminBadgeText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  
  menuContainer: { paddingHorizontal: 25 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    borderWidth: 1, borderRadius: 22, paddingVertical: 18, 
    paddingHorizontal: 20, marginBottom: 15,
    // Sombra leve para o modo claro
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 1
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 30, alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '700', marginLeft: 15 },
  menuValue: { marginRight: 8, fontSize: 14, fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, paddingBottom: 60 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 25, textAlign: 'center' },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1 },
  languageText: { fontSize: 18 },
  closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeModalText: { fontSize: 16, fontWeight: '800' },
});