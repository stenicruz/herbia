import React, { useState } from 'react';
import { 
  StyleSheet, StatusBar, View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  Database, 
  Eye, 
  Gavel,
  CheckCircle2,
  ChevronLeft,
  AlertCircle, // Ícone para o modal
  ArrowRight
} from 'lucide-react-native';

import { AppHeader, PrimaryButton, ConfirmationModal }  from '../components/central.js';

export default function PrivacyPolicyScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false); // Estado do modal
  const activeColor = '#47e426';

  // 1. Pegamos o isLogged dos parâmetros da rota (ou false por padrão)
  const isLogged = route.params?.isLogged ?? false;

  const confirmDeletion = () => {
    setModalVisible(false);
    console.log("Conta excluída com sucesso");
    // Futura lógica de API aqui
  };
  
  // 2. Definimos a função de clique AQUI DENTRO
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
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
    
      {/* --- MODAL DE CONFIRMAÇÃO  --- */}
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmDeletion}
        title="Excluir Conta?"
        message="Esta ação é permanente. Todos os seus diagnósticos e dados de perfil serão apagados definitivamente."
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
        <Text style={styles.mainTitle}>Sua Privacidade Importa</Text>
        
        <Text style={styles.introText}>
          Na Herbia, estamos comprometidos em proteger seus dados pessoais e sermos transparentes sobre como os utilizamos. Esta política explica nossas práticas em relação às suas informações.
        </Text>

        {/* Seção 1: Informações Coletadas */}
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Database color={activeColor} size={22} />
          </View>
          <Text style={styles.sectionTitle}>Informações Coletadas</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Nós coletamos informações para prover a melhor experiência e serviços para todos os nossos usuários. Isto inclui:
        </Text>

        <View style={styles.bulletList}>
          {['Nome de Utilizador', 'Endereço de Email', 'Fotografia de Perfil', 'Imagens de Plantas Enviadas', 'Histórico de Análises realizadas'].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <CheckCircle2 color={activeColor} size={18} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Seção 2: Uso das Informações */}
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Eye color={activeColor} size={22} />
          </View>
          <Text style={styles.sectionTitle}>Uso das Informações</Text>
        </View>

        <View style={styles.bulletList}>
          {[
            'Permitir o registro e autenticação de utilizadores',
            'Realizar Análise de imagens de Plantas',
            'Melhorar o funcionamento e a experiência de uso do aplicativo'
          ].map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <CheckCircle2 color={activeColor} size={18} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Seção 3: Seus Direitos */}
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Gavel color={activeColor} size={22} />
          </View>
          <Text style={styles.sectionTitle}>Seus Direitos</Text>
        </View>
        
        <Text style={styles.sectionDescription}>
          Você tem total controle sobre seus dados pessoais, você pode:
        </Text>

        {/* Botão Deletar Conta*/}
        <PrimaryButton 
          title="Deletar Conta"
          variant='outline'
          gap={160}
          icon={ChevronRight}
          iconSize={25}
          textStyle={{color: '#383737', fontWeight: 600, marginLeft: 10}}
          onPress={handleDeletePress}
          style={{ flex: 1, height: 60, marginBottom: 50, borderWidth: 0.5 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    paddingTop: 25 
  },
  backBtn: { padding: 5 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    marginLeft: 10 
  },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },

  mainTitle: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#000', 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 20 
  },
  introText: { 
    fontSize: 14, 
    color: '#666', 
    lineHeight: 20, 
    textAlign: 'left', 
    marginBottom: 30 
  },

  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15, 
    marginTop: 10 
  },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F0FBF0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919' },
  
  sectionDescription: { 
    fontSize: 14, 
    color: '#666', 
    lineHeight: 20, 
    marginBottom: 15 
  },

  bulletList: { marginBottom: 25 },
  bulletItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    paddingLeft: 5 
  },
  bulletText: { 
    fontSize: 14, 
    color: '#444', 
    marginLeft: 12, 
    fontWeight: '500' 
  },

  deleteButton: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EBF9E8', 
    borderRadius: 15, 
    padding: 18, 
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#FFF'
  },
  deleteButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1B1919' 
  },

  // --- ESTILOS DO MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 10
  },
  warningIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1919',
    marginBottom: 10
  },
  modalSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  btnCancel: {
    backgroundColor: '#F5F5F5',
    marginRight: 10
  },
  btnConfirm: {
    backgroundColor: '#FF4444'
  },
  textCancel: {
    color: '#666',
    fontWeight: '700'
  },
  textConfirm: {
    color: '#FFF',
    fontWeight: '700'
  }
});