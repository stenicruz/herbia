import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image, Switch, Modal 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  Pencil, 
  Languages, 
  Headset, // Ícone de suporte mais comum/profissional
  Sun,     // Ícone para modo claro
  Moon,    // Ícone para modo escuro
  LogOut,
  Home, 
  History, 
  Camera, 
  User,
  Check
} from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
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
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.userName}>Sebastião Miguel</Text>
          <Text style={styles.userEmail}>sebastiao@gmail.com</Text>
        </View>

        {/* Opções de Menu */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem}>
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

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}>
                <Headset color={activeColor} size={22} />
              </View>
              <Text style={styles.menuText}>Suporte</Text>
            </View>
            <ChevronRight color="#666" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <LogOut color="#FFF" size={24} style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

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

      {/* MENU INFERIOR */}
      <View style={[
        styles.tabBar, 
        { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
      ]}>
        <TouchableOpacity style={styles.tabItem}>
          <Home color={inactiveColor} size={26} />
          <Text style={styles.tabLabel}>Casa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <History color={inactiveColor} size={26} />
          <Text style={styles.tabLabel}>Histórico</Text>
        </TouchableOpacity>
        <View style={styles.cameraTabWrapper}>
          <TouchableOpacity style={styles.cameraTabBtn}>
            <Camera color="#47e426" size={47} fill="#fff" />
          </TouchableOpacity>
          <Text style={styles.tabLabel}>Câmera</Text>
        </View>
        <TouchableOpacity style={styles.tabItem}>
          <User color={activeColor} size={26} fill={activeColor} />
          <Text style={[styles.tabLabel, { color: activeColor }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
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