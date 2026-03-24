import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal,
  TouchableWithoutFeedback, Image, Platform, StatusBar, ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  ChevronDown, Trash2, Check, Calendar as CalendarIcon, Share2
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';
import adminService from '../services/adminService';

export default function AnalysesListScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const ACTIVE_GREEN = THEME.primary;

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deletando, setDeletando] = useState(false);

  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [menuAberto, setMenuAberto] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null); // formato YYYY-MM-DD

  useFocusEffect(
    React.useCallback(() => {
      loadAnalyses();
    }, [])
  );

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarHistoricoGlobal();
      setAnalyses(data);
    } catch (err) {
      console.warn("Erro ao carregar análises:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = (id) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      setDeletando(true);
      await adminService.eliminarAnalise(selectedId);
      setModalVisible(false);
      setAnalyses(prev => prev.filter(a => a.id !== selectedId));
    } catch (err) {
      console.warn("Erro ao eliminar:", err);
    } finally {
      setDeletando(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Opções dinâmicas baseadas nos dados reais
  const plantasUnicas = ['Todas', ...new Set(analyses.map(a => a.planta).filter(Boolean))];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente'];

  // Filtragem
  const dadosFiltrados = analyses.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.estado === filtroStatus;
    const matchData = !dataSelecionada || item.criado_em?.startsWith(dataSelecionada);
    return matchPlanta && matchStatus && matchData;
  });

  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.dropdownContainer, {
            left: posicaoEsquerda,
            backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
            borderColor: isDarkMode ? '#222' : '#F0F0F0'
          }]}>
            {opcoes.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownOption, { borderBottomColor: isDarkMode ? '#222' : '#F9F9F9' }]}
                onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}
              >
                {selecionado === opt && <Check color={ACTIVE_GREEN} size={16} style={{ marginRight: 8 }} />}
                <Text style={[
                  styles.dropdownText,
                  { color: isDarkMode ? '#AAA' : '#666' },
                  selecionado === opt && { color: ACTIVE_GREEN, fontWeight: '800' }
                ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Análises" />

      <View style={styles.headerPadding}>
        <View style={[styles.totalCard, {
          backgroundColor: isDarkMode ? '#121411' : '#FFF',
          borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0'
        }]}>
          <View>
            <Text style={[styles.totalLabel, { color: isDarkMode ? '#AAA' : '#333' }]}>
              Total de Análises
            </Text>
            <Text style={[styles.totalNumber, { color: ACTIVE_GREEN }]}>
              {analyses.length}  {/* ✅ total real do sistema — não muda com filtros */}
            </Text>
          </View>

          {/* ✅ Mostra resultados filtrados só quando há filtro activo */}
          {dadosFiltrados.length !== analyses.length && (
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.totalLabel, { color: isDarkMode ? '#AAA' : '#333' }]}>
                Filtradas
              </Text>
              <Text style={[styles.totalNumber, { color: isDarkMode ? '#AAA' : '#666', fontSize: 18 }]}>
                {dadosFiltrados.length}
              </Text>
            </View>
          )}

          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: isDarkMode ? '#1A2E1A' : '#e6f8e3' }]}>
            <Share2 color={ACTIVE_GREEN} size={22} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {/* DATA */}
          <TouchableOpacity
            style={[styles.filterButton, {
              backgroundColor: isDarkMode ? '#121411' : '#FFF',
              borderColor: isDarkMode ? '#222' : '#EEE'
            }, dataSelecionada && { backgroundColor: ACTIVE_GREEN, borderColor: ACTIVE_GREEN }]}
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarIcon color={dataSelecionada ? "#FFF" : "#999"} size={16} />
            <Text style={[styles.filterText, dataSelecionada && styles.filterTextAtivo]}>
              {dataSelecionada ? formatarData(dataSelecionada + 'T00:00:00') : "Data"}
            </Text>
            {/* ✅ Botão X para limpar o filtro */}
            {dataSelecionada && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setDataSelecionada(null);
                }}
                style={{ marginLeft: 4 }}
              >
                <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* PLANTA */}
          <TouchableOpacity
            style={[styles.filterButton, {
              backgroundColor: isDarkMode ? '#121411' : '#FFF',
              borderColor: isDarkMode ? '#222' : '#EEE'
            }, filtroPlanta !== 'Todas' && { backgroundColor: ACTIVE_GREEN, borderColor: ACTIVE_GREEN }]}
            onPress={() => setMenuAberto('planta')}
          >
            <Text style={[styles.filterText, filtroPlanta !== 'Todas' && styles.filterTextAtivo]}>
              {filtroPlanta}
            </Text>
            <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : "#999"} size={18} />
          </TouchableOpacity>

          {/* STATUS */}
          <TouchableOpacity
            style={[styles.filterButton, {
              backgroundColor: isDarkMode ? '#121411' : '#FFF',
              borderColor: isDarkMode ? '#222' : '#EEE'
            }, filtroStatus !== 'Todos' && { backgroundColor: ACTIVE_GREEN, borderColor: ACTIVE_GREEN }]}
            onPress={() => setMenuAberto('status')}
          >
            <Text style={[styles.filterText, filtroStatus !== 'Todos' && styles.filterTextAtivo]}>
              {filtroStatus}
            </Text>
            <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : "#999"} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            if (Platform.OS === 'android') setShowDatePicker(false);
            if (event.type === 'set' && selectedDate) {
              setDate(selectedDate);
              const y = selectedDate.getFullYear();
              const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const d = String(selectedDate.getDate()).padStart(2, '0');
              setDataSelecionada(`${y}-${m}-${d}`);
            }
          }}
        />
      )}

      <RenderDropdown
        visivel={menuAberto === 'planta'}
        opcoes={plantasUnicas}
        selecionado={filtroPlanta}
        aoSelecionar={setFiltroPlanta}
        posicaoEsquerda="31%"
      />
      <RenderDropdown
        visivel={menuAberto === 'status'}
        opcoes={opcoesStatus}
        selecionado={filtroStatus}
        aoSelecionar={setFiltroStatus}
        posicaoEsquerda="60%"
      />

      {loading ? (
        <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
          {dadosFiltrados.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.analysisCard, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor: isDarkMode ? '#1A2E1A' : '#F0F0F0'
              }]}
              onPress={() => navigation.navigate('DiagnosticResult', {
                resultado: item,
                imageUri: item.imagem_url,
                isAdminView: true,
                analiseId: item.id
              })}
            >
              <View style={styles.cardInfo}>
                <View style={[styles.imagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#EBF5FB' }]}>
                  {item.imagem_url ? (
                    <Image source={{ uri: item.imagem_url }} style={styles.thumbImage} />
                  ) : null}
                </View>
                <View style={styles.textGroup}>
                  <Text style={[styles.plantaNome, { color: currentTheme.textPrimary }]}>{item.planta}</Text>
                  <Text style={[styles.plantaStatus, {
                    color: item.estado === 'Saudável' ? ACTIVE_GREEN : '#FF5252'
                  }]}>
                    {item.doenca || item.estado}
                  </Text>
                  {/* ✅ Nome do utilizador */}
                  <Text style={[styles.usuarioNome, { color: isDarkMode ? '#777' : '#888' }]}>
                    Usuário: {item.usuario_nome || 'Desconhecido'}
                  </Text>
                  <Text style={[styles.plantaData, { color: isDarkMode ? '#555' : '#BBB' }]}>
                    {formatarData(item.criado_em)}
                  </Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#222' : '#EEE' }]} />
                <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.deleteBtn}>
                  <Trash2 color="#FF5252" size={24} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {dadosFiltrados.length === 0 && (
            <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
              Nenhuma análise encontrada.
            </Text>
          )}
        </ScrollView>
      )}

      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDelete}
        title="Eliminar Análise?"
        description="Esta análise será removida permanentemente do sistema."
        variant="danger"
        loading={deletando}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  headerPadding: { paddingHorizontal: 20 },
  totalCard: {
    flexDirection: 'row', borderRadius: 22, padding: 20,
    alignItems: 'center', justifyContent: 'space-between',
    marginTop: 15, marginBottom: 20, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.05, elevation: 2
  },
  usuarioNome: { fontSize: 12, fontWeight: '700', marginVertical: 2 },
  totalLabel: { fontSize: 14, fontWeight: '700' },
  totalNumber: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  shareBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, zIndex: 10 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 15, gap: 6
  },
  filterText: { color: '#999', fontWeight: '700', fontSize: 13 },
  filterTextAtivo: { color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: {
    position: 'absolute', top: 265, width: 150,
    borderRadius: 20, elevation: 15, shadowOpacity: 0.2, borderWidth: 1, padding: 8
  },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  dropdownText: { fontSize: 14, fontWeight: '600' },
  analysisCard: {
    flexDirection: 'row', borderRadius: 22, padding: 14,
    marginBottom: 16, borderWidth: 1, elevation: 2
  },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 64, height: 64, borderRadius: 14, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  textGroup: { marginLeft: 15 },
  plantaNome: { fontSize: 17, fontWeight: '800' },
  plantaStatus: { fontSize: 14, fontWeight: '800', marginVertical: 3 },
  plantaData: { fontSize: 12, fontWeight: '600' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '60%', marginHorizontal: 15 },
  deleteBtn: { padding: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 15, fontWeight: '600' }
});