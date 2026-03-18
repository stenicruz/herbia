import React, { useState } from 'react';
import { 
  StyleSheet, StatusBar, View, Text, TouchableOpacity, ScrollView, Alert, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Database, 
  Eye, 
  Gavel,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton, ConfirmationModal } from '../components/central.js';

const { width } = Dimensions.get('window');

export default function PrivacyPolicyScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;

  const isLogged = route.params?.isLogged ?? false;

  const confirmDeletion = () => {
    setModalVisible(false);
    console.log("Conta excluída");
  };
  
  const handleDeletePress = () => {
    if (!isLogged) {
      Alert.alert(
        "Acesso Negado",
        "Para excluir uma conta, você precisa primeiro estar autenticado no sistema.",
        [{ text: "Entendido", style: "cancel" }]
      );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
    
      {/* --- MODAL DE CONFIRMAÇÃO  --- */}
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmDeletion}
        title="Excluir Conta?"
        description="Esta ação é permanente. Todos os seus diagnósticos e dados de perfil serão apagados definitivamente."
        confirmText="Excluir"
        type="danger" // Geralmente modais de confirmação têm um tipo para mudar a cor do botão
      />


      {/* Header */}
      <AppHeader 
        title="Política de Privacidade" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Título Principal */}
        <Text style={[styles.mainTitle, { color: currentTheme.textPrimary }]}>
          Sua Privacidade Importa</Text>
        
        <Text style={[styles.introText, { color: currentTheme.textSecondary }]}>
          Na Herbia, estamos comprometidos em proteger seus dados pessoais e sermos transparentes sobre como os utilizamos. Esta política explica nossas práticas em relação às suas informações.
        </Text>

        {/* Seção 1: Informações Coletadas */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A2E17' : '#F0FBF0' }]}>
            <Database color={activeColor} size={22} />
          </View>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Informações Coletadas</Text>
        </View>
        
        <Text style={[styles.sectionDescription, { color: currentTheme.textSecondary }]}>
          Nós coletamos informações para prover a melhor experiência e serviços para todos os nossos usuários. Isto inclui:
        </Text>

        <View style={styles.bulletList}>
          {['Nome de Utilizador', 'Endereço de Email', 'Fotografia de Perfil', 'Imagens de Plantas Enviadas', 'Histórico de Análises realizadas'].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <CheckCircle2 color={activeColor} size={18} />
              <Text style={[styles.bulletText, { color: currentTheme.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Seção 2: Uso das Informações */}
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

        {/* Seção 3: Seus Direitos */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1A2E17' : '#F0FBF0' }]}>
            <Gavel color={activeColor} size={22} />
          </View>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Seus Direitos</Text>
        </View>
        
        <Text style={[styles.sectionDescription, { color: currentTheme.textSecondary, marginBottom: 25 }]}>
          Você tem total controle sobre seus dados pessoais, você pode:
        </Text>

        {/* Botão Deletar Conta*/}
        <PrimaryButton 
          title="Deletar Conta"
          variant='outline'
          gap={160}
          icon={ChevronRight}
          iconSize={25}
          textStyle={{color: isDarkMode ? THEME.dark.textPrimary : '#383737', 
            fontWeight: '600', marginLeft: 10}}
          onPress={handleDeletePress}
          style={{ flex: 1, height: 60, marginBottom: 50, borderWidth: 0.5 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  mainTitle: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 15 
  },
  introText: { 
    fontSize: 14, 
    lineHeight: 22, 
    textAlign: 'start', 
    marginBottom: 30,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    marginTop: 10 
  },
  iconCircle: { 
    width: 41, 
    height: 41, 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionDescription: { 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 15 
  },

  bulletList: { marginBottom: 20 },
  bulletItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    paddingLeft: 5 
  },
  bulletText: { 
    fontSize: 14, 
    marginLeft: 12, 
    fontWeight: '500' 
  },

  deleteBtnCustom: {
    height: 65,
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
});