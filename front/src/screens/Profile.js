import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image, Switch, Modal, StatusBar, TextInput, KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, Pencil, Languages, Headset, Sun, Moon, LogOut, Check, UserX 
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { PrimaryButton, ConfirmationModal } from '../components/central';
import authService from '../services/authService';
import userService from '../services/userService';

export default function ProfileScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  // ESTADOS PARA OS DADOS DO BACK-END
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS PARA EXCLUSÃO ---
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  // Validar a senha no Back-end
  const handleVerifyPassword = async () => {
    // Se for Google, pula a senha e vai direto para a confirmação final
    if (user?.isGoogle) {
      setPasswordModalVisible(false);
      setDeleteAccountModalVisible(true);
      return; // <--- ESSENCIAL: Para parar a execução aqui
    }

    if (!password) {
      alert("Por favor, digite sua senha.");
      return;
    }
    
    setPasswordModalVisible(false);
    setDeleteAccountModalVisible(true);
  };

  // Exclusão Real
  const confirmDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // Chamada ao seu userService
      await userService.deleteConta(user.id, password);

      setDeleteAccountModalVisible(false);
      setPassword(''); // Limpa a senha
      
      alert("Conta excluída com sucesso. Sentiremos sua falta!");

      // Reset para a tela de acesso
      navigation.reset({
        index: 0,
        routes: [{ name: 'AccessMode' }],
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Senha incorreta ou erro ao excluir conta.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao entrar na tela
  useFocusEffect(
  React.useCallback(() => {
    loadUserData(); // Aquela sua função que já busca do AsyncStorage
  }, [])
);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@Herbia:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do usuário", e);
    } finally {
      setLoading(false);
    }
  };

  const isGuest = !user;
  const isAdmin = user?.role === 'admin';

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
  try {
    setLoading(true);
    // 1. Chamar o serviço para invalidar o token no servidor
    await authService.logout(); 

    // 2. Fechar o modal
    setLogoutModalVisible(false);

    // 3. Resetar a navegação para a tela inicial de acesso
    // Usamos reset para que o utilizador não consiga "voltar" para o perfil clicando no botão de retroceder do telemóvel
    navigation.reset({
      index: 0,
      routes: [{ name: 'AccessMode' }],
    });
    
    console.log("✅ Sessão encerrada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao sair:", error);
    setLogoutModalVisible(false);
    // Mesmo com erro na API, forçamos a saída no Front-end por segurança
    navigation.navigate('AccessMode');
  }
};

  
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
              source={isGuest 
                ? require('../../assets/icon.png') // Logo para convidados
                : { uri: user.foto_perfil || 'https://via.placeholder.com/150' } // Foto do Back
              } 
              style={styles.avatar} 
            />
          </View>
          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>{isGuest ? 'Olá, Convidado' : user.nome}</Text>
          <Text style={[styles.userEmail, { color: isDarkMode ? '#888' : '#BBB' }]}>{isGuest ? 'criaconta@email.com' : user.email}</Text>
          
          {isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FFF0', borderColor: activeColor }]}>
              <Text style={[styles.adminBadgeText, { color: activeColor }]}>ADMINISTRADOR</Text>
            </View>
          )}
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuContainer}>
          {/* Esconder Editar Perfil se for Guest */}
          {!isGuest && (
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
          )}

          <View 
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconBox}><Languages color={activeColor} size={22} /></View>
              <Text style={[styles.menuText, { color: currentTheme.textPrimary }]}>Idioma</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.menuValue, { color: isDarkMode ? '#666' : '#BBB' }]}>{language}</Text>
              <ChevronRight color={isDarkMode ? "#444" : "#666"} size={20} />
            </View>
          </View>

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

          {!isAdmin ? (
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

          {!isGuest && (
          <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1A1212' : '#FFF', borderColor: isDarkMode ? '#3D2222' : '#ffebeb' }]} 
              onPress={() => {
                if (user?.isGoogle) {
                  setDeleteAccountModalVisible(true); // Direto para o aviso final
                } else {
                  setPasswordModalVisible(true); // Pede senha primeiro
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconBox}><UserX color={dangerColor} size={22} /></View>
                <Text style={[styles.menuText, { color: dangerColor }]}>Excluir minha conta</Text>
              </View>
              <ChevronRight color={dangerColor} size={20} />
            </TouchableOpacity>
            )}

          <View style={{ marginTop: 20 }}>
            <PrimaryButton 
              title={isGuest ? 'Sair' : "Sair da Conta"}
              icon={LogOut}
              onPress={() => isGuest ? navigation.navigate('AccessMode') : setLogoutModalVisible(true)}
              variant="primary"
              textStyle={isDarkMode && { color: '#121411' }} // Texto escuro no botão verde
            />
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE IDIOMA ADAPTADO */}
      {/*
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
      */}
      
      {/* MODAL PARA SOLICITAR SENHA */}
      <Modal animationType="fade" transparent visible={passwordModalVisible}>
        <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[{flex : 1}]}
        >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.background, paddingBottom: 380 }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>Confirme sua Senha</Text>
            <Text style={{ color: isDarkMode ? '#888' : '#666', textAlign: 'center', marginBottom: 20 }}>
              Para sua segurança, digite sua senha para prosseguir com a exclusão.
            </Text>
            
            <TextInput
              style={[styles.passwordInput, { 
                backgroundColor: isDarkMode ? '#1A1D19' : '#F5F5F5',
                color: currentTheme.textPrimary,
                borderColor: isDarkMode ? '#333' : '#DDD'
              }]}
              placeholder="Sua senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <PrimaryButton 
              title="Continuar" 
              onPress={handleVerifyPassword}
              variant="primary"
            />
            
            <TouchableOpacity 
              style={{ marginTop: 15, alignItems: 'center' }} 
              onPress={() => { setPasswordModalVisible(false); setPassword(''); }}
            >
              <Text style={{ color: dangerColor, fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* CONFIRMATION MODALS (Assumindo que eles já aceitam o tema internamente) */}
      <ConfirmationModal 
        visible={logoutModalVisible}
        title="Encerrar Sessão?"
        description="Você terá que inserir suas credenciais novamente para acessar o Herbia."
        confirmText="Sair Agora"
        onConfirm={handleLogout}
        onClose={() => setLogoutModalVisible(false)}
      />
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ============ Aplicar Lógica de exclusão de conta*/}
      <ConfirmationModal 
        visible={deleteAccountModalVisible}
        title="Tem certeza absoluta?"
        description="Esta ação não pode ser desfeita. Todos os seus dados serão apagados."
        confirmText="Sim, excluir tudo"
        cancelText="Desistir"
        onConfirm={confirmDeleteAccount}
        onClose={() => setDeleteAccountModalVisible(false)}
        variant="danger"
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
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, paddingBottom: 60 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 25, textAlign: 'center' },
  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1 },
  languageText: { fontSize: 18 },
  closeModalBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeModalText: { fontSize: 16, fontWeight: '800' },
  passwordInput: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
});