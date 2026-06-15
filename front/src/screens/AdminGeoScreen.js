import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Modal, FlatList,
  TextInput, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  MapPin, Users, AlertTriangle, Wifi, WifiOff,
  X, Search, ChevronRight, User
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central';
import adminService from '../services/adminService';

// ─── Períodos disponíveis para o filtro de doenças ────────────────────────
const PERIODOS = [
  { label: 'Hoje',    dias: 1    },
  { label: '7 dias',  dias: 7    },
  { label: '30 dias', dias: 30   },
  { label: '3 meses', dias: 90   },
  { label: 'Tudo',    dias: null },
];

export default function AdminGeoScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const C     = isDarkMode ? THEME.dark : THEME.light;
  const GREEN = THEME.primary;

  const [analises,     setAnalises    ] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);
  const [loading,      setLoading     ] = useState(true);

  // Filtro de período para doenças
  const [periodoIdx, setPeriodoIdx] = useState(4); // "Tudo" por defeito

  // Modal de utilizadores por província
  const [provModal,        setProvModal       ] = useState(false);
  const [provSelecionada,  setProvSelecionada ] = useState(null);
  const [searchUser,       setSearchUser      ] = useState('');

  useFocusEffect(
    React.useCallback(() => { carregarDados(); }, [])
  );

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [historicoData, usersData] = await Promise.all([
        adminService.listarHistoricoGlobal(),
        adminService.listarUsuarios(),
      ]);
      setAnalises(historicoData);
      setUtilizadores(usersData);
    } catch (err) {
      console.warn("Erro ao carregar dados geo:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Análises filtradas por período ───────────────────────────────────────
  const analisesFiltradas = useMemo(() => {
    const periodo = PERIODOS[periodoIdx];
    if (periodo.dias === null) return analises;
    const limite = new Date();
    limite.setDate(limite.getDate() - periodo.dias);
    return analises.filter(a => new Date(a.criado_em) >= limite);
  }, [analises, periodoIdx]);

  // ─── Cobertura GPS (sobre todas as análises, sem filtro de período) ───────
  const totalAnalises = analises.length;
  const comGPS        = analises.filter(a => a.latitude && a.longitude).length;
  const semGPS        = totalAnalises - comGPS;
  const coberturaGPS  = totalAnalises > 0 ? Math.round((comGPS / totalAnalises) * 100) : 0;

  // ─── Top doenças (filtradas pelo período) ─────────────────────────────────
  const topDoencas = useMemo(() => {
    const map = {};
    analisesFiltradas.forEach(a => {
      if (a.doenca && a.doenca !== 'Não identificado' && a.estado !== 'Saudável') {
        map[a.doenca] = (map[a.doenca] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [analisesFiltradas]);

  const maxDoenca = topDoencas.length > 0 ? topDoencas[0][1] : 1;

  // ─── Utilizadores por província ───────────────────────────────────────────
  const provincias = useMemo(() => {
    const map = {};
    utilizadores.forEach(u => {
      const prov = u.provincia || 'Não informado';
      if (!map[prov]) map[prov] = [];
      map[prov].push(u);
    });
    return Object.entries(map)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([nome, users]) => ({ nome, users, total: users.length }));
  }, [utilizadores]);

  const maxPorProv = provincias.length > 0 ? provincias[0].total : 1;

  // ─── Utilizadores do modal (com pesquisa) ─────────────────────────────────
  const usersDaProvinciaPesquisados = useMemo(() => {
    if (!provSelecionada) return [];
    const lista = provSelecionada.users;
    if (!searchUser.trim()) return lista;
    const q = searchUser.toLowerCase();
    return lista.filter(u =>
      u.nome?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.municipio?.toLowerCase().includes(q)
    );
  }, [provSelecionada, searchUser]);

  const abrirModal = (prov) => {
    setProvSelecionada(prov);
    setSearchUser('');
    setProvModal(true);
  };

  const fecharModal = () => {
    setProvModal(false);
    setProvSelecionada(null);
    setSearchUser('');
  };

  // ─── Render de cada utilizador no modal ───────────────────────────────────
  const renderUser = ({ item }) => (
    <View style={[styles.userRow, {
      backgroundColor: isDarkMode ? '#1A1D19' : '#F9F9F9',
      borderColor:     isDarkMode ? '#2A2E28' : '#F0F0F0',
    }]}>
      <View style={[styles.userAvatar, { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]}>
        <User color={GREEN} size={18} />
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName,  { color: C.textPrimary   }]} numberOfLines={1}>
          {item.nome || '—'}
        </Text>
        <Text style={[styles.userEmail, { color: C.textSecondary }]} numberOfLines={1}>
          {item.email || '—'}
        </Text>
        <View style={styles.userTagRow}>
          {item.municipio && (
            <View style={[styles.userTag, { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]}>
              <Text style={[styles.userTagText, { color: GREEN }]}>{item.municipio}</Text>
            </View>
          )}
          {item.perfil_agricola && (
            <View style={[styles.userTag, { backgroundColor: isDarkMode ? '#1A2A3A' : '#E8F0FE' }]}>
              <Text style={[styles.userTagText, { color: '#3b82f6' }]}>{item.perfil_agricola}</Text>
            </View>
          )}
          <View style={[styles.userTag, {
            backgroundColor: (item.ativo === 1 || item.ativo === true)
              ? (isDarkMode ? '#1A2E1A' : '#E8F5E9')
              : (isDarkMode ? '#2D1414' : '#FFEBEE')
          }]}>
            <Text style={[styles.userTagText, {
              color: (item.ativo === 1 || item.ativo === true) ? GREEN : '#ef4444'
            }]}>
              {(item.ativo === 1 || item.ativo === true) ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Visão Geográfica" />

      {loading ? (
        <ActivityIndicator color={GREEN} style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── 1. Cobertura GPS ── */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? '#121411' : '#FFF',
            borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
          }]}>
            <View style={styles.cardTitleRow}>
              {coberturaGPS >= 50
                ? <Wifi    color={GREEN}    size={20} />
                : <WifiOff color="#f59e0b" size={20} />
              }
              <Text style={[styles.cardTitle, { color: C.textPrimary }]}>
                Cobertura de Localização GPS
              </Text>
            </View>

            <View style={styles.gpsMetricsRow}>
              {[
                { label: 'Total',      val: totalAnalises, color: C.textPrimary },
                { label: 'Com GPS',    val: comGPS,        color: GREEN         },
                { label: 'Sem GPS',    val: semGPS,        color: '#f59e0b'     },
                { label: 'Cobertura',  val: `${coberturaGPS}%`, color: coberturaGPS >= 50 ? GREEN : '#f59e0b' },
              ].map((m, i) => (
                <View key={i} style={styles.gpsMetric}>
                  <Text style={[styles.gpsMetricVal,   { color: m.color        }]}>{m.val}</Text>
                  <Text style={[styles.gpsMetricLabel, { color: C.textSecondary}]}>{m.label}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.barraFundo, {
              backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9', marginTop: 14,
            }]}>
              <View style={[styles.barraFill, {
                width: `${coberturaGPS}%`,
                backgroundColor: coberturaGPS >= 50 ? GREEN : '#f59e0b',
              }]} />
            </View>

            {semGPS > 0 && (
              <Text style={[styles.gpsAviso, { color: C.textSecondary }]}>
                ⚠️ {semGPS} análise{semGPS !== 1 ? 's' : ''} sem localização
              </Text>
            )}
          </View>

          {/* ── 2. Top Doenças com filtro de período ── */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? '#121411' : '#FFF',
            borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
          }]}>
            <View style={styles.cardTitleRow}>
              <AlertTriangle color="#ef4444" size={20} />
              <Text style={[styles.cardTitle, { color: C.textPrimary }]}>Top Doenças</Text>
            </View>

            {/* Chips de período */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodoRow}>
              {PERIODOS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.periodoChip,
                    { borderColor: isDarkMode ? '#333' : '#DDD', backgroundColor: isDarkMode ? '#1A1D19' : '#F5F5F5' },
                    periodoIdx === i && { backgroundColor: '#ef4444', borderColor: '#ef4444' },
                  ]}
                  onPress={() => setPeriodoIdx(i)}
                >
                  <Text style={[styles.periodoChipText, {
                    color: periodoIdx === i ? '#fff' : (isDarkMode ? '#888' : '#666'),
                  }]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lista de doenças */}
            {topDoencas.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FDF4' }]}>
                <Text style={[styles.emptyText, { color: GREEN }]}>
                  ✅ Nenhuma doença detectada no período
                </Text>
              </View>
            ) : (
              topDoencas.map(([nome, count], i) => {
                const pct = maxDoenca > 0 ? (count / maxDoenca) * 100 : 0;
                return (
                  <View key={i} style={styles.doencaRow}>
                    <View style={[styles.doencaRank, { backgroundColor: isDarkMode ? '#2D1414' : '#FFEBEE' }]}>
                      <Text style={styles.doencaRankText}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.doencaNome, { color: C.textPrimary }]}>{nome}</Text>
                      <View style={[styles.barraFundo, {
                        backgroundColor: isDarkMode ? '#2D1414' : '#FFF0F0', marginTop: 5,
                      }]}>
                        <View style={[styles.barraFill, { width: `${pct}%`, backgroundColor: '#ef4444' }]} />
                      </View>
                    </View>
                    <View style={[styles.doencaBadge, { backgroundColor: isDarkMode ? '#2D1414' : '#FFEBEE' }]}>
                      <Text style={styles.doencaBadgeText}>{count}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* ── 3. Utilizadores por Província ── */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? '#121411' : '#FFF',
            borderColor:     isDarkMode ? '#1A2E1A' : '#F0F0F0',
          }]}>
            <View style={styles.cardTitleRow}>
              <MapPin color={GREEN} size={20} />
              <Text style={[styles.cardTitle, { color: C.textPrimary }]}>
                Utilizadores por Província
              </Text>
            </View>
            <Text style={[styles.cardHint, { color: C.textSecondary }]}>
              Toca numa província para ver os utilizadores
            </Text>

            {provincias.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FDF4' }]}>
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>
                  Nenhum utilizador preencheu a sua província ainda.
                </Text>
              </View>
            ) : (
              provincias.map((prov, i) => {
                const pct = maxPorProv > 0 ? (prov.total / maxPorProv) * 100 : 0;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.provRow, {
                      backgroundColor: isDarkMode ? '#1A1D19' : '#F9F9F9',
                      borderColor:     isDarkMode ? '#2A2E28' : '#F0F0F0',
                    }]}
                    onPress={() => abrirModal(prov)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.provLeft}>
                      <View style={[styles.provIconWrap, { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]}>
                        <MapPin color={GREEN} size={16} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.provNome, { color: C.textPrimary }]}>{prov.nome}</Text>
                        <View style={[styles.barraFundo, {
                          backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9', marginTop: 6,
                        }]}>
                          <View style={[styles.barraFill, { width: `${pct}%`, backgroundColor: GREEN }]} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.provRight}>
                      <Text style={[styles.provCount, { color: GREEN }]}>{prov.total}</Text>
                      <View style={[styles.userIconWrap, { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]}>
                        <Users color={GREEN} size={12} />
                      </View>
                      <ChevronRight color={isDarkMode ? '#444' : '#CCC'} size={16} />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ── Modal: utilizadores da província ── */}
      <Modal visible={provModal} animationType="slide" transparent onRequestClose={fecharModal}>
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable style={[styles.modalContent, { backgroundColor: isDarkMode ? '#121411' : '#FFF' }]}>

            {/* Header do modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: C.textPrimary }]}>
                  {provSelecionada?.nome}
                </Text>
                <Text style={[styles.modalSub, { color: C.textSecondary }]}>
                  {provSelecionada?.total} utilizador{provSelecionada?.total !== 1 ? 'es' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={fecharModal} style={styles.modalClose}>
                <X color={isDarkMode ? '#888' : '#666'} size={22} />
              </TouchableOpacity>
            </View>

            {/* Campo de pesquisa */}
            <View style={[styles.searchBox, {
              backgroundColor: isDarkMode ? '#1A1D19' : '#F5F5F5',
              borderColor:     isDarkMode ? '#2A2E28' : '#E8E8E8',
            }]}>
              <Search color={isDarkMode ? '#555' : '#999'} size={16} />
              <TextInput
                style={[styles.searchInput, { color: C.textPrimary }]}
                placeholder="Pesquisar por nome, email ou município..."
                placeholderTextColor={isDarkMode ? '#555' : '#999'}
                value={searchUser}
                onChangeText={setSearchUser}
                autoCapitalize="none"
              />
              {searchUser.length > 0 && (
                <TouchableOpacity onPress={() => setSearchUser('')}>
                  <X color={isDarkMode ? '#555' : '#999'} size={14} />
                </TouchableOpacity>
              )}
            </View>

            {/* Lista de utilizadores */}
            {usersDaProvinciaPesquisados.length === 0 ? (
              <View style={[styles.emptyBox, {
                backgroundColor: isDarkMode ? '#1A2E1A' : '#F0FDF4', margin: 20,
              }]}>
                <Text style={[styles.emptyText, { color: C.textSecondary }]}>
                  {searchUser ? 'Nenhum resultado para a pesquisa.' : 'Sem utilizadores.'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={usersDaProvinciaPesquisados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUser}
                contentContainerStyle={styles.userList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },

  // Cards
  card: {
    borderRadius: 20, borderWidth: 1, padding: 18,
    marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardHint:  { fontSize: 12, marginBottom: 14, marginTop: -10 },

  // GPS
  gpsMetricsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  gpsMetric: { alignItems: 'center' },
  gpsMetricVal:   { fontSize: 20, fontWeight: '900' },
  gpsMetricLabel: { fontSize: 11, fontWeight: '600', marginTop: 3 },
  gpsAviso: { fontSize: 12, marginTop: 10, fontWeight: '500' },

  // Barra de progresso
  barraFundo: { height: 8, borderRadius: 10, overflow: 'hidden' },
  barraFill:  { height: '100%', borderRadius: 10 },

  // Período chips
  periodoRow: { marginBottom: 16 },
  periodoChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5, marginRight: 8,
  },
  periodoChipText: { fontWeight: '700', fontSize: 13 },

  // Doenças
  doencaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  doencaRank: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  doencaRankText: { color: '#ef4444', fontSize: 12, fontWeight: '800' },
  doencaNome: { fontSize: 13, fontWeight: '700' },
  doencaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  doencaBadgeText: { color: '#ef4444', fontWeight: '800', fontSize: 13 },

  // Províncias
  provRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 10,
  },
  provLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  provIconWrap:{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  provNome:    { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  provRight:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 10 },
  provCount:   { fontSize: 16, fontWeight: '900' },
  userIconWrap:{ width: 22, height: 22, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },

  // Empty
  emptyBox:  { borderRadius: 12, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    maxHeight: '80%', paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalSub:   { fontSize: 13, marginTop: 3 },
  modalClose: { padding: 4 },

  // Search
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginBottom: 14,
    borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },

  // User list
  userList: { paddingHorizontal: 20, paddingBottom: 40 },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 10,
  },
  userAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  userInfo:   { flex: 1 },
  userName:   { fontSize: 14, fontWeight: '700' },
  userEmail:  { fontSize: 12, marginTop: 2 },
  userTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  userTag:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  userTagText:{ fontSize: 11, fontWeight: '700' },
});