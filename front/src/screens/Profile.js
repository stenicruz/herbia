import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image, Switch, Modal, StatusBar, TextInput, KeyboardAvoidingView, Alert, ActivityIndicator
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
  const [userData, setUserData] = useState(null);

  // ESTADOS PARA OS DADOS DO BACK-END
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS PARA EXCLUSÃO ---
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  // Validar a senha no Back-end
  const handleVerifyPassword = async () => {
  if (!password) {
    Alert.alert("Atenção", "Por favor, digite sua senha.");
    return;
  }

  try {
    setLoading(true);
    await authService.verificarSenha(password); // ✅ só passa a senha, não o email

    setPasswordModalVisible(false);
    setDeleteAccountModalVisible(true);

  } catch (err) {
    Alert.alert("Erro", err.error || "Senha incorreta. Tente novamente.");
    setPassword('');
  } finally {
    setLoading(false);
  }
};

  // Exclusão Real
const confirmDeleteAccount = async () => {
  try {
    setLoading(true);
    await userService.deleteConta(user.id, password);
    
    // ✅ Limpa os dados locais após apagar a conta
    await authService.logout();
    
    setDeleteAccountModalVisible(false);
    setPassword('');
    
    Alert.alert(
      "Conta excluída", 
      "Sentiremos a sua falta!",
      [{ 
        text: "OK", 
        onPress: () => navigation.reset({ 
          index: 0, 
          routes: [{ name: 'AccessMode' }] 
        })
      }]
    );
  } catch (error) {
    setDeleteAccountModalVisible(false);
    Alert.alert("Erro", error.message || "Erro ao excluir conta.");
  } finally {
    setLoading(false);
  }
};

  // Carregar dados ao entrar na tela
  useFocusEffect(
  React.useCallback(() => {
    let isMounted = true;

    const carregarPerfil = async () => {
      setLoading(true); // Começa sempre com loading ao entrar/focar
      try {
        // 1. Busca os dados básicos do storage (muito rápido)
        const storedUser = await AsyncStorage.getItem('@Herbia:user');
        
        if (storedUser && isMounted) {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.id === 'guest') {
            setUser(parsedUser);
            setLoading(false); // É convidado, não precisa de API
            return;
          }

          // 2. Se for usuário logado, tenta atualizar via API
          try {
            const freshData = await userService.getPerfil(parsedUser.id);
            setUser(freshData);
            await AsyncStorage.setItem('@Herbia:user', JSON.stringify(freshData));
          } catch (apiErr) {
            // Se a API falhar (sem net), usamos o que estava no storage
            setUser(parsedUser);
          }
        }
      } catch (err) {
        console.error("Erro no Profile:", err);
      } finally {
        if (isMounted) setLoading(false); // Só aqui a tela é "liberada"
      }
    };

    carregarPerfil();
    return () => { isMounted = false; };
  }, [])
);

  const checkUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@Herbia:user');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (err) {
      console.warn("Erro ao verificar perfil:", err);
    }
  };

  const showProfileAlert = userData && (
    !userData.perfil_user ||    // Estava perfil_agricola antes
    !userData.provincia         // Estava provincia_residencia antes
  );


const loadUserData = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('@Herbia:user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      
      // Chamada ao backend para pegar os dados REAIS e ATUAIS
      const perfilCompleto = await userService.getPerfil(parsed.id);
      
      // Sobrescreve o armazenamento local com a verdade do servidor
      await AsyncStorage.setItem('@Herbia:user', JSON.stringify(perfilCompleto));
      setUser(perfilCompleto);
      setUserData(perfilCompleto); // Atualiza o estado que controla o Card de Alerta
    }
  } catch (e) {
    console.warn("Erro ao sincronizar perfil:", e);
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

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: currentTheme.background, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color={activeColor} />
      </View>
    );
  }

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
          <Text style={[styles.userName, { color: currentTheme.textPrimary }]}>
            {isGuest 
              ? 'Olá, Convidado' 
              : (typeof user.nome === 'object' 
                  ? user.nome.nome 
                  : (typeof user.nome === 'string' && user.nome.startsWith('{')
                      ? JSON.parse(user.nome).nome 
                      : user.nome) || 'Utilizador'
                )
            }
          </Text>
          <Text style={[styles.userEmail, { color: isDarkMode ? '#888' : '#BBB' }]}>{isGuest ? 'criaconta@email.com' : user.email}</Text>
          
          {isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FFF0', borderColor: activeColor }]}>
              <Text style={[styles.adminBadgeText, { color: activeColor }]}>ADMINISTRADOR</Text>
            </View>
          )}
        </View>

      {showProfileAlert && (
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EditProfile')}
          style={[
            styles.alertCard, 
            { 
              backgroundColor: isDarkMode ? '#1e211d' : '#F9F9F9',
              borderColor: isDarkMode ? '#2d322c' : '#E0E0E0' 
            }
          ]}
        >
          <View style={styles.alertContent}>
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertTitle}>Perfil Incompleto</Text>
              <Text style={[styles.alertSubtitle, { color: currentTheme.textSecondary }]}>
                Adicione sua localização e categoria.
              </Text>
            </View>
            <ChevronRight color={"#e70d0d"} size={25} />
          </View>
          
          <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
        </TouchableOpacity>
      )}

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
                if (user?.auth_provider === 'google' && Number(user?.tem_senha) === 0) {
                  setDeleteAccountModalVisible(true);
                } else {
                  setPasswordModalVisible(true);
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
        loading={loading}
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
        loading={loading}
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
  alertCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  alertTextWrapper: {
    flex: 1,
    marginRight: 10
  },
  alertTitle: {
    fontWeight: '800',
    fontSize: 15,
    color: '#e70d0d', 
  },
  alertSubtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e70d0d',
    borderRadius: 2,
  },
});