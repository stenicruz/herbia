import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, Mail, Lock, ShieldCheck, Leaf } from 'lucide-react-native';
import { locations } from '../constants/angolaData';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton, CustomInput } from '../components/central';
import userService from '../services/userService';
import { useFocusEffect } from '@react-navigation/native';

export default function EditProfileScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  const OPCOES_PERFIL = ['Agricultor', 'Estudante', 'Técnico Agrícola', 'Outro'];
  // Estados dos dados
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Novos Estados para Perfil e Localização
  const [perfilAgricola, setPerfilAgricola] = useState('');
  const [provincia, setProvincia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [municipiosDisponiveis, setMunicipiosDisponiveis] = useState([]);

  // Estados dos inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  
  // Estados de senha
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // 1. Carregar dados iniciais
  useFocusEffect(
      React.useCallback(() => {
        loadUserData();
      }, [])
    );

  const handleProvinciaChange = (nomeProvincia) => {
    // Se clicar na mesma província que já está selecionada, desmarca tudo
    if (provincia === nomeProvincia) {
      setProvincia('');
      setMunicipiosDisponiveis([]);
      setMunicipio('');
    } else {
      // Se for uma nova, seleciona e carrega os municípios
      setProvincia(nomeProvincia);
      const dados = locations.find(p => p.provincia === nomeProvincia);
      setMunicipiosDisponiveis(dados ? dados.municipios : []);
      setMunicipio(''); 
    }
  };

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@Herbia:user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // --- FUNÇÃO AUXILIAR PARA LIMPAR JSON ---
        const extrairTexto = (campo) => {
          if (!campo) return '';
          if (typeof campo === 'object') return campo.nome || '';
          if (typeof campo === 'string' && campo.startsWith('{')) {
            try {
              return JSON.parse(campo).nome || '';
            } catch (e) {
              return campo;
            }
          }
          return campo;
        };

        // Aplicar a limpeza ao definir os estados iniciais
        setName(extrairTexto(parsedUser.nome));
        setEmail(parsedUser.email);
        setAvatar(parsedUser.foto_perfil || 'https://via.placeholder.com/150');
        
        // Limpeza para os novos campos de localização e perfil
        setPerfilAgricola(extrairTexto(parsedUser.perfil_user));
        setProvincia(extrairTexto(parsedUser.provincia));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do utilizador:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lógica de Upload de Foto
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setAvatar(image.uri);
      
      try {
        setSaving(true);
        const fileName = image.fileName || `foto_${user.id}_${Date.now()}.jpg`;
        const mimeType = image.mimeType || 'image/jpeg';
        const response = await userService.atualizarFoto(user.id, image.uri, fileName, mimeType);
        
        // Atualiza o user localmente para refletir a nova foto
        const updatedUser = { ...user, foto_perfil: response.foto_url };
        await AsyncStorage.setItem('@Herbia:user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (error) {
        Alert.alert("Erro", error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  // 3. Lógica de Salvar Alterações (Nome e Senha)
const handleSave = async () => {
  try {
    setSaving(true);
    
    // 1. Criamos uma cópia profunda para atualizar o Storage e o Estado
    let userParaAtualizar = { ...user };
    let mudouAlgo = false;

    // A. Atualizar Nome (se mudou e não for apenas espaços em branco)
    if (name.trim() !== user.nome || 
    perfilAgricola !== user.perfil_user || 
    provincia !== user.provincia) {
        
        // Use a função atualizada do service passando o objeto completo
        await userService.atualizarPerfil(user.id, {
          nome: name.trim(),
          perfil_user: perfilAgricola, // Nome correto da coluna na BD
          provincia: provincia         // Nome correto da coluna na BD
        });

        userParaAtualizar.nome = name.trim();
        userParaAtualizar.perfil_user = perfilAgricola;
        userParaAtualizar.provincia = provincia;
        mudouAlgo = true;
    }

    // B. Lógica de Alteração de Senha
    if (newPass) {
      // Validação: Senhas digitadas coincidem?
      if (newPass !== confirmPass) {
        Alert.alert("Erro", "As novas senhas não coincidem.");
        setSaving(false);
        return;
      }

      // Validação: Comprimento mínimo
      if (newPass.length < 6) {
        Alert.alert("Erro", "A nova senha deve ter pelo menos 6 caracteres.");
        setSaving(false);
        return;
      }

      if (perfilAgricola !== user.perfil_user || provincia !== user.provincia) {
        // Chamada ao seu service (certifique-se de criar este método no userService)
        await userService.atualizarNome(user.id, {
          perfil_user: perfilAgricola,
          provincia: provincia
        });

        userParaAtualizar.perfil_user = perfilAgricola;
        userParaAtualizar.provincia = provincia
        mudouAlgo = true;
      }
      // Regra de Segurança: Exigir senha atual se for conta LOCAL ou GOOGLE com senha já definida
      const exigeSenhaAtual = user.auth_provider === 'local' || user.tem_senha === 1;
      
      if (exigeSenhaAtual && !currentPass) {
        Alert.alert("Erro", "Para sua segurança, digite a senha atual para confirmar a alteração.");
        setSaving(false);
        return;
      }

      // Chamada ao Back-end
      await userService.alterarSenha(user.id, currentPass, newPass);
      
      // CRUCIAL: Agora marcamos que o usuário possui uma senha definida
      userParaAtualizar.tem_senha = 1;
      mudouAlgo = true;
      
      // Limpar campos de input para evitar reenvios acidentais
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }

    // C. Persistência dos Dados e Feedback ao Utilizador
    if (mudouAlgo) {
      // Atualiza o disco (AsyncStorage)
      await AsyncStorage.setItem('@Herbia:user', JSON.stringify(userParaAtualizar));
      
      // Atualiza o estado da tela (React State)
      setUser(userParaAtualizar); 
      
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      // Se clicou em salvar mas não alterou nome nem digitou nova senha
      Alert.alert("Info", "Nenhuma alteração foi detectada.");
      navigation.goBack();
    }

  } catch (error) {
    console.warn("Erro ao salvar perfil:", error);
    
    // Captura a mensagem específica vinda do Back-end (Ex: "Senha atual incorreta")
    const msgErro = error.response?.data?.error || error.message || "Ocorreu um erro ao salvar as alterações.";
    Alert.alert("Erro", msgErro);
  } finally {
    setSaving(false);
  }
};

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} disabled={saving}>
              <View style={[styles.avatarContainer, { borderColor: activeColor }]}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={[styles.cameraOverlay, { backgroundColor: activeColor, borderColor: currentTheme.background }]}>
                  <Camera color="#FFF" size={18} />
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
              icon={User}
              darkMode={isDarkMode}
            />

            <CustomInput 
              label="E-mail (Não editável)"
              value={email}
              icon={Mail}
              darkMode={isDarkMode}
              editable={false} // <--- BLOQUEADO
              style={{ opacity: 0.6 }} // Visual de desabilitado
            />
          </View>

          {/* Seção de Perfil Profissional e Localização */}
          <View style={[styles.passwordSection, { marginTop: 20 }]}>
            <View style={styles.sectionTitleRow}>
              <Leaf color={activeColor} size={22} />
              <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
                Informações Agrícolas
              </Text>
            </View>

            <View style={[styles.passwordCard, { 
              backgroundColor: isDarkMode ? '#121411' : '#FFF', 
              borderColor: isDarkMode ? '#222' : '#F0F0F0' 
            }]}>
              
              {/* Seleção de Tipo de Usuário */}
              <Text style={styles.labelSelect}>Tipo de Usuário</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                {OPCOES_PERFIL.map((tipo) => (
                  <TouchableOpacity 
                    key={tipo}
                    onPress={() => setPerfilAgricola(tipo)}
                    style={[
                      styles.chip,
                      { backgroundColor: perfilAgricola === tipo ? activeColor : (isDarkMode ? '#222' : '#E8E8E8') }
                    ]}
                  >
                    <Text style={{ color: perfilAgricola === tipo ? '#FFF' : currentTheme.textPrimary, fontSize: 13 }}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Seleção de Província */}
              <Text style={[styles.labelSelect, { marginTop: 15 }]}>Província de Residência</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                {locations.map((item) => (
                  <TouchableOpacity 
                    key={item.provincia}
                    onPress={() => setProvincia(item.provincia)}
                    style={[
                      styles.chip,
                      { backgroundColor: provincia === item.provincia ? activeColor : (isDarkMode ? '#222' : '#E8E8E8') }
                    ]}
                  >
                    <Text style={{ color: provincia === item.provincia ? '#FFF' : currentTheme.textPrimary, fontSize: 13 }}>
                      {item.provincia}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.passwordSection}>
            <View style={styles.sectionTitleRow}>
              <ShieldCheck color={activeColor} size={22} />
              <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
                {user?.auth_provider === 'google' ? 'Criar uma Senha' : 'Segurança da Conta'}
              </Text>
            </View>

            <View style={[styles.passwordCard, { 
              backgroundColor: isDarkMode ? '#121411' : '#FFF', 
              borderColor: isDarkMode ? '#222' : '#F0F0F0' 
            }]}>
              
              {/* Só mostra se o usuário existir E não for Google */}
              {user && (user.auth_provider === 'local' || user.tem_senha === 1) && (
                <CustomInput 
                  label="Palavra-Passe Atual"
                  placeholder="**********"
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  isPassword={true}
                  icon={Lock}
                  darkMode={isDarkMode}
                />
              )}

              <CustomInput 
                label={user?.auth_provider === 'local' ? "Nova Palavra-passe" : "Criar Nova Senha"}
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
              title={saving ? "A processar..." : "Salvar Alterações"} 
              onPress={handleSave} 
              disabled={saving}
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
  avatarContainer: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, padding: 5, position: 'relative' },
  avatar: { width: '100%', height: '100%', borderRadius: 60 },
  cameraOverlay: { position: 'absolute', bottom: 5, right: 5, width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', borderWidth: 3, elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3 },
  passwordSection: { marginTop: 35 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginLeft: 10, letterSpacing: 0.3 },
  passwordCard: { borderWidth: 1, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, elevation: 1 },
  labelSelect: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    color: THEME.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  selectDisplay: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});