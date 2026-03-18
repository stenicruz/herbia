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
  Headset, 
  Sun, 
  Moon, 
  LogOut,
  Check,
  UserX // Ícone para excluir conta
} from 'lucide-react-native';

import { PrimaryButton, ConfirmationModal } from '../components/central';

export default function ProfileScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Captura se o usuário é admin via parâmetros de rota (ou mude para seu estado global)
  const { isAdminView } = route.params || { isAdminView: true }; 
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [language, setLanguage] = useState('Português');
  
  const activeColor = '#47e426';
  const dangerColor = '#d30a0a';

  const languages = ['Português', 'English'];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/user_profile_photo/218303075.jpeg')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.userName}>Sebastião Miguel</Text>
          <Text style={styles.userEmail}>sebastiao@gmail.com</Text>
          {isAdminView && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
            </View>
          )}
        </View>

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

          <TouchableOpacity style={styles.menuItem} onPress={() => setLanguageModalVisible(true)}>
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

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                {isDarkMode ? <Moon color={activeColor} size={22} fill={activeColor} /> : <Sun color={activeColor} size={22} />}
              </View>
              <Text style={styles.menuText}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#EEE", true: activeColor }}
              thumbColor={isDarkMode ? "#FFF" : "#f4f3f4"}
              onValueChange={() => setIsDarkMode(prev => !prev)}
              value={isDarkMode}
            />
          </View>

          {/* LÓGICA CONDICIONAL: SUPORTE VS EXCLUIR CONTA */}
          {!isAdminView ? (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}>
                  <Headset color={activeColor} size={22} />
                </View>
                <Text style={styles.menuText}>Suporte</Text>
              </View>
              <ChevronRight color="#666" size={20} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.menuItem, { borderColor: '#ffebeb' }]} 
              onPress={() => setDeleteAccountModalVisible(true)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}>
                  <UserX color={dangerColor} size={22} />
                </View>
                <Text style={[styles.menuText, { color: dangerColor }]}>Excluir minha conta</Text>
              </View>
              <ChevronRight color={dangerColor} size={20} />
            </TouchableOpacity>
          )}

          <View style={{ marginTop: 10 }}>
            <PrimaryButton 
              title="Sair da Conta"
              icon={LogOut}
              onPress={() => setLogoutModalVisible(true)}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE IDIOMA */}
      <Modal animationType="slide" transparent={true} visible={languageModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Idioma</Text>
            {languages.map((lang) => (
              <TouchableOpacity key={lang} style={styles.languageOption} onPress={() => { setLanguage(lang); setLanguageModalVisible(false); }}>
                <Text style={[styles.languageText, language === lang && { color: activeColor }]}>{lang}</Text>
                {language === lang && <Check color={activeColor} size={20} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE LOGOUT */}
      <ConfirmationModal 
        visible={logoutModalVisible}
        title="Encerrar Sessão?"
        description="Você terá que inserir suas credenciais novamente para acessar o Herbia."
        confirmText="Sair Agora"
        variant="danger"
        onConfirm={() => { setLogoutModalVisible(false); navigation.navigate('AccessMode'); }}
        onClose={() => setLogoutModalVisible(false)}
      />

      {/* MODAL DE EXCLUIR CONTA (SÓ PARA ADMIN) */}
      <ConfirmationModal 
        visible={deleteAccountModalVisible}
        title="Excluir Conta Permanentemente?"
        description="Atenção Admin: Esta ação removerá todos os seus privilégios e dados do sistema Herbia. Não poderá ser desfeita."
        confirmText="Excluir Definitivamente"
        variant="danger"
        onConfirm={() => { setDeleteAccountModalVisible(false); navigation.navigate('AccessMode'); }}
        onClose={() => setDeleteAccountModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  profileHeader: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  avatarContainer: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#47e426', padding: 5, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 115, height: 115, borderRadius: 57 },
  userName: { fontSize: 22, fontWeight: '700', color: '#1B1919', marginTop: 15 },
  userEmail: { fontSize: 16, color: '#BBB', marginTop: 4 },
  adminBadge: { backgroundColor: '#F0FFF0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#47e426' },
  adminBadgeText: { color: '#47e426', fontSize: 11, fontWeight: '800' },
  menuContainer: { paddingHorizontal: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 18, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 15, backgroundColor: '#FFF' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 30, alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '600', color: '#1B1919', marginLeft: 15 },
  menuValue: { color: '#BBB', marginRight: 8, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, paddingBottom: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  languageText: { fontSize: 18, color: '#333' },
  closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeModalText: { color: '#666', fontWeight: 'bold' },
});