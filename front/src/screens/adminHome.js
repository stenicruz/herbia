import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Search, UserMinus, UserPlus, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react-native';

// Importando componentes centrais
import { AppHeader } from '../components/central.js';

const ACTIVE_GREEN = '#47e426'; 

const LAST_ANALYSES = [
  { id: '1', plant: 'Tomateiro', user: 'João Silva', date: '05/03/2025', status: 'success' },
  { id: '2', plant: 'Milho', user: 'João Silva', date: '05/07/2025', status: 'error' },
  { id: '3', plant: 'Mandioca', user: 'João Silva', date: '08/07/2025', status: 'success' },
  { id: '4', plant: 'Tomateiro', user: 'João Silva', date: '05/02/2025', status: 'error' },
  { id: '5', plant: 'Tomateiro', user: 'João Silva', date: '09/09/2025', status: 'success' }
];

export default function AdminDashboardScreen({ navigation }) {
  
  const renderAnalysisItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.analysisCard}
      onPress={() => navigation.navigate('DiagnosticResult', { item, isAdminView: true })}
    >
      <View style={styles.plantImagePlaceholder}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=100' }} 
          style={styles.thumbImage} 
        />
      </View>
      <View style={styles.analysisInfo}>
        <View style={styles.analysisHeaderRow}>
          <Text style={styles.plantTitle}>{item.plant}</Text>
          {item.status === 'success' ? (
            <CheckCircle2 color={ACTIVE_GREEN} size={18} />
          ) : (
            <XCircle color="#FF4444" size={18} />
          )}
        </View>
        <Text style={styles.userText}>Usuário: {item.user}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <ChevronRight color="#CCC" size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <AppHeader title="Painel Admin" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Card Verde */}
        <TouchableOpacity 
          style={styles.cardVerde}
          onPress={() => navigation.navigate('AdminTips')} // Certifique-se de registrar este nome nas rotas
          activeOpacity={0.8}
        >
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Gerenciar Dicas</Text>
            <Text style={styles.cardSubtitle}>
              Edite as dicas que aparecem para os usuários na Home.
            </Text>
          </View>
          {/* Opcional: Um ícone de seta ou edição para indicar que é clicável */}
          <View style={{ justifyContent: 'center' }}>
            <ChevronRight color="#FFF" size={24} />
          </View>
        </TouchableOpacity>

        {/* ÚNICA LINHA DE STATS */}
        {/* ÚNICA LINHA DE STATS UNIFICADA */}
        <View style={styles.statsRow}>
          
          {/* USUÁRIOS - PADRÃO OUTLINE */}
          <TouchableOpacity 
            style={[styles.statBox, styles.statBoxOutline]}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <User color={ACTIVE_GREEN} size={20} />
            <Text style={styles.statValue}>50</Text>
            <Text style={styles.statLabel}>Usuários</Text>
          </TouchableOpacity>

          {/* ANÁLISES - PADRÃO SÓLIDO */}
          <TouchableOpacity 
            style={[styles.statBox, styles.statBoxSolid]}
            onPress={() => navigation.navigate('AllAnalyses')}
          >
            <Search color={ACTIVE_GREEN} size={20} />
            <Text style={[styles.statValue, { color: ACTIVE_GREEN }]}>300</Text>
            <Text style={[styles.statLabel, { color: ACTIVE_GREEN }]}>Análises</Text>
          </TouchableOpacity>

          {/* OFF - PADRÃO OUTLINE (Igual Usuários) */}
          <View style={[styles.statBox, styles.statBoxOutline]}>
            <UserMinus color={ACTIVE_GREEN} size={20} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Off</Text>
          </View>

          {/* ON - PADRÃO SÓLIDO (Igual Análises) */}
          <View style={[styles.statBox, styles.statBoxSolid]}>
            <UserPlus color={ACTIVE_GREEN} size={20} />
            <Text style={[styles.statValue, { color: ACTIVE_GREEN }]}>38</Text>
            <Text style={[styles.statLabel, { color: ACTIVE_GREEN }]}>On</Text>
          </View>

        </View>
        
        <Text style={styles.sectionTitle}>Análises Recentes</Text>

        {/* Lista de análises usando map (mais performático que FlatList dentro de ScrollView) */}
        {LAST_ANALYSES.map(item => renderAnalysisItem(item))}

        {/* Botão Ver Todas */}
        <TouchableOpacity 
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate('AllAnalyses')}
        >
          <Text style={styles.viewAllBtnText}>Ver todo o histórico</Text>
          <ChevronRight color={ACTIVE_GREEN} size={23} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 110 },
  
  // Estilos do Card Verde
  cardVerde: {
    backgroundColor: '#47e426',
    marginHorizontal: 0,
    borderRadius: 22,
    padding: 22,
    height: 100,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
    marginBottom:25
  },
  cardTextContent: { flex: 1, zIndex: 2, justifyContent: 'center' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: '#FFF', fontSize: 14, marginTop: 6, width: '85%', lineHeight: 18, fontWeight: '500' },
  
  cardIconsContainer: { position: 'absolute', right: 0, top: 10, height: '100%'},
  cardIconBell: { transform: [{ rotate: '15deg' }] },
 // AJUSTE DA LINHA ÚNICA
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', // Distribui os cards igualmente
    width: '100%',
    marginBottom: 10 
  },
  statBox: { 
    width: '23%', // Largura para caber os 4 na mesma linha
    height: 90, 
    borderRadius: 18, 
    padding: 10,
    alignItems: 'center', // Centraliza conteúdo horizontalmente
    justifyContent: 'center' // Centraliza conteúdo verticalmente
  },
  statBoxOutline: { borderWidth: 1, borderColor: ACTIVE_GREEN },
  statBoxSolid: { backgroundColor: '#e6f8e3' },
  
  statValue: { fontSize: 18, fontWeight: '800', color: ACTIVE_GREEN, marginTop: 6 },
  statLabel: { fontSize: 9, fontWeight: '700', color: ACTIVE_GREEN, textTransform: 'uppercase', textAlign: 'center', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 15 },
  analysisCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#F2F2F2',
    alignItems: 'center'
  },
  plantImagePlaceholder: { width: 55, height: 55, borderRadius: 12, backgroundColor: '#F5F5F5', overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  analysisInfo: { flex: 1, marginLeft: 15 },
  analysisHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plantTitle: { fontSize: 15, fontWeight: '700', color: '#1B1919', marginBottom: 2 },
  userText: { fontSize: 13, color: '#666', marginBottom: 4 },
  dateText: { fontSize: 12, color: '#BBB' },

  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 15,
    marginTop: 5,
    gap: 15,
    marginBottom: 40
  },
  viewAllBtnText: { color: ACTIVE_GREEN, fontWeight: '700', fontSize: 15 }
});