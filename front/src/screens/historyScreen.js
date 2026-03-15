import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Image 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronDown, 
  Trash2, 
  Home, 
  History as HistoryIcon, 
  Camera, 
  User 
} from 'lucide-react-native';

// Dados fictícios para a lista
const HISTORICO_DATA = [
  { id: '1', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '2', planta: 'Arroz', status: 'Oídio', data: '05/07/2025', corStatus: '#E74C3C' },
  { id: '3', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '4', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '5', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '6', planta: 'Arroz', status: 'Oídio', data: '05/07/2025', corStatus: '#E74C3C' },
  { id: '7', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' }
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      {/* Header Centralizado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Data</Text>
          <ChevronDown color="#999" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.filterButton, { backgroundColor: '#47e426', borderColor: '#47e426' }]}>
          <Text style={[styles.filterText, { color: '#FFF' }]}>Planta</Text>
          <ChevronDown color="#FFF" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Status</Text>
          <ChevronDown color="#999" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20 }}
      >
        {HISTORICO_DATA.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardInfo}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.textGroup}>
                <Text style={styles.plantaNome}>{item.planta}</Text>
                <Text style={[styles.plantaStatus, { color: item.corStatus }]}>{item.status}</Text>
                <Text style={styles.plantaData}>{item.data}</Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.deleteBtn}>
                <Trash2 color="#C0392B" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MENU INFERIOR (Copiado da Home para consistência) */}
      <View style={[
        styles.tabBar, 
        { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
      ]}>
        <TouchableOpacity style={styles.tabItem}>
          <Home color="#999" size={26} />
          <Text style={styles.tabLabel}>Casa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <HistoryIcon color={activeColor} size={26} />
          <Text style={[styles.tabLabel, { color: activeColor }]}>Histórico</Text>
        </TouchableOpacity>

        <View style={styles.cameraTabWrapper}>
            <TouchableOpacity style={styles.cameraTabBtn}><Camera color="#47e426" size={47} fill="#fff" /></TouchableOpacity>
            <Text style={styles.tabLabel}>Câmera</Text>
        </View>

        <TouchableOpacity style={styles.tabItem}>
          <User color="#999" size={26} fill="#999" />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF'},
  header: { alignItems: 'center', paddingVertical: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1B1919' },

  filterRow: { 
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'center',
    gap: 20, 
    paddingHorizontal: 'auto', 
    marginBottom: 20 
  },
  filterButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EEE', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12 
  },
  filterText: { marginRight: 5, color: '#999', fontWeight: '600' },

  historyCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 18, 
    padding: 12, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 65, height: 65, borderRadius: 12, backgroundColor: '#EBF5FB' }, // Simula a imagem da planta
  textGroup: { marginLeft: 15 },
  plantaNome: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  plantaStatus: { fontSize: 14, fontWeight: '600', marginVertical: 2 },
  plantaData: { fontSize: 12, color: '#BBB' },

  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '80%', backgroundColor: '#EEE', marginHorizontal: 15 },
  deleteBtn: { padding: 5 },

  
 // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 4, fontWeight: '600', color: '#999'},
  
  cameraTabWrapper: { alignItems: 'center', marginTop: -40 },
  cameraTabBtn: {
    backgroundColor: '#47e426',
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#a5ef95',
    elevation: 8,
    shadowColor: '#000000c4',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  }
});