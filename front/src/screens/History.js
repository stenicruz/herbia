import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal,
  TouchableWithoutFeedback, Platform, StatusBar, ActivityIndicator, Alert, Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronDown, Trash2, Check, Calendar as CalendarIcon, X, FileText, WifiOff
} from 'lucide-react-native';

import plantService from '../services/plantService';
import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import {
  listarHistoricoLocal,
  guardarHistoricoLocal,
} from '../services/offlineService';

export default function HistoryScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const { isOnline } = useNetworkStatus();

  const [historico,   setHistorico  ] = useState([]);
  const [loading,     setLoading    ] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);

  const [menuAberto,              setMenuAberto             ] = useState(null);
  const [filtroPlanta,            setFiltroPlanta           ] = useState('Todas');
  const [filtroStatus,            setFiltroStatus           ] = useState('Todos');
  const [date,                    setDate                   ] = useState(new Date());
  const [showDatePicker,          setShowDatePicker         ] = useState(false);
  const [dataSelecionadaFormatada,setDataSelecionadaFormatada] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId,   setSelectedId  ] = useState(null);
  const [deletando,    setDeletando   ] = useState(false);

  const opcoesPlanta = ['Todas', ...new Set(historico.map(item => item.planta).filter(Boolean))].sort();
  const opcoesStatus = ['Todos', 'Saudável', 'Doente'];

  const carregarHistorico = useCallback(async () => {
    try {
      setLoading(true);

      if (isOnline) {
        // Online → busca do servidor e actualiza cache local
        const dados = await plantService.listarHistorico();
        setHistorico(dados);
        setIsFromCache(false);
        await guardarHistoricoLocal(dados);
      } else {
        // Offline → usa cache local
        const dadosLocais = await listarHistoricoLocal();
        setHistorico(dadosLocais);
        setIsFromCache(true);
      }
    } catch (error) {
      // Fallback para cache local se houver erro de rede
      console.warn("Erro ao carregar histórico, usando cache:", error);
      const dadosLocais = await listarHistoricoLocal();
      setHistorico(dadosLocais);
      setIsFromCache(dadosLocais.length > 0);
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  useFocusEffect(
    useCallback(() => { carregarHistorico(); }, [carregarHistorico])
  );

  const handleConfirmDelete = async () => {
    if (!selectedId || !isOnline) {
      if (!isOnline) Alert.alert("Offline", "Não é possível eliminar registos sem internet.");
      return;
    }
    try {
      setDeletando(true);
      await plantService.deletarAnalise(selectedId);
      setHistorico(prev => prev.filter(item => item.id !== selectedId));
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível eliminar o registro.");
    } finally {
      setDeletando(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      setDataSelecionadaFormatada(formatDate(selectedDate));
    }
  };

  const dadosFiltrados = historico.filter(item => {
    const matchPlanta  = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const isSaudavel   = item.estado === 'Saudável';
    const matchStatus  = filtroStatus === 'Todos'
      || (filtroStatus === 'Saudável' && isSaudavel)
      || (filtroStatus === 'Doente'   && !isSaudavel);
    const dataItem  = item.criado_em ? formatDate(new Date(item.criado_em)) : '';
    const matchData = !dataSelecionadaFormatada || dataItem === dataSelecionadaFormatada;
    return matchPlanta && matchStatus && matchData;
  });

  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.dropdownContainer, {
            left: posicaoEsquerda,
            backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
            borderColor:     isDarkMode ? '#333'    : '#F0F0F0',
          }]}>
            {opcoes.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownOption, { borderBottomColor: isDarkMode ? '#222' : '#F9F9F9' }]}
                onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}
              >
                {selecionado === opt && <Check color={THEME.primary} size={16} style={{ marginRight: 8 }} />}
                <Text style={[
                  styles.dropdownText, { color: isDarkMode ? '#CCC' : '#666' },
                  selecionado === opt && { color: THEME.primary, fontWeight: '700' }
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

      <AppHeader
        title="Histórico"
        showBack={false}
        rightElement={
          <TouchableOpacity
            style={[styles.reportBtn, {
              backgroundColor: isDarkMode ? '#121411' : '#F0FDF4',
              borderColor:     isDarkMode ? '#1A2E1A' : '#BBF7D0',
            }]}
            onPress={() => navigation.navigate('ReportScreen')}
            activeOpacity={0.7}
          >
            <FileText color={THEME.primary} size={18} />
            <Text style={[styles.reportBtnText, { color: THEME.primary }]}>Relatório</Text>
          </TouchableOpacity>
        }
      />

      {/* Banner de cache local */}
      {isFromCache && (
        <View style={[styles.cacheBanner, { backgroundColor: isDarkMode ? '#1A1A14' : '#FFFBEB' }]}>
          <WifiOff color="#f59e0b" size={14} />
          <Text style={styles.cacheBannerText}>
            A mostrar histórico guardado · Ligue-se para actualizar
          </Text>
        </View>
      )}

      {/* Filtros */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            dataSelecionadaFormatada && styles.filterButtonAtivo,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarIcon color={dataSelecionadaFormatada ? "#121411" : "#999"} size={16} style={{ marginRight: 5 }} />
          <Text style={[styles.filterText, dataSelecionadaFormatada && styles.filterTextAtivo]}>
            {dataSelecionadaFormatada || "Data"}
          </Text>
          {dataSelecionadaFormatada && (
            <TouchableOpacity onPress={() => setDataSelecionadaFormatada(null)} style={{ marginLeft: 5 }}>
              <X color="#121411" size={14} strokeWidth={3} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            filtroPlanta !== 'Todas' && styles.filterButtonAtivo,
          ]}
          onPress={() => setMenuAberto('planta')}
        >
          <Text style={[styles.filterText, filtroPlanta !== 'Todas' && styles.filterTextAtivo]}>
            {filtroPlanta}
          </Text>
          <ChevronDown color={filtroPlanta !== 'Todas' ? "#121411" : "#999"} size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            filtroStatus !== 'Todos' && styles.filterButtonAtivo,
          ]}
          onPress={() => setMenuAberto('status')}
        >
          <Text style={[styles.filterText, filtroStatus !== 'Todos' && styles.filterTextAtivo]}>
            {filtroStatus}
          </Text>
          <ChevronDown color={filtroStatus !== 'Todos' ? "#121411" : "#999"} size={18} />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date} mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={onChangeDate} maximumDate={new Date()}
        />
      )}

      <RenderDropdown visivel={menuAberto === 'planta'} opcoes={opcoesPlanta} selecionado={filtroPlanta} aoSelecionar={setFiltroPlanta} posicaoEsquerda="29%" />
      <RenderDropdown visivel={menuAberto === 'status'} opcoes={opcoesStatus} selecionado={filtroStatus} aoSelecionar={setFiltroStatus} posicaoEsquerda="51%" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 50 }} />
        ) : dadosFiltrados.length === 0 ? (
          <Text style={{ textAlign: 'center', color: isDarkMode ? '#444' : '#999', marginTop: 40 }}>
            {isFromCache ? 'Sem histórico guardado localmente.' : 'Nenhum registro encontrado.'}
          </Text>
        ) : (
          dadosFiltrados.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyCard, {
                backgroundColor: isDarkMode ? '#121411' : '#FFF',
                borderColor:     isDarkMode ? '#222'    : '#F0F0F0',
              }]}
              onPress={() => navigation.navigate('DiagnosticResult', { resultado: item, isLoggedIn: true })}
            >
              <View style={styles.cardInfo}>
                <Image
                  source={{ uri: item.imagem_url || item.imagem }}
                  style={[styles.imagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#EBF5FB' }]}
                />
                <View style={styles.textGroup}>
                  <Text style={[styles.plantaNome, { color: currentTheme.textPrimary }]}>
                    {item.planta || 'Não identificado'}
                  </Text>
                  <Text style={[styles.plantaStatus, {
                    color: item.estado === 'Saudável' ? "#47e426" : 
                      (item.estado === 'N/A' || item.doenca === 'Desconhecido') ? '#888888' : '#FF5252' 
                    }]}>
                      {item.doenca || item.estado}
                  </Text>
                  <Text style={[styles.plantaData, { color: isDarkMode ? '#666' : '#BBB' }]}>
                    {item.criado_em ? formatDate(new Date(item.criado_em)) : '—'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]} />
                <TouchableOpacity
                  onPress={() => {
                    if (!isOnline) {
                      Alert.alert("Offline", "Não é possível eliminar sem internet.");
                      return;
                    }
                    setSelectedId(item.id);
                    setModalVisible(true);
                  }}
                  style={styles.deleteBtn}
                >
                  <Trash2 color={isOnline ? "#E74C3C" : "#999"} size={22} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Deseja eliminar?"
        description="Esta ação não poderá ser desfeita."
        loading={deletando}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, borderWidth: 1,
  },
  reportBtnText: { fontWeight: '700', fontSize: 13 },
  cacheBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  cacheBannerText: { color: '#f59e0b', fontSize: 12, fontWeight: '600' },
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 25, marginTop: 10, zIndex: 10 },
  filterButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  filterButtonAtivo: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterText: { marginRight: 4, color: '#999', fontWeight: '700', fontSize: 12 },
  filterTextAtivo: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  dropdownContainer: { position: 'absolute', top: 141, width: 160, borderRadius: 18, elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, borderWidth: 1, overflow: 'hidden' },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  dropdownText: { fontSize: 14 },
  historyCard: { flexDirection: 'row', borderRadius: 20, padding: 14, marginBottom: 15, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 65, height: 65, borderRadius: 14 },
  textGroup: { marginLeft: 15 },
  plantaNome: { fontSize: 17, fontWeight: '800' },
  plantaStatus: { fontSize: 14, fontWeight: '700', marginVertical: 3, width: '99%' },
  plantaData: { fontSize: 12 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '60%', marginHorizontal: 12 },
  deleteBtn: { padding: 5 },
});