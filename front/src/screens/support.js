import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Linking
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight,
  Camera, 
  Share2, 
  Mail, 
  Home, 
  History, 
  User
} from 'lucide-react-native';


import { AppHeader } from '../components/central';

export default function SupportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';

  // Função para abrir o email nativo
  const handleEmailSupport = () => {
    Linking.openURL('mailto:suporte@herbia.com?subject=Ajuda com o App');
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header com Voltar */}
      <AppHeader title="Ajuda e Suporte" onBack={() => navigation.goBack()} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 80 }}
      >
        {/* Cards de Dúvidas Frequentes */}
        <TouchableOpacity style={styles.supportCard} onPress={() => navigation.navigate('PhotoSupport')}>
          <View style={styles.iconCircle}>
            <Camera color={activeColor} size={24} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Como tirar uma Foto</Text>
            <Text style={styles.cardSub}>Dicas para obter a melhor imagem</Text>
          </View>
          <ChevronRight color="#666" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportCard} onPress={() => navigation.navigate('DiagnosticSupport')}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F9E4' }]}>
            <Share2 color={activeColor} size={24} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Entendendo Resultados</Text>
            <Text style={styles.cardSub}>Como interpretar as análises</Text>
          </View>
          <ChevronRight color="#666" size={20} />
        </TouchableOpacity>

        {/* Seção Fale Conosco */}
        <Text style={styles.sectionLabel}>Fale Conosco</Text>
        
        <TouchableOpacity 
          style={styles.emailContainer} 
          onPress={handleEmailSupport}
          activeOpacity={0.7}
        >
          <View style={styles.emailIconBox}>
            <Mail color="#FFF" size={32} />
          </View>
          <Text style={styles.emailTitle}>Enviar Email</Text>
          <Text style={styles.emailSub}>Respondemos em até 24 horas úteis</Text>
        </TouchableOpacity>

        {/* Links de Documentos */}
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('TermsOfUse')}>
            <Text style={styles.linkText}>Termos de uso</Text>
            <ChevronRight color="#1B1919" size={20} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('PrivacyPolicy', { isLogged: true })}>
            <Text style={styles.linkText}>Política de Privacidade</Text>
            <ChevronRight color="#1B1919" size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Herbia v1.0.5</Text>
      </ScrollView>

      {/* MENU INFERIOR (Ativo em Perfil ou neutro, conforme sua navegação) */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  supportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E8F9E4', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 15,
    marginTop: 15
  },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#F2FBF0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  cardSub: { fontSize: 13, color: '#999', marginTop: 2 },

  sectionLabel: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1B1919', 
    marginTop: 20, 
    marginBottom: 15 
  },
  
  emailContainer: { 
    backgroundColor: '#ebf7e8', // Verde claro pontilhado no design
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#47e426', 
    borderStyle: 'dashed' 
  },
  emailIconBox: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#47e426', 
    justifyContent: 'center',
    alignItems: 'center', 
    marginBottom: 10 
  },
  emailTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919' },
  emailSub: { fontSize: 12, color: '#333', marginTop: 5 },

  linksContainer: { 
    marginTop: 30, 
    borderWidth: 1, 
    borderColor: '#E8F9E4', 
    borderRadius: 20, 
    paddingHorizontal: 20 
  },
  linkRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 18 
  },
  linkText: { fontSize: 16, fontWeight: '600', color: '#1B1919' },
  divider: { height: 1, backgroundColor: '#E8F9E4' },

  versionText: { 
    textAlign: 'center', 
    color: '#BBB', 
    marginTop: 35, 
    fontSize: 14, 
    fontWeight: '500' 
  },

 });