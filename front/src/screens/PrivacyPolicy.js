import { 
  StyleSheet, StatusBar, View, Text, TouchableOpacity, 
  ScrollView, Alert, Dimensions, Modal, TextInput, 
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Database, Eye, Gavel, CheckCircle2, ChevronRight
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton, ConfirmationModal } from '../components/central.js';
import authService from '../services/authService';
import userService from '../services/userService';

const { width } = Dimensions.get('window');

export default function PrivacyPolicyScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modais
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  // Carrega o utilizador do AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('@Herbia:user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);

          // Busca tem_senha actualizado do backend
          try {
            const perfil = await userService.getPerfil(parsed.id);
            const actualizado = { ...parsed, tem_senha: perfil.tem_senha };
            await AsyncStorage.setItem('@Herbia:user', JSON.stringify(actualizado));
            setUser(actualizado);
          } catch (e) {
            console.warn("Não foi possível actualizar tem_senha:", e);
          }
        }
      } catch (e) {
        console.warn("Erro ao carregar utilizador:", e);
      }
    };
    loadUser();
  }, []);

  // Clique no botão "Deletar Conta"
  const handleDeletePress = () => {
    if (!user) {
      Alert.alert(
        "Acesso Negado",
        "Para excluir uma conta, precisa estar autenticado.",
        [{ text: "Entendido" }]
      );
      return;
    }

    // Se tem senha definida → pede senha primeiro
    if (Number(user.tem_senha) === 1) {
      setPasswordModalVisible(true);
    } else {
      // Google sem senha → vai directo para confirmação
      setConfirmModalVisible(true);
    }
  };

  // Verificar senha antes de mostrar confirmação
  const handleVerifyPassword = async () => {
    if (!password) {
      Alert.alert("Atenção", "Por favor, digite a sua senha.");
      return;
    }

    try {
      setLoading(true);
      await authService.verificarSenha(password);

      // Senha correcta — avança para confirmação
      setPasswordModalVisible(false);
      setConfirmModalVisible(true);
    } catch (err) {
      Alert.alert("Erro", err.error || "Senha incorreta. Tente novamente.");
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Confirmar exclusão
const confirmDeletion = async () => {
  try {
    setLoading(true);
    await userService.deleteConta(user.id, password);

    // ✅ Usa o authService.logout que já trata tudo:
    // — limpa o AsyncStorage
    // — faz revokeAccess e signOut do Google se necessário
    await authService.logout();

    setConfirmModalVisible(false);
    setPassword('');

    Alert.alert(
      "Conta Excluída",
      "Os seus dados foram removidos com sucesso.",
      [{
        text: "OK",
        onPress: () => navigation.reset({
          index: 0,
          routes: [{ name: 'AccessMode' }]
        })
      }]
    );
  } catch (error) {
    setConfirmModalVisible(false);
    Alert.alert("Erro", error.message || "Não foi possível excluir a conta.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.background}
      />

      <AppHeader title="Política de Privacidade" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Text style={[styles.mainTitle, { color: currentTheme.textPrimary }]}>
          Sua Privacidade Importa
        </Text>

        <Text style={[styles.introText, { color: currentTheme.textSecondary }]}>
          Na Herbia, estamos comprometidos em proteger seus dados pessoais e sermos transparentes sobre como os utilizamos.
        </Text>

        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A2E17' : '#F0FBF0' }]}>
            <Database color={activeColor} size={22} />
          </View>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Informações Coletadas</Text>
        </View>

        <Text style={[styles.sectionDescription, { color: currentTheme.textSecondary }]}>
          Nós coletamos informações para prover a melhor experiência para todos os nossos usuários:
        </Text>

        <View style={styles.bulletList}>
          {['Nome de Utilizador', 'Endereço de Email', 'Fotografia de Perfil', 'Imagens de Plantas Enviadas', 'Histórico de Análises realizadas'].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <CheckCircle2 color={activeColor} size={18} />
              <Text style={[styles.bulletText, { color: currentTheme.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A2E17' : '#F0FBF0' }]}>
            <Eye color={activeColor} size={22} />
          </View>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Uso das Informações</Text>
        </View>

        <View style={styles.bulletList}>
          {[
            'Permitir o registro e autenticação de utilizadores',
            'Realizar Análise de imagens de Plantas',
            'Melhorar o funcionamento e a experiência de uso do aplicativo'
          ].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <CheckCircle2 color={activeColor} size={18} />
              <Text style={[styles.bulletText, { color: currentTheme.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A2E17' : '#F0FBF0' }]}>
            <Gavel color={activeColor} size={22} />
          </View>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Seus Direitos</Text>
        </View>

        <Text style={[styles.sectionDescription, { color: currentTheme.textSecondary, marginBottom: 25 }]}>
          Você tem total controle sobre seus dados pessoais:
        </Text>

        <PrimaryButton
          title="Deletar Conta"
          variant='outline'
          gap={160}
          icon={ChevronRight}
          iconSize={25}
          textStyle={{ color: isDarkMode ? THEME.dark.textPrimary : '#383737', fontWeight: '600', marginLeft: 10 }}
          onPress={handleDeletePress}
          style={{ flex: 1, height: 60, marginBottom: 50, borderWidth: 0.5 }}
        />

      </ScrollView>

      {/* MODAL DE SENHA */}
      <Modal animationType="fade" transparent visible={passwordModalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: currentTheme.background }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.textPrimary }]}>
                Confirme a sua Senha
              </Text>
              <Text style={{ color: isDarkMode ? '#888' : '#666', textAlign: 'center', marginBottom: 20 }}>
                Para sua segurança, confirme a sua senha antes de continuar.
              </Text>

              <TextInput
                style={[styles.passwordInput, {
                  backgroundColor: isDarkMode ? '#1A1D19' : '#F5F5F5',
                  color: currentTheme.textPrimary,
                  borderColor: isDarkMode ? '#333' : '#DDD'
                }]}
                placeholder="A sua senha"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {loading ? (
                <ActivityIndicator size="large" color={activeColor} style={{ marginVertical: 10 }} />
              ) : (
                <PrimaryButton title="Continuar" onPress={handleVerifyPassword} />
              )}

              <TouchableOpacity
                style={{ marginTop: 15, alignItems: 'center' }}
                onPress={() => { setPasswordModalVisible(false); setPassword(''); }}
              >
                <Text style={{ color: THEME.error, fontWeight: '700', fontSize: 15 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO */}
      <ConfirmationModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onConfirm={confirmDeletion}
        title="Tem a certeza?"
        description="Esta acção é permanente. Todos os seus dados serão apagados definitivamente."
        confirmText="Sim, excluir tudo"
        variant="danger"
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  mainTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 15 },
  introText: { fontSize: 14, lineHeight: 22, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  iconCircle: { width: 41, height: 41, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionDescription: { fontSize: 14, lineHeight: 20, marginBottom: 15 },
  bulletList: { marginBottom: 20 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingLeft: 5 },
  bulletText: { fontSize: 14, marginLeft: 12, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 30, paddingBottom: 380 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  passwordInput: { width: '100%', height: 55, borderRadius: 15, borderWidth: 1, paddingHorizontal: 20, marginBottom: 20, fontSize: 16 },
});