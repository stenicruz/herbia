import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, Share2, Trash2, EyeOff, ChevronDown, Home, Users, Leaf, User as UserIcon 
} from 'lucide-react-native';

const ACTIVE_GREEN = '#47e426';

export default function UserDetailsScreen() {
  // Dados fictícios para o histórico
  const ANALYSIS_HISTORY = [
    { id: '1', plant: 'Tomateiro', status: 'Saudável', date: '05/07/2025' },
    { id: '2', plant: 'Tomateiro', status: 'Saudável', date: '05/07/2025' },
    { id: '3', plant: 'Tomateiro', status: 'Saudável', date: '05/07/2025' },
  ];

  const FilterBadge = ({ label, active = false }) => (
    <TouchableOpacity style={[styles.filterBadge, active && styles.filterBadgeActive]}>
      <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>{label}</Text>
      <ChevronDown size={16} color={active ? '#FFF' : '#999'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <ChevronLeft color="#333" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do usuário</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Perfil Central */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder} />
          </View>
          <Text style={styles.profileName}>Sebastião Miguel</Text>
          <Text style={styles.profileEmail}>sebastiao@gmail.com</Text>
          <View style={styles.badgeRow}>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
            <Text style={styles.sinceText}>• Desde: 05/08/2020</Text>
          </View>
        </View>

        {/* Card de Métricas */}
        <View style={styles.metricsCard}>
          <View>
            <Text style={styles.metricsTitle}>Total de Análises</Text>
            <Text style={styles.metricsValue}>13</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Share2 color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Botões de Acção Rápida */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.deactivateBtn}>
            <EyeOff color="#47e426" size={18} />
            <Text style={styles.deactivateBtnText}>Desactivar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn}>
            <Trash2 color="#d30a0a" size={18} fill="#cc0303" />
            <Text style={styles.deleteBtnText}>Deletar</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de Análises */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico de Análises</Text>
          
          <View style={styles.filtersRow}>
            <FilterBadge label="Data" />
            <FilterBadge label="Planta" active />
            <FilterBadge label="Status" />
          </View>

          {ANALYSIS_HISTORY.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyCardContent}>
                <View style={styles.plantImagePlaceholder} />
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{item.plant}</Text>
                  <Text style={styles.plantStatus}>{item.status}</Text>
                  <Text style={styles.plantDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <TouchableOpacity style={styles.trashBtn}>
                <Trash2 color="#db2626" size={24} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, marginTop: 10 },
  headerTitle: { fontSize: 16, fontWeight: '600', marginLeft: 15, color: '#333' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  
  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: ACTIVE_GREEN, padding: 3, marginBottom: 15 },
  avatarPlaceholder: { flex: 1, backgroundColor: '#E1F2FF', borderRadius: 60 },
  profileName: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 2 },
  profileEmail: { fontSize: 15, color: '#999', marginVertical: 4, marginTop: 5 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  adminBadge: { backgroundColor: '#B8FFAD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  adminBadgeText: { fontSize: 10, fontWeight: '700', color: '#333' },
  sinceText: { fontSize: 13, color: '#b3afaf' },

  metricsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', borderRadius: 20, padding: 20, marginVertical: 15 },
  metricsTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  metricsValue: { fontSize: 18, fontWeight: '800', color: ACTIVE_GREEN, marginTop: 5 },
  shareBtn: { backgroundColor: ACTIVE_GREEN, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  actionButtonsRow: { flexDirection: 'row', gap: 15, marginBottom: 30, marginTop: 8 },
  deactivateBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#e8fcea', height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', gap: 8 },
  deactivateBtnText: { color: '#47e426', fontWeight: '700', fontSize: 14 },
  deleteBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#ffb3b3', height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', gap: 8 },
  deleteBtnText: { color: '#db2626', fontWeight: '700', fontSize: 14 },

  historySection: { marginTop: 10, marginBottom: -60 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 25 },
  filtersRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  filterBadgeActive: { backgroundColor: ACTIVE_GREEN, borderColor: ACTIVE_GREEN },
  filterBadgeText: { fontSize: 13, color: '#999' },
  filterBadgeTextActive: { color: '#FFF', fontWeight: '700' },

  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 20, padding: 15, marginBottom: 12 },
  historyCardContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  plantImagePlaceholder: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#E1F2FF' },
  plantInfo: { marginLeft: 15 },
  plantName: { fontSize: 15, fontWeight: '700', color: '#333' },
  plantStatus: { fontSize: 13, color: ACTIVE_GREEN, fontWeight: '600', marginVertical: 2 },
  plantDate: { fontSize: 11, color: '#BBB' },
  cardDivider: { width: 1, height: '70%', backgroundColor: '#EEE', marginHorizontal: 15 },
  trashBtn: { padding: 5 },

});