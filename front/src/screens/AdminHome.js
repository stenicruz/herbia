import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, StatusBar, ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Search, CheckCircle2, XCircle, ChevronRight,
  FileBarChart2, MapPin
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';
import adminService from '../services/adminService';

export default function AdminDashboardScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  const [stats,    setStats   ] = useState({ totalUsuarios: 0, totalAnalises: 0 });
  const [recentes, setRecentes] = useState([]);
  const [loading,  setLoading ] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const data = await adminService.obterEstatisticas();
      setStats(data.stats);
      setRecentes(data.recentes);
    } catch (error) {
      console.error("Erro ao carregar dashboard admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { carregarDados(); }, []));

  const renderAnalysisItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.analysisCard, {
        backgroundColor: isDarkMode ? '#121411' : '#FFF',
        borderColor: isDarkMode ? '#1A2E1A' : '#F2F2F2'
      }]}
      onPress={() => navigation.navigate('DiagnosticResult', {
        resultado: item, isAdminView: true, analiseId: item.id
      })}
    >
      <View style={[styles.plantImagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#F5F5F5' }]}>
        <Image source={{ uri: item.imagem_url }} style={styles.thumbImage} />
      </View>
      <View style={styles.analysisInfo}>
        <View style={styles.analysisHeaderRow}>
          <Text style={[styles.plantTitle, { color: currentTheme.textPrimary }]}>{item.planta}</Text>
          {item.estado === 'Saudável'
            ? <CheckCircle2 color={ACTIVE_GREEN} size={18} />
            : <XCircle color="#FF5252" size={18} />
          }
        </View>
        <Text style={[styles.userText, { color: isDarkMode ? '#AAA' : '#666' }]}>
          Usuário: {item.usuario_nome}
        </Text>
        <Text style={[styles.dateText, { color: isDarkMode ? '#555' : '#BBB' }]}>
          {new Date(item.criado_em).toLocaleDateString('pt-PT')}
        </Text>
      </View>
      <ChevronRight color={isDarkMode ? "#333" : "#CCC"} size={20} />
    </TouchableOpacity>
  );

  // Card de acção reutilizável
  const ActionCard = ({ icon: Icon, iconBg, title, subtitle, onPress, bordered }) => (
    <TouchableOpacity
      style={[styles.actionCard, {
        backgroundColor: isDarkMode ? '#121411' : '#FFF',
        borderColor: isDarkMode ? '#1A2E1A' : '#BBF7D0',
        borderWidth: bordered ? 1.5 : 0,
        elevation: bordered ? 2 : 0,
      }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIconWrap, { backgroundColor: iconBg }]}>
        <Icon color={ACTIVE_GREEN} size={24} />
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={[styles.actionTitle,    { color: currentTheme.textPrimary   }]}>{title}</Text>
        <Text style={[styles.actionSubtitle, { color: isDarkMode ? '#AAA' : '#666' }]}>{subtitle}</Text>
      </View>
      <ChevronRight color={ACTIVE_GREEN} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Painel Admin" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color={ACTIVE_GREEN} style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* ── Card verde — Dicas ── */}
            <TouchableOpacity
              style={[styles.cardVerde, { backgroundColor: ACTIVE_GREEN, elevation: isDarkMode ? 0 : 4 }]}
              onPress={() => navigation.navigate('AdminTips')}
              activeOpacity={0.8}
            >
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>Gerenciar Dicas</Text>
                <Text style={styles.cardSubtitle}>
                  Edite as dicas que aparecem para os usuários na Home.
                </Text>
              </View>
              <ChevronRight color="#FFF" size={24} />
            </TouchableOpacity>

            {/* ── Cards de ferramentas ── */}
            <ActionCard
              icon={FileBarChart2}
              iconBg={isDarkMode ? '#1A2E1A' : '#F0FDF4'}
              title="Relatórios do Sistema"
              subtitle="Gera relatórios PDF completos com dados globais"
              onPress={() => navigation.navigate('AdminReportScreen')}
              bordered
            />
            <ActionCard
              icon={MapPin}
              iconBg={isDarkMode ? '#1A2E1A' : '#F0FDF4'}
              title="Visão Geográfica"
              subtitle="Distribuição de utilizadores e doenças por região"
              onPress={() => navigation.navigate('AdminGeoScreen')}
              bordered
            />

            {/* ── Stats ── */}
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={[styles.statBox, styles.statBoxOutline, { borderColor: isDarkMode ? '#1A2E1A' : ACTIVE_GREEN }]}
                onPress={() => navigation.navigate('UserManagement')}
              >
                <User color={ACTIVE_GREEN} size={20} />
                <Text style={[styles.statValue, { color: ACTIVE_GREEN }]}>{stats.totalUsuarios}</Text>
                <Text style={[styles.statLabel, { color: ACTIVE_GREEN }]}>Usuários</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statBox, { backgroundColor: isDarkMode ? '#121411' : '#e6f8e3', borderWidth: isDarkMode ? 1 : 0, borderColor: '#1A2E1A' }]}
                onPress={() => navigation.navigate('AllAnalyses')}
              >
                <Search color={ACTIVE_GREEN} size={20} />
                <Text style={[styles.statValue, { color: ACTIVE_GREEN }]}>{stats.totalAnalises}</Text>
                <Text style={[styles.statLabel, { color: ACTIVE_GREEN }]}>Análises</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>Análises Recentes</Text>

            {recentes.map(item => renderAnalysisItem(item))}

            <TouchableOpacity
              style={[styles.viewAllBtn, {
                backgroundColor: isDarkMode ? '#121411' : '#F9F9F9',
                borderColor: isDarkMode ? '#1A2E1A' : 'transparent',
                borderWidth: isDarkMode ? 1 : 0
              }]}
              onPress={() => navigation.navigate('AllAnalyses')}
            >
              <Text style={[styles.viewAllBtnText, { color: ACTIVE_GREEN }]}>Ver todo o histórico</Text>
              <ChevronRight color={ACTIVE_GREEN} size={23} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 110 },

  cardVerde: {
    borderRadius: 24, padding: 22, height: 110, flexDirection: 'row',
    marginTop: 10, marginBottom: 15, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  cardTextContent: { flex: 1, justifyContent: 'center' },
  cardTitle:    { color: '#FFF', fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: '#FFF', fontSize: 13, marginTop: 6, width: '90%', lineHeight: 18, fontWeight: '600', opacity: 0.9 },

  actionCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  actionIconWrap:  { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  actionTextWrap:  { flex: 1 },
  actionTitle:     { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  actionSubtitle:  { fontSize: 12, fontWeight: '500', lineHeight: 17 },

  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 30, width: '100%', marginBottom: 10, marginTop: 10 },
  statBox: { width: '45%', height: 95, borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center' },
  statBoxOutline: { borderWidth: 1.5 },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  statLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', marginTop: 5 },

  sectionTitle: { fontSize: 19, fontWeight: '800', marginTop: 25, marginBottom: 18 },

  analysisCard: { flexDirection: 'row', borderRadius: 22, padding: 14, marginBottom: 14, borderWidth: 1, alignItems: 'center' },
  plantImagePlaceholder: { width: 58, height: 58, borderRadius: 14, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  analysisInfo: { flex: 1, marginLeft: 16 },
  analysisHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plantTitle: { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  userText:   { fontSize: 13, marginBottom: 4, fontWeight: '500' },
  dateText:   { fontSize: 12, fontWeight: '500' },

  viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 22, borderRadius: 20, marginTop: 8, gap: 12, marginBottom: 50 },
  viewAllBtnText: { fontWeight: '800', fontSize: 15 },
});
