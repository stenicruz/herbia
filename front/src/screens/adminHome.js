import React from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Search, UserMinus, UserPlus, CheckCircle2, XCircle, Home, Users, Leaf 
} from 'lucide-react-native';

const ACTIVE_GREEN = '#47e426'; 

const LAST_ANALYSES = [
  { id: '1', plant: 'Tomateiro', user: 'João Silva', date: '05/07/2025', status: 'success' },
  { id: '2', plant: 'Tomateiro', user: 'João Silva', date: '05/07/2025', status: 'error' },
  { id: '3', plant: 'Tomateiro', user: 'João Silva', date: '05/07/2025', status: 'success' },
  { id: '4', plant: 'Tomateiro', user: 'João Silva', date: '05/07/2025', status: 'error' },
  { id: '5', plant: 'Tomateiro', user: 'João Silva', date: '05/07/2025', status: 'success' }
];

export default function AdminDashboardScreen() {
  const renderAnalysisItem = ({ item }) => (
    <View style={styles.analysisCard}>
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
            <CheckCircle2 color={ACTIVE_GREEN} size={20} fill={ACTIVE_GREEN} fillOpacity={0.1} style={styles.statusIconInline} />
          ) : (
            <XCircle color="#FF4444" size={20} fill="#FF4444" fillOpacity={0.1} style={styles.statusIconInline} />
          )}
        </View>
        <Text style={styles.userText}>User {item.user}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    // Mudamos o comportamento para flex: 1 para ocupar a tela toda corretamente
    <SafeAreaView style={styles.safeContainer}>
      
      {/* ScrollView agora NÃO tem paddingBottom exagerado, ele apenas rola o conteúdo */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.adminHeader}>Herbia Admin</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxOutline]}>
            <User color={ACTIVE_GREEN} size={28} style={styles.iconTopLeft} />
            <View style={styles.textContainerLeft}>
               <Text style={styles.statValue}>50</Text>
               <Text style={styles.statLabel}>Usuários</Text>
            </View>
          </View>

          <View style={[styles.statBox, styles.statBoxSolid]}>
            <Search color={ACTIVE_GREEN} size={28} style={styles.iconTopLeft} />
            <View style={styles.textContainerLeft}>
               <Text style={[styles.statValue, { color: ACTIVE_GREEN  }]}>300</Text>
               <Text style={[styles.statLabel, { color: ACTIVE_GREEN }]}>Análises</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <UserMinus color="#FFF" size={24} style={styles.iconTopLeft} />
            <View style={styles.textContainerLeft}>
               <Text style={[styles.statValue, { color: '#FFF' }]}>50</Text>
               <Text style={[styles.statLabel, { color: '#FFF' }]}>Desativado</Text>
            </View>
          </View>

          <View style={[styles.statBox, styles.statBoxGreen]}>
            <UserPlus color="#FFF" size={24} style={styles.iconTopLeft} />
            <View style={styles.textContainerLeft}>
               <Text style={[styles.statValue, { color: '#FFF' }]}>50</Text>
               <Text style={[styles.statLabel, { color: '#FFF' }]}>Activo</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Últimas 5 Análises</Text>

        <FlatList
          data={LAST_ANALYSES}
          renderItem={renderAnalysisItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Menu Inferior: Agora fora do ScrollView e sem position absolute */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home color={ACTIVE_GREEN} size={24} />
          <Text style={[styles.navText, { color: ACTIVE_GREEN }]}>Casa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Users color="#999" size={24} />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Leaf color="#999" size={24} />
          <Text style={styles.navText}>Culturas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User color="#999" size={24} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 10,
    paddingBottom: 20 
  },
  adminHeader: { fontSize: 21, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 35 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statBox: { width: '48%', height: 110, borderRadius: 20, padding: 15, justifyContent: 'space-between' },
  statBoxOutline: { borderWidth: 1, borderColor: ACTIVE_GREEN },
  statBoxSolid: { backgroundColor: '#e6f8e3' },
  statBoxGreen: { backgroundColor: '#6acc59' },
  iconTopLeft: { alignSelf: 'flex-start', marginBottom:3 },
  textContainerLeft: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: ACTIVE_GREEN, marginBottom:6 },
  statLabel: { fontSize: 13, fontWeight: '700', color: ACTIVE_GREEN },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#363636', marginBottom: 15, marginTop: 15, marginBottom:20 },
  analysisCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  plantImagePlaceholder: { width: 65, height: 65, borderRadius: 15, backgroundColor: '#F5F5F5', overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  analysisInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  analysisHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  plantTitle: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  statusIconInline: { marginLeft: 8 },
  userText: { fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 2 },
  dateText: { fontSize: 12, color: '#BBB', marginTop: 1 },

  // RODAPÉ CORRIGIDO PARA ANDROID
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    height: 70, 
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE',
    // O SafeAreaView vai cuidar do preenchimento extra no Android/iOS
  },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 10, marginTop: 4, color: '#999', fontWeight: '600' }
});