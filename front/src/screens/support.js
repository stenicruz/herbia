import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronRight, 
  ChevronLeft,
  Camera, 
  Share2, 
  Mail, 
  Home, 
  History, 
  User,
  Info
} from 'lucide-react-native';

export default function SupportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header com Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#1B1919" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 140 }}
      >
        {/* Cards de Dúvidas Frequentes */}
        <TouchableOpacity style={styles.supportCard}>
          <View style={styles.iconCircle}>
            <Camera color={activeColor} size={24} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Como tirar uma Foto</Text>
            <Text style={styles.cardSub}>Dicas para obter a melhor imagem</Text>
          </View>
          <ChevronRight color="#666" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportCard}>
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
        
        <View style={styles.emailContainer}>
          <View style={styles.emailIconBox}>
            <Mail color="#FFF" size={32} />
          </View>
          <Text style={styles.emailTitle}>Enviar Email</Text>
          <Text style={styles.emailSub}>Respondemos em até 24 horas úteis</Text>
        </View>

        {/* Links de Documentos */}
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Termos de uso</Text>
            <ChevronRight color="#1B1919" size={20} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Política de Privacidade</Text>
            <ChevronRight color="#1B1919" size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Herbia v1.0.5</Text>
      </ScrollView>

      {/* MENU INFERIOR (Ativo em Perfil ou neutro, conforme sua navegação) */}
      <View style={[
        styles.tabBar, 
        { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
      ]}>
        <TouchableOpacity style={styles.tabItem}>
          <Home color="#999" size={26} />
          <Text style={styles.tabLabel}>Casa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <History color="#999" size={26} />
          <Text style={styles.tabLabel}>Histórico</Text>
        </TouchableOpacity>
        <View style={styles.cameraTabWrapper}>
          <TouchableOpacity style={styles.cameraTabBtn}>
            <Camera color="#47e426" size={47} fill="#fff" />
          </TouchableOpacity>
          <Text style={styles.tabLabel}>Câmera</Text>
        </View>
        <TouchableOpacity style={styles.tabItem}>
          <User color="#999" size={26} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 18, 
    paddingVertical: 30 
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1B1919' },

  supportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E8F9E4', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 15 
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
    marginVertical: 35, 
    fontSize: 14, 
    fontWeight: '500' 
  },

  // TabBar
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-around', position: 'absolute', bottom: 0, width: '100%', paddingTop: 12 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 4, fontWeight: '600', color: '#999'},
  cameraTabWrapper: { alignItems: 'center', marginTop: -40 },
  cameraTabBtn: { backgroundColor: '#47e426', width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: '#a5ef95', elevation: 8 }
});